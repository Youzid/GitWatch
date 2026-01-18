import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { RepositoryRepository } from '../repositories/repository.repository';
import { CreateRepositoryDto } from '../dtos/create-repository.dto';

import { DB } from '../../../../infra/database/database.types';
import { Insertable } from 'kysely';
import { EncryptionService } from '../../../../infra/utils/encryption';
import { ResponseRepositoryDto } from '../dtos/response-repository.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class RepositoryService {
    constructor(
        private readonly repositoryRepository: RepositoryRepository,
        private readonly encryptionService: EncryptionService,
    ) { }

    async create(dto: CreateRepositoryDto, userId: number) {
        const existingRepo = await this.repositoryRepository.findByName(dto.name, userId)
        if (existingRepo) {
            throw new ConflictException(`Repository '${dto.name}' already exists`);
        }
        await this.validatePatAndGetBranch(dto.repoOwnerName, dto.name, dto.patToken, dto.defaultBranch);

        const encryptedToken = this.encryptionService.encrypt(dto.patToken);
        const repository_data: Insertable<DB['repositories']> = {
            is_active: false,
            repo_owner_name: dto.repoOwnerName,
            repo_provider: "github",
            name: dto.name,
            default_branch: dto.defaultBranch,
            repo_token_encrypted: encryptedToken,
        }
        const savedData = await this.repositoryRepository.create(repository_data, userId)
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
    private async validatePatAndGetBranch(
        owner: string,
        repo: string,
        patToken: string,
        default_branch: string
    ): Promise<void> {
        try {
            const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
                headers: {
                    Authorization: `Bearer ${patToken}`,
                    Accept: 'application/vnd.github.v3+json',
                },
            });

            if (response.status === 401 || response.status === 403) {
                throw new UnauthorizedException('Invalid PAT token');
            }

            if (response.status === 404) {
                throw new BadRequestException(`Repository '${owner}/${repo}' not found`);
            }

            if (!response.ok) {
                throw new BadRequestException('Failed to fetch repository from GitHub');
            }

            const data = await response.json();
            console.log(data)

            if (data?.owner?.login !== owner) {
                throw new BadRequestException(`Owner name '${owner}' does not match repository owner`);
            }
            if (data?.default_branch !== default_branch) {
                throw new BadRequestException(`default branch '${default_branch}' does not match repository default branch`);
            }
        } catch (error) {
            if (error instanceof BadRequestException || error instanceof UnauthorizedException) {
                throw error;
            }
            throw new BadRequestException('Failed to validate PAT token or repository');
        }
    }
}