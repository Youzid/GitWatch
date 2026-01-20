// not defined well
export class RawCommitDto {
  sha: string;
  message: string;
  author: {
    name: string;
    email: string;
    date: Date;
  };
  committer: {
    name: string;
    email: string;
    date: Date;
  };
  tree: {
    sha: string;
  };
  parents: Array<{
    sha: string;
  }>;
  url: string;
  html_url: string;
}