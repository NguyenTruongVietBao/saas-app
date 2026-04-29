'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Plus, ArrowRight, UserCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function OrganizationsPage() {
  const [user, setUser] = useState<any>(null);
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('auth_token');

    if (!storedUser || !token) {
      router.push('/auth/login');
      return;
    }

    setUser(JSON.parse(storedUser));
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    // In a real app, you'd fetch from /users/me/organizations
    // For now, let's mock or assume we have a way to list them
    // Actually, I'll mock the response based on the seed data
    setIsLoading(false);
    setOrganizations([
      { id: 'a110f1ee-6c54-4b01-90e6-d701748f0851', name: 'TechCorp', role: 'OWNER', subdomain: 'techcorp' },
      { id: 'b110f1ee-6c54-4b01-90e6-d701748f0851', name: 'BizStream', role: 'ADMIN', subdomain: 'bizstream' }
    ]);
  };

  const handleSelectOrg = async (org: any) => {
    const token = localStorage.getItem('auth_token');
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/auth/select-org`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ orgId: org.id }),
    });

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('auth_token', data.access_token); // Update with contextual token
      localStorage.setItem('selected_org', JSON.stringify(data.organization));
      
      // Redirect to the dashboard on the subdomain or dynamic path
      // For local dev, we use path, in prod we might use subdomain
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl space-y-8"
      >
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-extrabold tracking-tight">Select Organization</h1>
          <p className="text-muted-foreground text-lg">Choose a workspace to continue working</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {organizations.map((org, index) => (
            <motion.div
              key={org.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleSelectOrg(org)}
              className="glass p-6 rounded-2xl cursor-pointer hover:border-primary/50 hover:bg-primary/5 group transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="bg-secondary p-3 rounded-xl group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                  <Building2 size={24} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest bg-secondary px-2 py-1 rounded-md opacity-70">
                  {org.role}
                </span>
              </div>
              <div className="mt-4 space-y-1">
                <h3 className="text-xl font-bold">{org.name}</h3>
                <p className="text-sm text-muted-foreground tracking-wide truncate">{org.subdomain}.nguyen-saas.com</p>
              </div>
              <div className="mt-6 flex items-center text-primary font-medium text-sm gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                Enter Workspace <ArrowRight size={14} />
              </div>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: organizations.length * 0.1 }}
            className="border-2 border-dashed border-border p-6 rounded-2xl flex flex-col items-center justify-center gap-3 opacity-50 hover:opacity-100 cursor-not-allowed transition-all"
          >
            <div className="bg-secondary p-2 rounded-full">
              <Plus size={20} />
            </div>
            <span className="font-semibold text-sm">Create Organization</span>
          </motion.div>
        </div>

        <div className="flex items-center justify-center pt-8 border-t border-border/50">
          <div className="flex items-center gap-3 bg-secondary/30 px-4 py-2 rounded-full">
            <UserCheck size={16} className="text-green-500" />
            <span className="text-sm">Logged in as <span className="font-bold">{user?.fullName}</span></span>
            <button 
              onClick={() => { localStorage.clear(); router.push('/auth/login'); }}
              className="text-xs text-muted-foreground hover:text-white underline ml-2"
            >
              Logout
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
