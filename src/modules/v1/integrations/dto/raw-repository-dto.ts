// not defined well
export class RawRepositoryDto {
  id: string;
  name: string;
  full_name: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  description: string;
  url: string;
  html_url: string;
  default_branch: string;
  private: boolean;
  created_at: Date;
  updated_at: Date;
  pushed_at: Date;
}