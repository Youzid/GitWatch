import { RawCommitDTO } from "../dto/raw-commit-dto.ts.js";
import { RawRepositoryDTO } from "../dto/raw-repository-dto.js";
import { RawTreeDTO } from "../dto/raw-tree-dto.js";

export interface IGitProvider {
  getRepositoryData(id: string): Promise<RawRepositoryDTO>;
  getTreeData(repoId,tree_sha: string): Promise<RawTreeDTO[]>;
  getCommitsData(repoId: string): Promise<RawCommitDTO[]>;
}