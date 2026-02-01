import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { GithubHttp } from "../config/github-http";
import {GithubBranchResponse, GithubRepositoryResponse, GithubTreeResponse } from "../dto/github-responses";
import { RepoDTO } from "../dto/repo-dto";

@Injectable()
export class GitHubService {
    constructor(
        private readonly githubHttp: GithubHttp
    ) { }
    private readonly baseUrl = 'https://api.github.com';

    async validatePatAndGetBranch({ owner, repo_name, token, default_branch }: RepoDTO): Promise<{valid: boolean}> {
        try {
            const response = await this.githubHttp.get<GithubRepositoryResponse>(
                `${this.baseUrl}/repos/${owner}/${repo_name}`,
                token
            );

            const data = response.data;

            if (data?.owner?.login !== owner) {
                throw new BadRequestException(`Owner name '${owner}' does not match repository owner`);
            }
            if (data?.default_branch !== default_branch) {
                throw new BadRequestException(`Default branch '${default_branch}' does not match repository default branch`);
            }

            return {valid: true};
        } catch (error) {
            if (error instanceof BadRequestException || error instanceof UnauthorizedException) {
                throw error;
            }
            throw new BadRequestException(`Failed to validate PAT token or repository`);
        }
    }

    async getTreeData({ owner, repo_name, token, default_branch }: RepoDTO): Promise<GithubTreeResponse> {

        const tree_sha = await this.getBranchData({ owner, repo_name, default_branch, token });

        if (!tree_sha) {
            throw new BadRequestException('Failed to find treesha');
        }

        try {
            const response = await this.githubHttp.get<GithubTreeResponse>(
                `${this.baseUrl}/repos/${owner}/${repo_name}/git/trees/${tree_sha}?recursive=1`,
                token
            );

            return response.data;
        } catch (error) {
            if (error instanceof BadRequestException || error instanceof UnauthorizedException) {
                throw error;
            }
            // Generic fallback for unknown errors
            throw new BadRequestException(`Failed to fetch tree data`);
        }
    }

    async getBranchData({ owner, repo_name, default_branch, token }: RepoDTO): Promise<string> {
        const response = await this.githubHttp.get<GithubBranchResponse>(`${this.baseUrl}/repos/${owner}/${repo_name}/branches/${default_branch}`, token);
        const tree_sha = response?.data?.commit?.commit?.tree?.sha
        return tree_sha;
    }
}
