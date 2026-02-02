import { Module } from '@nestjs/common';
import { RepositoryController } from './controllers/repository.controller';
import { RepositoryService } from './services/repository.service';
import { RepositoryFacade } from './facades/repository.facade';
import { RepositoryRepository } from './repositories/repository.repository';
import { DatabaseModule } from '../../../infra/database/database.module';
import { GithubModule } from '../git-provider/github-module';
import { RepositoryEventsListener } from './events/repository-events-listener';
import { RepositoryQueueService } from './services/repository-queue-service';
import { RepositoryNormalizeProcessor } from './processor/repositoryNormalizeProcessor';

@Module({
   imports: [DatabaseModule,GithubModule],
  controllers: [RepositoryController],
  providers: [RepositoryService, RepositoryFacade, RepositoryRepository,RepositoryEventsListener,RepositoryQueueService,RepositoryNormalizeProcessor],
  exports: [RepositoryFacade],
})
export class RepositoryModule {}
