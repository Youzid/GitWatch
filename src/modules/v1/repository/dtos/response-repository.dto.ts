import { Expose } from 'class-transformer';

export class ResponseRepositoryDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  is_active: boolean;

  @Expose()
  default_branch: string;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;

  @Expose()
  repo_provider: string;

  @Expose()
  repo_owner_name: string;
}
