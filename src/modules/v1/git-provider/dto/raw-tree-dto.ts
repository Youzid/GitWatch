// not defined well

export class RawTreeDTO {
    sha: string;
    url: string;
    tree: {
        path: string;
        mode: string;
        type: 'blob' | 'tree' | 'commit';
        sha: string;
        size?: number;
        url: string;
    }[];
    truncated: boolean;
}