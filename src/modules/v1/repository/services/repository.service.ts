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

@Injectable()
export class RepositoryService {
    constructor(
        private readonly repositoryRepository: RepositoryRepository,
        private readonly encryptionService: EncryptionService,
        private readonly githubService: GitHubService,
        private readonly eventService: EventsService,
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

    //this method belongs to the git-provider module
   
}