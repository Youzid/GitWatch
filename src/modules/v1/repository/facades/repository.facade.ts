import { Injectable } from '@nestjs/common';
import { RepositoryService } from '../services/repository.service';
import { CreateRepositoryDto } from '../dtos/create-repository.dto';

@Injectable()
export class RepositoryFacade {
  constructor(private readonly repositoryService: RepositoryService) {}

  async create(createRepositoryDto: CreateRepositoryDto, user:number) {
    return this.repositoryService.create(createRepositoryDto,user);
  }

}
