import { Module } from '@nestjs/common';
import { GitHubService } from './services/github-service';
import { GithubHttp } from './github-http';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [HttpModule],
    providers: [GitHubService, GithubHttp],
    exports: [GitHubService,],
})
export class GithubModule { }
