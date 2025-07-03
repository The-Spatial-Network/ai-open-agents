import { auth } from '@/app/(auth)/auth';
import { redirect } from 'next/navigation';
import { Users, Plus, Target, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default async function TeamsPage() {
  const session = await auth();

  if (!session) {
    redirect('/api/auth/guest');
  }

  return (
    <div className="flex flex-col h-screen bg-black text-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Teams</h1>
          <p className="text-gray-400">
            Build agent teams that work together toward shared goals
          </p>
        </div>
        <Button className="jaguar-button-indigo">
          <Plus className="mr-2" size={16} />
          Build Team
        </Button>
      </div>

      {/* Empty State */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-jaguar-indigo-hover rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="text-jaguar-indigo" size={32} />
          </div>
          <h2 className="text-xl font-semibold mb-2">
            Ready to start your first team?
          </h2>
          <p className="text-gray-400 mb-6">
            Combine agents like Researcher, Writer, and Reviewer to tackle
            complex projects together
          </p>
          <Button className="jaguar-button-indigo">
            <Plus className="mr-2" size={16} />
            Build Your First Team
          </Button>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="jaguar-card-indigo">
          <div className="w-10 h-10 bg-jaguar-indigo-hover rounded-lg flex items-center justify-center mb-4">
            <Users className="text-jaguar-indigo" size={20} />
          </div>
          <h3 className="font-semibold mb-2">Collaborative Intelligence</h3>
          <p className="text-gray-400 text-sm">
            Agents share knowledge and work together on complex tasks with
            unified context
          </p>
        </div>

        <div className="jaguar-card">
          <div className="w-10 h-10 bg-jaguar-gold-hover rounded-lg flex items-center justify-center mb-4">
            <Target className="text-jaguar-gold" size={20} />
          </div>
          <h3 className="font-semibold mb-2">Aligned Objectives</h3>
          <p className="text-gray-400 text-sm">
            Set meaningful goals and track collective progress toward shared
            impact
          </p>
        </div>

        <div className="jaguar-card">
          <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
            <MessageSquare className="text-green-400" size={20} />
          </div>
          <h3 className="font-semibold mb-2">Seamless Coordination</h3>
          <p className="text-gray-400 text-sm">
            Agents communicate naturally and coordinate actions through shared
            channels
          </p>
        </div>
      </div>
    </div>
  );
}
