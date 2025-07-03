import { Octokit } from '@octokit/rest';
import { GitHubRepository, GitHubIssue, GitHubPullRequest, CodeAnalysis } from './types';

export class GitHubClient {
  private octokit: Octokit;

  constructor(token: string) {
    this.octokit = new Octokit({
      auth: token,
    });
  }

  /**
   * Get repository information and structure
   */
  async getRepository(owner: string, repo: string): Promise<GitHubRepository> {
    const { data } = await this.octokit.repos.get({
      owner,
      repo,
    });

    return {
      id: data.id,
      name: data.name,
      fullName: data.full_name,
      description: data.description,
      language: data.language,
      stargazersCount: data.stargazers_count,
      forksCount: data.forks_count,
      openIssuesCount: data.open_issues_count,
      defaultBranch: data.default_branch,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      htmlUrl: data.html_url,
      cloneUrl: data.clone_url,
    };
  }

  /**
   * Get repository file tree structure
   */
  async getRepositoryTree(owner: string, repo: string, sha?: string): Promise<any> {
    const { data } = await this.octokit.git.getTree({
      owner,
      repo,
      tree_sha: sha || 'HEAD',
      recursive: 'true',
    });

    return data.tree;
  }

  /**
   * Get file content from repository
   */
  async getFileContent(owner: string, repo: string, path: string, ref?: string): Promise<string> {
    const { data } = await this.octokit.repos.getContent({
      owner,
      repo,
      path,
      ref,
    });

    if ('content' in data && data.content) {
      return Buffer.from(data.content, 'base64').toString('utf-8');
    }

    throw new Error('File content not found or is a directory');
  }

  /**
   * Create a new issue
   */
  async createIssue(
    owner: string,
    repo: string,
    title: string,
    body: string,
    labels?: string[],
    assignees?: string[]
  ): Promise<GitHubIssue> {
    const { data } = await this.octokit.issues.create({
      owner,
      repo,
      title,
      body,
      labels,
      assignees,
    });

    return {
      id: data.id,
      number: data.number,
      title: data.title,
      body: data.body,
      state: data.state as 'open' | 'closed',
      labels: data.labels.map((label) => 
        typeof label === 'string' ? label : label.name || ''
      ),
      assignees: data.assignees?.map((assignee) => assignee.login) || [],
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      htmlUrl: data.html_url,
    };
  }

  /**
   * List repository issues
   */
  async listIssues(
    owner: string,
    repo: string,
    state: 'open' | 'closed' | 'all' = 'open'
  ): Promise<GitHubIssue[]> {
    const { data } = await this.octokit.issues.listForRepo({
      owner,
      repo,
      state,
    });

    return data.map((issue) => ({
      id: issue.id,
      number: issue.number,
      title: issue.title,
      body: issue.body,
      state: issue.state as 'open' | 'closed',
      labels: issue.labels.map((label) => 
        typeof label === 'string' ? label : label.name || ''
      ),
      assignees: issue.assignees?.map((assignee) => assignee.login) || [],
      createdAt: issue.created_at,
      updatedAt: issue.updated_at,
      htmlUrl: issue.html_url,
    }));
  }

  /**
   * Update an existing issue
   */
  async updateIssue(
    owner: string,
    repo: string,
    issueNumber: number,
    updates: {
      title?: string;
      body?: string;
      state?: 'open' | 'closed';
      labels?: string[];
      assignees?: string[];
    }
  ): Promise<GitHubIssue> {
    const { data } = await this.octokit.issues.update({
      owner,
      repo,
      issue_number: issueNumber,
      ...updates,
    });

    return {
      id: data.id,
      number: data.number,
      title: data.title,
      body: data.body,
      state: data.state as 'open' | 'closed',
      labels: data.labels.map((label) => 
        typeof label === 'string' ? label : label.name || ''
      ),
      assignees: data.assignees?.map((assignee) => assignee.login) || [],
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      htmlUrl: data.html_url,
    };
  }

  /**
   * Trigger GitHub Actions workflow
   */
  async triggerWorkflow(
    owner: string,
    repo: string,
    workflowId: string,
    ref: string = 'main',
    inputs?: Record<string, any>
  ): Promise<void> {
    await this.octokit.actions.createWorkflowDispatch({
      owner,
      repo,
      workflow_id: workflowId,
      ref,
      inputs,
    });
  }

  /**
   * Analyze repository code structure
   */
  async analyzeCodebase(owner: string, repo: string): Promise<CodeAnalysis> {
    const tree = await this.getRepositoryTree(owner, repo);
    const files = tree.filter((item: any) => item.type === 'blob');
    
    // Group files by extension
    const filesByExtension: Record<string, number> = {};
    const directories: Set<string> = new Set();
    
    files.forEach((file: any) => {
      const extension = file.path.split('.').pop() || 'no-extension';
      filesByExtension[extension] = (filesByExtension[extension] || 0) + 1;
      
      const dir = file.path.split('/').slice(0, -1).join('/');
      if (dir) directories.add(dir);
    });

    return {
      totalFiles: files.length,
      totalDirectories: directories.size,
      filesByExtension,
      mainLanguages: Object.entries(filesByExtension)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([ext, count]) => ({ extension: ext, count })),
      structure: Array.from(directories).sort(),
    };
  }

  /**
   * Create a pull request
   */
  async createPullRequest(
    owner: string,
    repo: string,
    title: string,
    body: string,
    head: string,
    base: string = 'main'
  ): Promise<GitHubPullRequest> {
    const { data } = await this.octokit.pulls.create({
      owner,
      repo,
      title,
      body,
      head,
      base,
    });

    return {
      id: data.id,
      number: data.number,
      title: data.title,
      body: data.body,
      state: data.state as 'open' | 'closed',
      head: data.head.ref,
      base: data.base.ref,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      htmlUrl: data.html_url,
    };
  }
}
