import { auth } from '@/app/(auth)/auth';
import { redirect } from 'next/navigation';
import {
  BookOpen,
  Search,
  FileText,
  Lightbulb,
  Cpu,
  Globe,
  Workflow,
  Database,
  Leaf,
  Code,
  ArrowRight,
  ExternalLink,
  MessageCircle,
  Zap,
  Users,
  GitBranch,
  Terminal,
  Puzzle,
  Rocket,
  Heart,
  Star,
  Download,
  Play,
  CheckCircle,
  Circle,
  Bot,
  Sparkles,
  Target,
  Book,
  Wrench,
  Github,
  Coffee,
  Compass,
  Clock,
  Award,
  Layers,
  Shield,
  Beaker,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const quickStartSteps = [
  {
    id: 'environment',
    title: 'Development Environment',
    description: 'Set up VS Code, Cline, and essential dev tools',
    icon: Terminal,
    status: 'pending',
    estimatedTime: '10 min',
    clinePrompt:
      'Help me set up my development environment for Jaguar SDK with VS Code and Cline extension',
    tasks: [
      'Install VS Code',
      'Install Cline VS Code Extension',
      'Set up project folder structure',
      'Install Node.js, Git, and essential tools',
    ],
  },
  {
    id: 'jaguar-setup',
    title: 'Jaguar SDK Setup',
    description: 'Configure database, AI models, and environment',
    icon: Cpu,
    status: 'pending',
    estimatedTime: '15 min',
    clinePrompt:
      'Guide me through setting up Jaguar SDK with Supabase database and xAI API configuration',
    tasks: [
      'Create Supabase project',
      'Configure environment variables',
      'Set up xAI API key',
      'Run database migrations',
    ],
  },
  {
    id: 'first-agent',
    title: 'Build Your First Agent',
    description: 'Create a conscious AI agent with Cline assistance',
    icon: Bot,
    status: 'pending',
    estimatedTime: '20 min',
    clinePrompt:
      'Help me build my first AI agent using Jaguar SDK with permaculture ethics integration',
    tasks: [
      'Choose agent template',
      'Configure agent personality',
      'Add permaculture ethics',
      'Test and deploy agent',
    ],
  },
];

const sdkComponents = [
  {
    id: 'api-docs',
    title: 'API Documentation',
    description: 'Complete reference for all Jaguar SDK APIs',
    icon: Book,
    color: 'blue',
    features: [
      'Interactive API Explorer',
      'Live Code Examples',
      'Authentication Guides',
      'Rate Limiting Info',
    ],
    clineIntegration: true,
  },
  {
    id: 'component-library',
    title: 'Component Library',
    description: 'Reusable React components for AI interfaces',
    icon: Puzzle,
    color: 'purple',
    features: [
      'Chat Components',
      'Agent Cards',
      'Progress Indicators',
      'Accessibility Built-in',
    ],
    clineIntegration: true,
  },
  {
    id: 'cli-tools',
    title: 'CLI Tools',
    description: 'Command-line utilities for development',
    icon: Terminal,
    color: 'green',
    features: [
      'Project Scaffolding',
      'Agent Deployment',
      'Database Management',
      'Testing Utilities',
    ],
    clineIntegration: true,
  },
  {
    id: 'testing-framework',
    title: 'Testing Framework',
    description: 'Comprehensive testing tools for AI agents',
    icon: Beaker,
    color: 'orange',
    features: [
      'Agent Behavior Testing',
      'Ethics Compliance Checks',
      'Performance Benchmarks',
      'Integration Tests',
    ],
    clineIntegration: true,
  },
];

const contributionPaths = [
  {
    id: 'developer',
    title: 'Developer',
    description: 'Contribute code, fix bugs, add features',
    icon: Code,
    color: 'blue',
    skills: ['JavaScript/TypeScript', 'React', 'Node.js', 'AI/ML'],
    firstSteps: [
      'Fork the repository',
      'Set up development environment',
      'Find good first issues',
      'Submit your first PR',
    ],
    clinePrompt:
      'Help me contribute code to Jaguar SDK - show me good first issues and guide me through the development setup',
  },
  {
    id: 'designer',
    title: 'Designer',
    description: 'Improve UX/UI, create assets, design systems',
    icon: Sparkles,
    color: 'purple',
    skills: ['UI/UX Design', 'Figma', 'Accessibility', 'Design Systems'],
    firstSteps: [
      'Review design guidelines',
      'Identify improvement areas',
      'Create design proposals',
      'Collaborate with developers',
    ],
    clinePrompt:
      'Help me contribute to Jaguar SDK design - show me the current design system and areas for improvement',
  },
  {
    id: 'writer',
    title: 'Technical Writer',
    description: 'Improve docs, write tutorials, create guides',
    icon: FileText,
    color: 'green',
    skills: [
      'Technical Writing',
      'Documentation',
      'Tutorials',
      'Communication',
    ],
    firstSteps: [
      'Review existing documentation',
      'Identify gaps and improvements',
      'Write clear, helpful content',
      'Test documentation accuracy',
    ],
    clinePrompt:
      'Help me contribute to Jaguar SDK documentation - show me areas that need better documentation or tutorials',
  },
  {
    id: 'community',
    title: 'Community Builder',
    description: 'Help others, organize events, spread awareness',
    icon: Users,
    color: 'orange',
    skills: [
      'Community Management',
      'Event Planning',
      'Social Media',
      'Mentoring',
    ],
    firstSteps: [
      'Join community discussions',
      'Help answer questions',
      'Organize local meetups',
      'Share success stories',
    ],
    clinePrompt:
      'Help me build the Jaguar SDK community - show me ways to help other developers and organize community activities',
  },
];

const documentationModules = [
  {
    id: 'jaguar',
    title: 'Jaguar Core',
    description:
      'AI developer agent with permaculture ethics and masterclass wisdom',
    icon: Cpu,
    color: 'jaguar-indigo',
    topics: [
      'Architecture Overview',
      'Model Capabilities',
      'API Integration',
      'Permaculture Ethics',
      'Masterclass Wisdom',
    ],
    status: 'complete',
    clineIntegration: true,
  },
  {
    id: 'cline',
    title: 'Cline Integration',
    description: 'AI-powered development with Cline VS Code extension',
    icon: Bot,
    color: 'blue',
    topics: [
      'Cline Setup & Configuration',
      'Effective Prompting',
      'Plan & Act Workflows',
      'Debugging with Cline',
      'Advanced Techniques',
    ],
    status: 'featured',
    clineIntegration: true,
  },
  {
    id: 'openwebui',
    title: 'OpenWebUI',
    description:
      'Self-hosted AI interface with model management and API endpoints',
    icon: Globe,
    color: 'blue',
    topics: [
      'Setup & Configuration',
      'Model Management',
      'API Endpoints',
      'Authentication',
      'Troubleshooting',
    ],
    status: 'complete',
    externalLink: 'https://docs.openwebui.com/',
    clineIntegration: true,
  },
  {
    id: 'n8n',
    title: 'n8n Workflows',
    description: 'Workflow automation and agent orchestration platform',
    icon: Workflow,
    color: 'purple',
    topics: [
      'Integration Patterns',
      'Workflow Templates',
      'Agent Orchestration',
      'Data Pipelines',
      'Custom Nodes',
    ],
    status: 'complete',
    externalLink: 'https://docs.n8n.io/',
    clineIntegration: false,
  },
  {
    id: 'react',
    title: 'React Development',
    description: 'Modern React patterns for building conscious AI interfaces',
    icon: Code,
    color: 'cyan',
    topics: [
      'Component Architecture',
      'State Management',
      'Hooks & Context',
      'Performance Optimization',
      'Testing Strategies',
    ],
    status: 'complete',
    externalLink: 'https://react.dev/',
    clineIntegration: true,
  },
  {
    id: 'nextjs',
    title: 'Next.js Framework',
    description: 'Full-stack React framework for production AGI applications',
    icon: FileText,
    color: 'gray',
    topics: [
      'App Router',
      'Server Components',
      'API Routes',
      'Deployment',
      'Performance',
    ],
    status: 'complete',
    externalLink: 'https://nextjs.org/docs',
    clineIntegration: true,
  },
];

const ethicsModule = {
  id: 'ethics',
  title: 'AGI & Permaculture Ethics',
  description:
    'Conscious AI development with Earth Care, People Care, Fair Share',
  icon: Leaf,
  color: 'green',
  topics: [
    'Permaculture Principles',
    'Ethical AI Frameworks',
    'Seven Generations Thinking',
    'Community Governance',
    'Regenerative Technology',
  ],
  status: 'featured',
};

export default async function KnowledgePage() {
  const session = await auth();

  if (!session) {
    redirect('/api/auth/guest');
  }

  return (
    <div className="flex flex-col min-h-screen bg-black text-white overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-sm border-b border-gray-800">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-jaguar-indigo to-blue-400 bg-clip-text text-transparent">
                Knowledge Hub
              </h1>
              <p className="text-gray-400">
                World-class documentation for the first open source AGI platform
                built with Cline
              </p>
            </div>
            <div className="flex gap-3">
              <Button className="jaguar-button-indigo">
                <Search className="mr-2" size={16} />
                Search Docs
              </Button>
              <Button
                variant="outline"
                className="border-gray-600 hover:bg-gray-800"
              >
                <MessageCircle className="mr-2" size={16} />
                Ask Jaguar
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 space-y-8">
        {/* Interactive Setup Wizard */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-2 flex items-center">
                <Rocket className="mr-3 text-jaguar-indigo" size={24} />
                Interactive Setup Wizard
              </h2>
              <p className="text-gray-400">
                Get started with Jaguar SDK using Cline AI assistance - perfect
                for new coders!
              </p>
            </div>
            <Button className="bg-green-600 hover:bg-green-700">
              <Play className="mr-2" size={16} />
              Start Wizard
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {quickStartSteps.map((step, index) => (
              <div
                key={step.id}
                className="jaguar-card hover:border-jaguar-indigo/50 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-jaguar-indigo rounded-full flex items-center justify-center mr-3 text-sm font-bold">
                      {index + 1}
                    </div>
                    <step.icon className="text-jaguar-indigo" size={20} />
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="mr-1" size={12} />
                    {step.estimatedTime}
                  </div>
                </div>

                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{step.description}</p>

                <div className="space-y-2 mb-4">
                  {step.tasks.map((task) => (
                    <div
                      key={task}
                      className="flex items-center text-xs text-gray-500"
                    >
                      <Circle size={8} className="mr-2 fill-current" />
                      {task}
                    </div>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-jaguar-indigo/30 hover:bg-jaguar-indigo/10 text-jaguar-indigo"
                >
                  <Bot className="mr-2" size={14} />
                  Ask Cline to Help
                </Button>
              </div>
            ))}
          </div>
        </section>

        {/* SDK Developer Tools */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-2 flex items-center">
                <Wrench className="mr-3 text-blue-400" size={24} />
                SDK Developer Tools
              </h2>
              <p className="text-gray-400">
                Traditional SDK components enhanced with Cline integration for
                AI-powered development
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sdkComponents.map((component) => (
              <div
                key={component.id}
                className="jaguar-card hover:border-gray-600 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-10 h-10 bg-${component.color}-500/20 rounded-lg flex items-center justify-center`}
                  >
                    <component.icon
                      className={`text-${component.color}-400`}
                      size={20}
                    />
                  </div>
                  {component.clineIntegration && (
                    <div className="flex items-center text-xs text-blue-400 bg-blue-500/10 px-2 py-1 rounded">
                      <Bot size={10} className="mr-1" />
                      Cline
                    </div>
                  )}
                </div>

                <h3 className="font-semibold mb-2">{component.title}</h3>
                <p className="text-gray-400 text-sm mb-4">
                  {component.description}
                </p>

                <div className="space-y-1 mb-4">
                  {component.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center text-xs text-gray-500"
                    >
                      <CheckCircle size={10} className="mr-2 text-green-400" />
                      {feature}
                    </div>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-gray-600 hover:bg-gray-800"
                >
                  <BookOpen className="mr-2" size={14} />
                  Explore Tools
                </Button>
              </div>
            ))}
          </div>
        </section>

        {/* Community & Contribution */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-2 flex items-center">
                <Heart className="mr-3 text-red-400" size={24} />
                Join the New Earth Movement
              </h2>
              <p className="text-gray-400">
                Contribute to the world&apos;s first open source AGI platform
                and help build technology for the new earth
              </p>
            </div>
            <Button className="bg-red-600 hover:bg-red-700">
              <Github className="mr-2" size={16} />
              View on GitHub
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contributionPaths.map((path) => (
              <div
                key={path.id}
                className="jaguar-card hover:border-gray-600 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-10 h-10 bg-${path.color}-500/20 rounded-lg flex items-center justify-center`}
                  >
                    <path.icon className={`text-${path.color}-400`} size={20} />
                  </div>
                  <div className="flex items-center text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded">
                    <Star size={10} className="mr-1" />
                    Welcome
                  </div>
                </div>

                <h3 className="font-semibold mb-2">{path.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{path.description}</p>

                <div className="mb-4">
                  <div className="text-xs text-gray-500 mb-2">Skills:</div>
                  <div className="flex flex-wrap gap-1">
                    {path.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-1 bg-gray-800 text-xs rounded"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-1 mb-4">
                  {path.firstSteps.slice(0, 2).map((step) => (
                    <div
                      key={step}
                      className="flex items-center text-xs text-gray-500"
                    >
                      <ArrowRight size={10} className="mr-2" />
                      {step}
                    </div>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-gray-600 hover:bg-gray-800"
                >
                  <Users className="mr-2" size={14} />
                  Get Started
                </Button>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Ethics Module */}
        <section>
          <div className="jaguar-card border-2 border-green-500/30 bg-green-500/5">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Leaf className="text-green-400" size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h3 className="text-xl font-semibold text-green-400 mr-3">
                      {ethicsModule.title}
                    </h3>
                    <div className="flex items-center text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded">
                      <Award size={10} className="mr-1" />
                      Featured
                    </div>
                  </div>
                  <p className="text-gray-300 mb-4">
                    {ethicsModule.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {ethicsModule.topics.map((topic) => (
                      <span
                        key={topic}
                        className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <BookOpen className="mr-2" size={16} />
                Explore Ethics
              </Button>
            </div>
          </div>
        </section>

        {/* Documentation Modules Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-2 flex items-center">
                <Layers className="mr-3 text-purple-400" size={24} />
                Documentation Modules
              </h2>
              <p className="text-gray-400">
                Comprehensive guides for all technologies in the Jaguar SDK
                ecosystem
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documentationModules.map((module) => (
              <div
                key={module.id}
                className={`jaguar-card hover:border-gray-600 transition-colors ${
                  module.status === 'featured'
                    ? 'border-blue-500/30 bg-blue-500/5'
                    : ''
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-10 h-10 bg-${module.color}-500/20 rounded-lg flex items-center justify-center`}
                  >
                    <module.icon
                      className={`text-${module.color}-400`}
                      size={20}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    {module.clineIntegration && (
                      <div className="flex items-center text-xs text-blue-400 bg-blue-500/10 px-2 py-1 rounded">
                        <Bot size={10} className="mr-1" />
                        Cline
                      </div>
                    )}
                    {module.externalLink && (
                      <Link
                        href={module.externalLink}
                        target="_blank"
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        <ExternalLink size={16} />
                      </Link>
                    )}
                  </div>
                </div>

                <h3 className="font-semibold mb-2">{module.title}</h3>
                <p className="text-gray-400 text-sm mb-4">
                  {module.description}
                </p>

                <div className="space-y-2 mb-4">
                  {module.topics.slice(0, 3).map((topic) => (
                    <div
                      key={topic}
                      className="flex items-center text-xs text-gray-500"
                    >
                      <ArrowRight size={12} className="mr-2" />
                      {topic}
                    </div>
                  ))}
                  {module.topics.length > 3 && (
                    <div className="text-xs text-gray-500">
                      +{module.topics.length - 3} more topics
                    </div>
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-gray-600 hover:bg-gray-800"
                >
                  <BookOpen className="mr-2" size={14} />
                  View Documentation
                </Button>
              </div>
            ))}
          </div>
        </section>

        {/* Self-Hosting & GitHub Collaboration */}
        <section>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="jaguar-card-indigo">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Globe className="mr-3" size={20} />
                Self-Hosting Guide
              </h3>
              <p className="text-gray-300 mb-6">
                Deploy your own Jaguar SDK instance with complete control over
                your data and AI models.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm">
                  <CheckCircle className="mr-3 text-green-400" size={16} />
                  Docker deployment ready
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="mr-3 text-green-400" size={16} />
                  Cloud provider integration
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="mr-3 text-green-400" size={16} />
                  Security best practices
                </div>
              </div>
              <Button className="w-full jaguar-button-indigo">
                <Download className="mr-2" size={16} />
                Start Self-Hosting
              </Button>
            </div>

            <div className="jaguar-card border-2 border-purple-500/30 bg-purple-500/5">
              <h3 className="text-xl font-semibold mb-4 flex items-center text-purple-400">
                <GitBranch className="mr-3" size={20} />
                GitHub Collaboration
              </h3>
              <p className="text-gray-300 mb-6">
                Learn how to contribute to Jaguar SDK using GitHub workflows and
                Cline assistance.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm">
                  <CheckCircle className="mr-3 text-green-400" size={16} />
                  Fork & pull request workflow
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="mr-3 text-green-400" size={16} />
                  Code review best practices
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="mr-3 text-green-400" size={16} />
                  Cline-assisted development
                </div>
              </div>
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                <Github className="mr-2" size={16} />
                Learn GitHub Workflow
              </Button>
            </div>
          </div>
        </section>

        {/* Interactive Chat Integration */}
        <section>
          <div className="jaguar-card border-2 border-jaguar-indigo/30 bg-jaguar-indigo/5">
            <div className="text-center">
              <div className="w-16 h-16 bg-jaguar-indigo/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="text-jaguar-indigo" size={32} />
              </div>
              <h3 className="text-2xl font-semibold mb-4">
                Need Help? Ask Jaguar!
              </h3>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Get instant help with any Jaguar SDK question. Our AI assistant
                can help you with setup, development, troubleshooting, and best
                practices.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="jaguar-button-indigo">
                  <MessageCircle className="mr-2" size={16} />
                  Start Chat with Jaguar
                </Button>
                <Button
                  variant="outline"
                  className="border-gray-600 hover:bg-gray-800"
                >
                  <Bot className="mr-2" size={16} />
                  Ask Cline for Help
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
