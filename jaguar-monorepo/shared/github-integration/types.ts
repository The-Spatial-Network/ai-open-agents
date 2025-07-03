export interface GitHubRepository {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  language: string | null;
  stargazersCount: number;
  forksCount: number;
  openIssuesCount: number;
  defaultBranch: string;
  createdAt: string;
  updatedAt: string;
  htmlUrl: string;
  cloneUrl: string;
}

export interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  body: string | null;
  state: 'open' | 'closed';
  labels: string[];
  assignees: string[];
  createdAt: string;
  updatedAt: string;
  htmlUrl: string;
}

export interface GitHubPullRequest {
  id: number;
  number: number;
  title: string;
  body: string | null;
  state: 'open' | 'closed';
  head: string;
  base: string;
  createdAt: string;
  updatedAt: string;
  htmlUrl: string;
}

export interface CodeAnalysis {
  totalFiles: number;
  totalDirectories: number;
  filesByExtension: Record<string, number>;
  mainLanguages: Array<{
    extension: string;
    count: number;
  }>;
  structure: string[];
}

export interface GitHubWebhookPayload {
  action: string;
  repository: {
    name: string;
    full_name: string;
    owner: {
      login: string;
    };
  };
  issue?: {
    number: number;
    title: string;
    body: string;
    state: string;
  };
  pull_request?: {
    number: number;
    title: string;
    body: string;
    state: string;
  };
}

export interface SelfDevelopmentTask {
  id: string;
  type: 'bug_fix' | 'feature' | 'improvement' | 'documentation' | 'test';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  assignedAgent?: string;
  repository: {
    owner: string;
    name: string;
  };
  files: string[];
  createdAt: string;
  updatedAt: string;
  githubIssue?: {
    number: number;
    url: string;
  };
}

export interface AgentCapability {
  name: string;
  description: string;
  supportedFileTypes: string[];
  canCreate: boolean;
  canModify: boolean;
  canAnalyze: boolean;
  canTest: boolean;
}

export interface DevelopmentAgent {
  id: string;
  name: string;
  role: 'code_analyzer' | 'issue_manager' | 'development_coordinator' | 'tester' | 'documenter';
  capabilities: AgentCapability[];
  status: 'active' | 'idle' | 'busy' | 'offline';
  currentTask?: string;
  completedTasks: number;
  successRate: number;
}
