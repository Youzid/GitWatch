
export interface GithubRepositoryResponse {
    id: number;
    node_id: string;
    name: string;
    full_name: string;
    owner: {
      login: string;
      id: number;
      node_id: string;
      avatar_url: string;
      gravatar_id: string;
      url: string;
      html_url: string;
      type: string;
      site_admin: boolean;
    };
    default_branch: string;
  }

export interface GithubBranchResponse {
    name: string;
    commit: {
      sha: string;
      node_id: string;
      commit: {
        author: {
          name: string;
          email: string;
          date: string;
        };
        committer: {
          name: string;
          email: string;
          date: string;
        };
        message: string;
        tree: {
          sha: string;
          url: string;
        };
        url: string;
        comment_count: number;
      };
      url: string;
      html_url: string;
      comments_url: string;
      author: {
        login: string;
        id: number;
        node_id: string;
        avatar_url: string;
        gravatar_id: string;
        url: string;
        html_url: string;
        followers_url: string;
        following_url: string;
        gists_url: string;
        starred_url: string;
        subscriptions_url: string;
        organizations_url: string;
        repos_url: string;
        events_url: string;
        received_events_url: string;
        type: string;
        user_view_type: string;
        site_admin: boolean;
      } ;
      committer: {
        login: string;
        id: number;
        node_id: string;
        avatar_url: string;
        gravatar_id: string;
        url: string;
        html_url: string;
        followers_url: string;
        following_url: string;
        gists_url: string;
        starred_url: string;
        subscriptions_url: string;
        organizations_url: string;
        repos_url: string;
        events_url: string;
        received_events_url: string;
        type: string;
        user_view_type: string;
        site_admin: boolean;
      } ;
      parents: Array<{
        sha: string;
        url: string;
        html_url: string;
      }>;
    };
    protected: boolean;
  }

export interface GithubTreeResponse {
    sha: string;
    url: string;
    tree: Array<{
      path: string;
      mode: "100644" | '040000';
      type: 'blob' | 'tree';
      sha: string;
      size?: number;
      url: string;
    }>;
    truncated: boolean;
  }




   