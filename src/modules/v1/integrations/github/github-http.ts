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
        Authorization: `Bearer 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`,
        Accept: 'application/vnd.github+json',
        // GitHub strongly recommends setting a User-Agent.
        'User-Agent': 'GitWatch',
      },
      validateStatus: () => true,
    });

    return await firstValueFrom(response$);
  }
}