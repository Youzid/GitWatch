// github-http.ts
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
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

    return await firstValueFrom(response$);
  }
}