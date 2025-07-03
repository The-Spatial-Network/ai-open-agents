import { auth } from '@/app/(auth)/auth';
import { redirect } from 'next/navigation';
import { Map as MapIcon, Globe, Satellite, TreePine } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default async function NaturePage() {
  const session = await auth();

  if (!session) {
    redirect('/api/auth/guest');
  }

  return (
    <div className="flex flex-col h-screen bg-black text-white p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Nature</h1>
          <p className="text-gray-400">
            Geospatial AI playground for environmental projects
          </p>
        </div>
        <Button className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700">
          <MapIcon className="mr-2" size={16} />
          New Project
        </Button>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <TreePine className="text-gray-400" size={32} />
          </div>
          <h2 className="text-xl font-semibold mb-2">Nature SDK Coming Soon</h2>
          <p className="text-gray-400 mb-6">
            Build geospatial AI applications for environmental monitoring and
            conservation
          </p>
          <Button className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700">
            <Globe className="mr-2" size={16} />
            Explore Maps
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
          <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
            <MapIcon className="text-purple-400" size={20} />
          </div>
          <h3 className="font-semibold mb-2">Interactive Maps</h3>
          <p className="text-gray-400 text-sm">
            Build interactive geospatial applications with real-time data
          </p>
        </div>

        <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
          <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
            <Satellite className="text-blue-400" size={20} />
          </div>
          <h3 className="font-semibold mb-2">Satellite Data</h3>
          <p className="text-gray-400 text-sm">
            Access satellite imagery and environmental datasets
          </p>
        </div>

        <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
          <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
            <TreePine className="text-green-400" size={20} />
          </div>
          <h3 className="font-semibold mb-2">Conservation AI</h3>
          <p className="text-gray-400 text-sm">
            AI-powered tools for environmental monitoring and protection
          </p>
        </div>
      </div>
    </div>
  );
}
