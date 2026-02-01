// github-http.ts
import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';

@Injectable()
export class GithubHttp {
  constructor(private readonly http: HttpService) {}

  async get<T>(url: string, token: string): Promise<AxiosResponse<T>> {
    const response$ = this.http.get<T>(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': 'GitWatch',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      validateStatus: () => true,
    });

    const response = await firstValueFrom(response$);

    // Handle common GitHub REST API errors
    this.handleCommonGitHubErrors(response);

    return response;
  }

  private handleCommonGitHubErrors(response: AxiosResponse): void {
    if (response.status === 401 || response.status === 403) {
      throw new UnauthorizedException('Invalid PAT token or insufficient permissions');
    }

    if (response.status === 404) {
      throw new BadRequestException('Resource not found');
    }

    if (response.status < 200 || response.status >= 300) {
      throw new BadRequestException('GitHub API request failed');
    }
  }
}