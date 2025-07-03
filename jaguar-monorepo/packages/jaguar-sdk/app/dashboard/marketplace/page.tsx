import { auth } from '@/app/(auth)/auth';
import { redirect } from 'next/navigation';
import { Store, Search, Star, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default async function MarketplacePage() {
  const session = await auth();

  if (!session) {
    redirect('/api/auth/guest');
  }

  return (
    <div className="flex flex-col h-screen bg-black text-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Marketplace</h1>
          <p className="text-gray-400">
            Share your agents and earn sustainable income
          </p>
        </div>
        <Button className="jaguar-button-indigo">
          <Store className="mr-2" size={16} />
          Share Agent
        </Button>
      </div>

      {/* Empty State */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-lg">
          <div className="w-16 h-16 bg-jaguar-indigo-hover rounded-full flex items-center justify-center mx-auto mb-4">
            <Store className="text-jaguar-indigo" size={32} />
          </div>
          <h2 className="text-xl font-semibold mb-2">
            Ready to share your innovations for positive impact?
          </h2>
          <p className="text-gray-400 mb-6">
            Transform your work into sustainable income streams. Share your
            creations with conscious creators worldwide and earn from every use.
          </p>
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-center text-sm text-green-400">
              <span className="mr-2">✓</span>
              Set fair pricing that reflects your value
            </div>
            <div className="flex items-center justify-center text-sm text-green-400">
              <span className="mr-2">✓</span>
              Reach conscious creators worldwide
            </div>
            <div className="flex items-center justify-center text-sm text-green-400">
              <span className="mr-2">✓</span>
              See your impact with detailed insights
            </div>
          </div>
          <div className="space-y-3">
            <Button className="jaguar-button-indigo w-full">
              <Store className="mr-2" size={16} />
              Share Your First Agent
            </Button>
            <Button
              variant="outline"
              className="w-full border-gray-600 text-gray-300 hover:text-white hover:border-gray-400"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="jaguar-card-indigo">
          <div className="w-10 h-10 bg-jaguar-indigo-hover rounded-lg flex items-center justify-center mb-4">
            <Search className="text-jaguar-indigo" size={20} />
          </div>
          <h3 className="font-semibold mb-2">Discover Solutions</h3>
          <p className="text-gray-400 text-sm">
            Find agents created by conscious builders for positive impact
          </p>
        </div>

        <div className="jaguar-card">
          <div className="w-10 h-10 bg-jaguar-gold-hover rounded-lg flex items-center justify-center mb-4">
            <Star className="text-jaguar-gold" size={20} />
          </div>
          <h3 className="font-semibold mb-2">Community Wisdom</h3>
          <p className="text-gray-400 text-sm">
            Ratings and reviews from creators building a better world
          </p>
        </div>

        <div className="jaguar-card">
          <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
            <Download className="text-green-400" size={20} />
          </div>
          <h3 className="font-semibold mb-2">Instant Integration</h3>
          <p className="text-gray-400 text-sm">
            Deploy and customize agents seamlessly into your workflow
          </p>
        </div>
      </div>
    </div>
  );
}
