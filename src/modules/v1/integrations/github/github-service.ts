import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { GithubHttp } from "./github-http";
import {  GithubBranchResponse, GithubRepositoryResponse, GithubTreeResponse } from "./github-responses";
import { response } from "express";
@Injectable()
// should implements IGitProvider
export class GitHubService {
    constructor(
        private readonly githubHttp: GithubHttp
    ) { }
    private readonly baseUrl = 'https://api.github.com';

    async validatePatAndGetBranch(
        owner: string,
        repo: string,
        token: string,
        default_branch: string
    ): Promise<GithubRepositoryResponse> {
        try {
            const response = await this.githubHttp.get<GithubRepositoryResponse>(
                `${this.baseUrl}/repos/${owner}/${repo}`,
                token
            );

            if (response.status === 401 || response.status === 403) {
                throw new UnauthorizedException('Invalid PAT token');
            } 

            if (response.status === 404) {
                throw new BadRequestException(`Repository '${owner}/${repo}' not found`);
            }

            if (response.status < 200 || response.status >= 300) {
                throw new BadRequestException('Failed to fetch repository from GitHub');
            }

            const data = response.data;
            
            if (data?.owner?.login !== owner) {
                throw new BadRequestException(`Owner name '${owner}' does not match repository owner`);
            }
            if (data?.default_branch !== default_branch) {
                throw new BadRequestException(`default branch '${default_branch}' does not match repository default branch`);
            }
            return data;
        } catch (error) {
            if (error instanceof BadRequestException || error instanceof UnauthorizedException) {
                throw error;
            }
            throw new BadRequestException(`Failed to validate PAT token or repository `);
        }
    }

    // // get repository
    // async getRepo(owner: string, repo: string, token: string): Promise<GithubRepositoryResponse> {
    //     return await this.githubHttp.get(
    //         `${this.baseUrl}/repos/${owner}/${repo}`, token
    //     );
    // }
    // // get branch commit tree_sha
    
    async getRepoFilesList(owner: string, repo: string, branch: string, token: string): Promise<GithubTreeResponse> {
        const tree_sha = (await this.getBranchData(owner, repo, branch, token))?.commit?.commit?.tree?.sha
        if (!tree_sha) {
            throw new BadRequestException('Failed to find treesha')
        }
        const treeData = await this.getTreeData(owner, repo, tree_sha, token,)
        return treeData
    }

    async getBranchData(owner: string, repo: string, branch: string, token: string): Promise<GithubBranchResponse> {
        const response = await this.githubHttp.get<GithubBranchResponse>(`${this.baseUrl}/repos/${owner}/${repo}/branches/${branch}`, token);
        const data = response.data
        return data
    }

    // // get tree data
    async getTreeData(owner: string, repo: string, tree_sha: string, token: string): Promise<GithubTreeResponse> {
        const response = await this.githubHttp.get<GithubTreeResponse>(
            `${this.baseUrl}/repos/${owner}/${repo}/git/trees/${tree_sha}?recursive=1`, token
        );
        const data = response.data
        return data
    } 

}