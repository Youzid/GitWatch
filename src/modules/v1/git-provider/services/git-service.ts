import { Injectable, } from '@nestjs/common';
import simpleGit, { SimpleGit, } from 'simple-git';
import * as path from 'path';
import * as fs from 'fs/promises';
import { EncryptionService } from '../../../../infra/utils/encryption.service';

interface FileChange {
    file_name: string;
    file_path: string;
    additions: number;
    deletions: number;
    total_changes: number;
    status: string;
    old_path?: string;
}

interface CommitDetails {
    sha: string;
    author_email: string;
    message: string;
    commit_date: Date;
    parent_shas: string[];
    files_changed: FileChange[];
}


@Injectable()
export class GitService {
    private readonly STORAGE_BASE_PATH = path.join(process.cwd(), 'storage', 'git-data'); // add constant  key or env


    constructor() { }

    async cloneRepository(params: { repositoryId: number, owner: string; repo_name: string; authenticatedUrl: string; token?: string; }): Promise<string> {

        const { repositoryId, owner, repo_name, authenticatedUrl } = params;

        const repoStorageDir = path.join(this.STORAGE_BASE_PATH, repositoryId.toString());

        try {
            if (await this.repositoryExists(repoStorageDir)) {
                const error = new Error(`Repository already exists at ${repoStorageDir}. Use update method instead.`);
                (error as any).statusCode = 409
                throw error;
            }

            await fs.mkdir(repoStorageDir, { recursive: true });

            // const decryptedToken = this.encryptionService.decrypt(token);

            const git = simpleGit();
            git.env('GIT_TERMINAL_PROMPT', '0');
            await git.clone(authenticatedUrl, repoStorageDir, ['--bare',],)

            await this.saveMetadata(repoStorageDir, { repositoryId, owner, repo_name, clonedAt: new Date().toISOString(), lastUpdated: new Date().toISOString() });

            console.log(`Repository cloned successfully to: ${repoStorageDir}`);

            return repoStorageDir;
        } catch (error: any) {
            if (error.statusCode !== 409) {
                await this.removeRepoStorageDir(repositoryId);
            }
            throw new Error(`Failed to clone repository: ${error.message}`);
        }
    }

    private async saveMetadata(repoDir: string, metadata: any): Promise<void> {
        const metadataPath = path.join(repoDir, 'metadata.json');
        await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2), 'utf-8');
    }

    private async repositoryExists(repoPath: string): Promise<boolean> {
        try { await fs.access(repoPath); return true; }
        catch { return false; }
    }


    async removeRepoStorageDir(repositoryId: string | number): Promise<void> {
        const repoStorageDir = path.join(this.STORAGE_BASE_PATH, repositoryId.toString());
        await fs.rm(repoStorageDir, { recursive: true, force: true }).catch(() => { });

    }

    async getCommitsHistory(repositoryId: number): Promise<CommitDetails[]> {
        const repoPath = path.join(this.STORAGE_BASE_PATH, repositoryId.toString());
        const git = simpleGit(repoPath);
        try {
            const log = await git.log({
                // maxCount:1500,  
                format: { hash: '%H', author_email: '%ae', message: '%s', date: '%ai', parent_hashes: '%P', },
            });

            const commits: CommitDetails[] = [];

            for (const commit of log.all) {
                const fileChanges = await this.getFileChanges(commit.hash, git);

                commits.push({
                    sha: commit.hash,
                    author_email: (commit as any).author_email,
                    message: commit.message,
                    commit_date: new Date((commit as any).date),
                    parent_shas: (commit as any).parent_hashes
                        ? (commit as any).parent_hashes.split(' ')
                        : [],
                    files_changed: fileChanges,
                });
            }
            console.log(commits[0]);
            return commits;
        } catch (error: any) {
            throw new Error(`Failed to get commit history: ${error.message}`);
        }
    }

    private async getFileChanges(commitSha: string, git: SimpleGit): Promise<FileChange[]> {
        try {
            // Get detailed diff stats with rename detection
            const diffSummary = await git.diffSummary([
                `${commitSha}^`,// parent hash
                commitSha,// current commit hash
                '--numstat',
                '--find-renames',
            ]);

            const fileChanges: FileChange[] = [];

            for (const file of diffSummary.files) {
                const status = this.determineFileStatus(file);
                const fileName = this.extractFileName(file.file);

                const fileChange: FileChange = {
                    file_name: fileName,
                    file_path: file.file,
                    // @ts-expect-error asdasd
                    additions: file.insertions,
                    // @ts-expect-error asdasd
                    deletions: file.deletions,
                    // @ts-expect-error asdasd
                    total_changes: file.changes,
                    status: status,
                };

                // Check for renamed files
                if (file.file.includes(' => ')) {
                    fileChange.status = 'renamed';
                    const [oldPath, newPath] = this.parseRenamedFile(file.file);
                    fileChange.old_path = oldPath;
                    fileChange.file_path = newPath;
                    fileChange.file_name = this.extractFileName(newPath);
                }

                fileChanges.push(fileChange);
            }

            return fileChanges;
        } catch (error) {
            // @ts-expect-error asdasd
            if (error.message.includes('unknown revision')) {// handling exeption where commit has no parent (initial commit)
                return await this.getInitialCommitFiles(commitSha, git);
            }
            throw error;
        }
    }

    private async getInitialCommitFiles(commitSha: string, git: SimpleGit): Promise<FileChange[]> {
        try {
            const diffSummary = await git.diffSummary([
                '--root',
                commitSha,
                '--numstat',
            ]);

            return diffSummary.files.map((file) => ({
                file_name: this.extractFileName(file.file),
                file_path: file.file,
                // @ts-expect-error asdasd
                additions: file.insertions,
                // @ts-expect-error asdasd
                deletions: file.deletions,
                // @ts-expect-error asdasd
                total_changes: file.changes,
                status: 'added',
            }));
        } catch (error) {
            return [];
        }
    }

    private determineFileStatus(file: any): string {
        if (file.binary) {
            return 'binary_modified';
        }

        if (file.insertions > 0 && file.deletions === 0) {
            return 'added';
        }

        if (file.insertions === 0 && file.deletions > 0) {
            return 'deleted';
        }

        // Otherwise it's modified
        return 'modified';
    }

    private extractFileName(filePath: string): string {
        // Handle renamed files
        if (filePath.includes(' => ')) {
            const [, newPath] = this.parseRenamedFile(filePath);
            filePath = newPath;
        }

        const parts = filePath.split('/');
        return parts[parts.length - 1];
    }

    private parseRenamedFile(fileStr: string): [string, string] {
        // Handle formats like:
        // "old/path/file.txt => new/path/file.txt"
        // "{old => new}/path/file.txt"

        if (fileStr.includes('{') && fileStr.includes('}')) {
            // Handle {old => new} format
            const match = fileStr.match(/(.*)?\{(.*?)\s*=>\s*(.*?)\}(.*)?/);
            if (match) {
                const prefix = match[1] || '';
                const oldPart = match[2];
                const newPart = match[3];
                const suffix = match[4] || '';
                return [`${prefix}${oldPart}${suffix}`, `${prefix}${newPart}${suffix}`];
            }
        }

        // Handle simple "old => new" format
        const parts = fileStr.split(' => ');
        return parts.length === 2 ? [parts[0].trim(), parts[1].trim()] : [fileStr, fileStr];
    }

}


