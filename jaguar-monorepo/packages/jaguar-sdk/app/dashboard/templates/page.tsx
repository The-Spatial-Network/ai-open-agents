import { auth } from '@/app/(auth)/auth';
import { redirect } from 'next/navigation';
import {
  Workflow,
  Zap,
  GitBranch,
  Bot,
  Code,
  Filter,
  Import,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default async function TemplatesPage() {
  const session = await auth();

  if (!session) {
    redirect('/api/auth/guest');
  }

  return (
    <div className="flex flex-col min-h-screen bg-black text-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Templates</h1>
          <p className="text-gray-400">
            Ready-to-use templates from our integration partners
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="border-gray-600 text-gray-300 hover:text-white hover:border-gray-400"
          >
            <Filter className="mr-2" size={16} />
            Filter
          </Button>
          <Button className="jaguar-button-indigo">
            <Import className="mr-2" size={16} />
            Import
          </Button>
        </div>
      </div>

      {/* Integration Partners Section */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white text-sm font-bold">n8n</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold">n8n Workflows</h2>
              <p className="text-sm text-gray-400">156 templates</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="jaguar-card-indigo">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-blue-500/20 rounded flex items-center justify-center">
                <Zap className="text-blue-400" size={16} />
              </div>
              <span className="text-blue-400 text-xs font-medium uppercase tracking-wide">
                Popular
              </span>
            </div>
            <h3 className="font-semibold mb-2">Email Campaign Automation</h3>
            <p className="text-gray-400 text-sm mb-4">
              Automated email sequences with personalization
            </p>
            <Button size="sm" className="jaguar-button-indigo text-xs">
              Import
            </Button>
          </div>

          <div className="jaguar-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-green-500/20 rounded flex items-center justify-center">
                <GitBranch className="text-green-400" size={16} />
              </div>
              <span className="text-green-400 text-xs font-medium uppercase tracking-wide">
                New
              </span>
            </div>
            <h3 className="font-semibold mb-2">Data Sync & Backup</h3>
            <p className="text-gray-400 text-sm mb-4">
              Sync data between multiple platforms
            </p>
            <Button
              size="sm"
              variant="outline"
              className="text-xs border-gray-600"
            >
              Import
            </Button>
          </div>

          <div className="jaguar-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-purple-500/20 rounded flex items-center justify-center">
                <Workflow className="text-purple-400" size={16} />
              </div>
              <span className="text-gray-400 text-xs font-medium uppercase tracking-wide">
                Updated
              </span>
            </div>
            <h3 className="font-semibold mb-2">Analytics Dashboard</h3>
            <p className="text-gray-400 text-sm mb-4">
              Real-time analytics and reporting
            </p>
            <Button size="sm" className="jaguar-button text-xs">
              Import
            </Button>
          </div>
        </div>
      </div>

      {/* OpenWebUI Section */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-600 rounded flex items-center justify-center">
              <Bot className="text-white" size={16} />
            </div>
            <div>
              <h2 className="text-xl font-semibold">OpenWebUI</h2>
              <p className="text-sm text-gray-400">324 items</p>
            </div>
          </div>
        </div>

        {/* Models Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Models</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-blue-500/20 rounded flex items-center justify-center">
                  <Bot className="text-blue-400" size={12} />
                </div>
                <span className="text-sm font-medium">Llama 3.1</span>
              </div>
              <p className="text-xs text-gray-400 mb-2">70B</p>
              <p className="text-xs text-gray-500">Meta&apos;s latest model</p>
            </div>

            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-green-500/20 rounded flex items-center justify-center">
                  <Code className="text-green-400" size={12} />
                </div>
                <span className="text-sm font-medium">CodeLlama</span>
              </div>
              <p className="text-xs text-gray-400 mb-2">Code generation</p>
              <p className="text-xs text-gray-500">Specialized for coding</p>
            </div>

            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-purple-500/20 rounded flex items-center justify-center">
                  <Bot className="text-purple-400" size={12} />
                </div>
                <span className="text-sm font-medium">LLaVA</span>
              </div>
              <p className="text-xs text-gray-400 mb-2">Vision model</p>
              <p className="text-xs text-gray-500">Image understanding</p>
            </div>

            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-indigo-500/20 rounded flex items-center justify-center">
                  <Bot className="text-indigo-400" size={12} />
                </div>
                <span className="text-sm font-medium">Mistral 7B</span>
              </div>
              <p className="text-xs text-gray-400 mb-2">Multilingual</p>
              <p className="text-xs text-gray-500">Fast and efficient</p>
            </div>
          </div>
        </div>

        {/* Functions and Prompts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Functions */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Functions</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-gray-900/50 border border-gray-700 rounded-lg">
                <div>
                  <h4 className="font-medium">Web Search</h4>
                  <p className="text-sm text-gray-400">
                    Search the web for information
                  </p>
                </div>
                <Button
                  size="sm"
                  className="jaguar-button-indigo-outline text-xs"
                >
                  Add
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-900/50 border border-gray-700 rounded-lg">
                <div>
                  <h4 className="font-medium">Calculator</h4>
                  <p className="text-sm text-gray-400">
                    Perform mathematical calculations
                  </p>
                </div>
                <Button
                  size="sm"
                  className="jaguar-button-indigo-outline text-xs"
                >
                  Add
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-900/50 border border-gray-700 rounded-lg">
                <div>
                  <h4 className="font-medium">Image Generator</h4>
                  <p className="text-sm text-gray-400">
                    Generate images from text
                  </p>
                </div>
                <Button
                  size="sm"
                  className="jaguar-button-indigo-outline text-xs"
                >
                  Add
                </Button>
              </div>
            </div>
          </div>

          {/* Prompts */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Prompts</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-gray-900/50 border border-gray-700 rounded-lg">
                <div>
                  <h4 className="font-medium">Grant Writer</h4>
                  <p className="text-sm text-gray-400">
                    Professional grant writing assistant
                  </p>
                </div>
                <Button size="sm" className="jaguar-button text-xs">
                  Use
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-900/50 border border-gray-700 rounded-lg">
                <div>
                  <h4 className="font-medium">Code Reviewer</h4>
                  <p className="text-sm text-gray-400">
                    Code review and optimization
                  </p>
                </div>
                <Button size="sm" className="jaguar-button text-xs">
                  Use
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-900/50 border border-gray-700 rounded-lg">
                <div>
                  <h4 className="font-medium">Research Assistant</h4>
                  <p className="text-sm text-gray-400">
                    Research and analysis helper
                  </p>
                </div>
                <Button size="sm" className="jaguar-button text-xs">
                  Use
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
