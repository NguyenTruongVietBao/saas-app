'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  Bell,
  Briefcase,
  Building2,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Search,
  Settings,
  Users,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<any>(null);
  const [selectedOrg, setSelectedOrg] = useState<any>(null);
  const [isOrgMenuOpen, setIsOrgMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedOrg = localStorage.getItem('selected_org');

    if (!storedUser || !storedOrg) {
      router.push('/auth/login');
      return;
    }

    setUser(JSON.parse(storedUser));
    setSelectedOrg(JSON.parse(storedOrg));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/auth/login');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-secondary/10 flex flex-col">
        {/* Org Switcher */}
        <div className="p-4 relative">
          <button
            onClick={() => setIsOrgMenuOpen(!isOrgMenuOpen)}
            className="w-full flex items-center justify-between p-2 rounded-xl glass hover:border-primary/30 transition-all text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 text-primary flex items-center justify-center font-bold">
                {selectedOrg?.name?.[0]}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold truncate w-28">
                  {selectedOrg?.name || 'Loading...'}
                </span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
                  {selectedOrg?.plan} Plan
                </span>
              </div>
            </div>
            <ChevronDown
              size={16}
              className={`transition-transform ${isOrgMenuOpen ? 'rotate-180' : ''}`}
            />
          </button>

          <AnimatePresence>
            {isOrgMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-4 right-4 mt-2 glass rounded-xl shadow-2xl z-50 overflow-hidden"
              >
                <div className="p-2 space-y-1">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-muted-foreground uppercase">
                    Your Workspaces
                  </div>
                  <button
                    onClick={() => router.push('/auth/organizations')}
                    className="w-full text-left p-2 hover:bg-white/5 rounded-lg text-sm flex items-center gap-2"
                  >
                    <Building2 size={14} /> Switch Organization
                  </button>
                  <div className="h-px bg-border my-1" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left p-2 hover:bg-destructive/10 text-destructive rounded-lg text-sm flex items-center gap-2"
                  >
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          <NavItem
            icon={<LayoutDashboard size={20} />}
            label="Overview"
            active
          />
          <NavItem icon={<Briefcase size={20} />} label="Departments" />
          <NavItem icon={<Users size={20} />} label="Employees" />
          <div className="pt-6 pb-2 px-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            Workspace
          </div>
          <NavItem icon={<Settings size={20} />} label="Settings" />
        </nav>

        {/* User Profile Mini */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold uppercase">
              {user?.fullName
                ?.split(' ')
                .map((n: string) => n[0])
                .join('')}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold">{user?.fullName}</span>
              <span className="text-[10px] text-muted-foreground truncate w-32">
                {user?.email}
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-border flex items-center justify-between px-8 bg-background/50 backdrop-blur-md">
          <div className="relative w-96">
            <Search
              className="absolute left-3 top-2.5 text-muted-foreground"
              size={18}
            />
            <input
              type="text"
              placeholder="Quick search (⌘+K)"
              className="w-full bg-secondary/50 border border-border rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-1 focus:ring-primary outline-none"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-secondary rounded-lg transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
            </button>
            <div className="h-8 w-px bg-border" />
            <div className="text-sm font-medium px-3 py-1 bg-secondary rounded-lg border border-border">
              v1.0.0-alpha
            </div>
          </div>
        </header>

        {/* Page Area */}
        <div className="flex-1 overflow-auto p-8">{children}</div>
      </main>
    </div>
  );
}

function NavItem({
  icon,
  label,
  active = false,
}: {
  icon: any;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${active ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted-foreground hover:bg-white/5 hover:text-white'}`}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}
