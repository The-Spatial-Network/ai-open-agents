'use client';

import type { User } from 'next-auth';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  MessageSquare,
  Users,
  Store,
  Map as MapIcon,
  BookOpen,
  Workflow,
  Bot,
  Sparkles,
  Plus,
} from 'lucide-react';

import { SidebarHistory } from '@/components/sidebar-history';
import { SidebarUserNav } from '@/components/sidebar-user-nav';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  useSidebar,
} from '@/components/ui/sidebar';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

const modules = [
  {
    name: 'Chat',
    href: '/dashboard/chat',
    icon: MessageSquare,
    description: 'AI Assistant & Conversations',
  },
  {
    name: 'Agents',
    href: '/dashboard/agents',
    icon: Bot,
    description: 'Create & Manage AI Agents',
  },
  {
    name: 'Teams',
    href: '/dashboard/teams',
    icon: Users,
    description: 'Agent Team Collaboration',
  },
  {
    name: 'Templates',
    href: '/dashboard/templates',
    icon: Workflow,
    description: 'Ready-to-use integrations & workflows',
  },
  {
    name: 'Marketplace',
    href: '/dashboard/marketplace',
    icon: Store,
    description: 'Discover & Share Agents',
  },
  {
    name: 'Nature',
    href: '/dashboard/nature',
    icon: MapIcon,
    description: 'Geospatial AI Playground',
  },
  {
    name: 'Knowledge',
    href: '/dashboard/knowledge',
    icon: BookOpen,
    description: 'Documentation & Learning',
  },
];

export function JaguarSidebar({ user }: { user: User | undefined }) {
  const router = useRouter();
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  return (
    <Sidebar className="group-data-[side=left]:border-r-0 bg-black border-gray-800">
      <SidebarHeader className="border-b border-gray-800 p-4">
        <SidebarMenu>
          <div className="flex flex-row justify-between items-center">
            <Link
              href="/"
              onClick={() => {
                setOpenMobile(false);
              }}
              className="flex flex-row gap-3 items-center"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-jaguar-gold to-yellow-600 rounded-lg flex items-center justify-center">
                <Sparkles className="text-black" size={16} />
              </div>
              <div>
                <span className="text-lg font-headline font-bold text-white lowercase">
                  jaguar
                </span>
                <p className="text-xs text-gray-400 uppercase tracking-wide font-body">
                  Open Source AGI
                </p>
              </div>
            </Link>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  type="button"
                  className="p-2 h-fit text-gray-400 hover:text-white hover:bg-gray-800"
                  onClick={() => {
                    setOpenMobile(false);
                    router.push('/dashboard/chat');
                    router.refresh();
                  }}
                >
                  <Plus size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent align="end">New Chat</TooltipContent>
            </Tooltip>
          </div>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="bg-black">
        {/* Jaguar Modules */}
        <div className="p-4 space-y-2">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
            Modules
          </h3>
          {modules.map((module) => {
            const Icon = module.icon;
            const isActive = pathname.startsWith(module.href);

            return (
              <Tooltip key={module.name}>
                <TooltipTrigger asChild>
                  <Link
                    href={module.href}
                    onClick={() => setOpenMobile(false)}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 group font-body ${
                      isActive
                        ? 'bg-[rgba(217,181,113,0.2)] border border-[rgba(217,181,113,0.3)] text-[rgb(217,181,113)]'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                    }`}
                  >
                    <Icon
                      size={18}
                      className={`${
                        isActive
                          ? 'text-[rgb(217,181,113)]'
                          : 'text-gray-400 group-hover:text-white'
                      }`}
                    />
                    <span className="font-medium font-body">{module.name}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <div>
                    <p className="font-medium">{module.name}</p>
                    <p className="text-xs text-gray-400">
                      {module.description}
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>

        {/* Chat History - Only show when in chat module */}
        {pathname.startsWith('/dashboard/chat') && (
          <div className="border-t border-gray-800 pt-4">
            <SidebarHistory user={user} />
          </div>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-800 bg-black">
        {user && <SidebarUserNav user={user} />}
      </SidebarFooter>
    </Sidebar>
  );
}
