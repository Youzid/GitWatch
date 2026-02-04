import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { RepositoryRepository } from '../repositories/repository.repository';
import { CreateRepositoryDto } from '../dtos/create-repository.dto';

import { DB } from '../../../../infra/database/database.types';
import { Insertable } from 'kysely';
import { EncryptionService } from '../../../../infra/utils/encryption.service';
import { ResponseRepositoryDto } from '../dtos/response-repository.dto';
import { plainToClass } from 'class-transformer';
import { GitHubService } from '../../git-provider/services/github-service';
import { EVENTS } from '../../../../infra/events/events.constants';
import { EventsService } from '../../../../infra/events/events.service';
import { RedisService } from '../../../../infra/redis/redis.service';
import { CACHE_KEYS } from '../../../../infra/redis/redis-keys.constants';

interface GitHubTreeItem {
  path: string;
  mode: string;
  type: 'blob' | 'tree';
  sha: string;
  size?: number;
  url: string;
}

interface GitHubTreeResponse {
  sha: string;
  url: string;
  tree: GitHubTreeItem[];
}
@Injectable()
export class RepositoryService {
    constructor(
        private readonly repositoryRepository: RepositoryRepository,
        private readonly encryptionService: EncryptionService,
        private readonly githubService: GitHubService,
        private readonly eventService: EventsService,
        private readonly redisService: RedisService,
    ) { }

    async create(dto: CreateRepositoryDto, userId: number) {
        const existingRepo = await this.repositoryRepository.findByName(dto.name, userId)
        if (existingRepo) {
            throw new ConflictException(`Repository '${dto.name}' already exists`);
        }
        const encryptedToken = this.encryptionService.encrypt(dto.patToken);
        await this.githubService.validatePatAndGetBranch({owner: dto.repoOwnerName, repo_name: dto.name, token: encryptedToken, default_branch: dto.defaultBranch});

        const repository_data: Insertable<DB['repositories']> = 
        {
            is_active: false,
            repo_owner_name: dto.repoOwnerName,
            repo_provider: "github",
            name: dto.name,
            default_branch: dto.defaultBranch,
            repo_token_encrypted: encryptedToken,
        }
        const savedData = await this.repositoryRepository.create(repository_data, userId);

        this.eventService.emit(EVENTS.REPOSITORY_CREATED, { repositoryId: savedData.id,owner: dto.repoOwnerName, repo_name: dto.name, default_branch: dto.defaultBranch, token: encryptedToken, });

        return plainToClass(ResponseRepositoryDto, savedData, { excludeExtraneousValues: true });
    }

    async findAll(userId: number) {
        const repositories = await this.repositoryRepository.findAll(userId);
        return repositories.map(repo => plainToClass(ResponseRepositoryDto, repo, { excludeExtraneousValues: true }));
    }

    async findOne(id: number, userId: number) {
        const repository = await this.repositoryRepository.findById(id, userId);
        if (!repository) {
            throw new NotFoundException(`Repository with id '${id}' not found`);
        }
        return plainToClass(ResponseRepositoryDto, repository, { excludeExtraneousValues: true });
    }

 
    async addFilesTree(repoid: number) {
        const redisRawTreeList : GitHubTreeResponse = await this.redisService.get(CACHE_KEYS.raw.tree(23));

        const normalizedFiles = this.normalizeTreeData(redisRawTreeList.tree, repoid);

        await this.repositoryRepository.bulkInsertFiles(normalizedFiles);
        
        //emit event should be added
        return { success: true, filesCount: normalizedFiles.length };
    }

    private normalizeTreeData(tree: GitHubTreeItem[],repoid: number,): any[] {
        
        return tree.map((item) => {
            const pathParts = item.path.split('/');
            const name = pathParts[pathParts.length - 1];
            const depth = pathParts.length - 1;
            const parent_path = depth === 0 ? null : pathParts.slice(0, -1).join('/');

            return {
                repository_id: repoid,
                path: item.path,
                size: item.size || null,
                type: item.type === 'blob' ? 'BLOB' : 'TREE',
                name: name,
                parent_path: parent_path,
                sha: item.sha,
                url: item.url,
                depth: depth,
            };
        });
    }
}