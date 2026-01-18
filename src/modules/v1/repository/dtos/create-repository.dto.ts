import { IsString } from 'class-validator';

export class CreateRepositoryDto {
  @IsString()
  name: string;

  @IsString()
  repoOwnerName: string;

  @IsString()
  patToken: string;

  @IsString()
  defaultBranch: string;
}
