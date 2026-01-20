import { RawCommitDto } from "../dto/raw-commit-dto.ts";
import { RawRepositoryDto } from "../dto/raw-repository-dto";
import { RawTreeDto } from "../dto/raw-tree-dto.js";

export interface IGitProvider {
  getRepositoryData(id: string): Promise<RawRepositoryDto>;
  getTreeData(repoId,tree_sha: string): Promise<RawTreeDto[]>;
  getCommitsData(repoId: string): Promise<RawCommitDto[]>;
}