import { Injectable } from '@nestjs/common';
import { RepositoryService } from '../services/repository.service';
import { CreateRepositoryDto } from '../dtos/create-repository.dto';
import { UpdateRepositoryDto } from '../dtos/update-repository.dto';

@Injectable()
export class RepositoryFacade {
  constructor(private readonly repositoryService: RepositoryService) {}

  async create(createRepositoryDto: CreateRepositoryDto) {
    return this.repositoryService.create(createRepositoryDto);
  }

  
  async findOne(id: string) {
    return this.repositoryService.findOne(id);
  }

  async update(id: string, updateRepositoryDto: UpdateRepositoryDto) {
    return this.repositoryService.update(id, updateRepositoryDto);
  }


}
