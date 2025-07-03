import { cookies } from 'next/headers';
import Script from 'next/script';

import { JaguarSidebar } from '@/components/jaguar-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { auth } from '../(auth)/auth';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, cookieStore] = await Promise.all([auth(), cookies()]);
  const isCollapsed = cookieStore.get('sidebar:state')?.value !== 'true';

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js"
        strategy="beforeInteractive"
      />
      <div className="min-h-screen bg-black text-white">
        <SidebarProvider defaultOpen={!isCollapsed}>
          <JaguarSidebar user={session?.user} />
          <SidebarInset className="bg-black">
            <div className="flex flex-1 flex-col">{children}</div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </>
  );
}
