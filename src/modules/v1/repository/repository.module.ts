import { Module } from '@nestjs/common';
import { RepositoryController } from './controllers/repository.controller';
import { RepositoryService } from './services/repository.service';
import { RepositoryFacade } from './facades/repository.facade';
import { RepositoryRepository } from './repositories/repository.repository';
import { DatabaseModule } from '../../../infra/database/database.module';
import { EncryptionService } from '../../../infra/utils/encryption';
import { GithubModule } from '../git-provider/github-module';

@Module({
   imports: [DatabaseModule,GithubModule],
  controllers: [RepositoryController],
  providers: [RepositoryService, RepositoryFacade, RepositoryRepository,EncryptionService],
  exports: [RepositoryFacade],
})
export class RepositoryModule {}
