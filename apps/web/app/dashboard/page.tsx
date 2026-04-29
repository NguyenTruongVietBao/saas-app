'use client';

import { motion } from 'framer-motion';
import { 
  Users, 
  TrendingUp, 
  Briefcase, 
  Clock,
  ArrowUpRight,
  Plus
} from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold">Overview</h1>
          <p className="text-muted-foreground">Monitor your organization performance and metrics</p>
        </div>
        <button className="bg-primary text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
          <Plus size={18} /> Add Resource
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={<Users className="text-blue-500" />} 
          label="Total Employees" 
          value="1,284" 
          change="+12.5%" 
          positive 
        />
        <StatCard 
          icon={<Briefcase className="text-purple-500" />} 
          label="Active Projects" 
          value="48" 
          change="+4.2%" 
          positive 
        />
        <StatCard 
          icon={<TrendingUp className="text-emerald-500" />} 
          label="Performance" 
          value="94.2%" 
          change="+1.1%" 
          positive 
        />
        <StatCard 
          icon={<Clock className="text-orange-500" />} 
          label="Avg. Tenure" 
          value="2.4 yrs" 
          change="-0.5%" 
          positive={false} 
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass p-6 rounded-2xl min-h-[400px]">
          <h3 className="text-lg font-bold mb-4">Organizational Growth</h3>
          {/* Chart Placeholder */}
          <div className="w-full h-[300px] flex items-center justify-center border-2 border-dashed border-border/50 rounded-xl bg-secondary/20">
            <span className="text-muted-foreground">Growth analytics chart will render here</span>
          </div>
        </div>

        <div className="glass p-6 rounded-2xl">
          <h3 className="text-lg font-bold mb-4">Recent Activity</h3>
          <div className="space-y-6">
            <ActivityItem 
              user="John Doe" 
              action="Created Project" 
              target="Apollo UI" 
              time="2 mins ago" 
            />
            <ActivityItem 
              user="Sarah Smith" 
              action="Joined Dept" 
              target="Engineering" 
              time="45 mins ago" 
            />
            <ActivityItem 
              user="System" 
              action="Daily Sync" 
              target="Organizations" 
              time="2 hours ago" 
            />
            <ActivityItem 
              user="Michael Brown" 
              action="Updated Role" 
              target="Marketing" 
              time="Yesterday" 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, change, positive }: { icon: any, label: string, value: string, change: string, positive: boolean }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="glass p-6 rounded-2xl space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="p-2.5 bg-secondary/50 rounded-xl">{icon}</div>
        <div className={`px-2 py-1 rounded-md text-[10px] font-bold ${positive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-destructive/10 text-destructive'}`}>
          {change}
        </div>
      </div>
      <div>
        <div className="text-sm font-medium text-muted-foreground">{label}</div>
        <div className="text-2xl font-bold mt-1">{value}</div>
      </div>
    </motion.div>
  );
}

function ActivityItem({ user, action, target, time }: { user: string, action: string, target: string, time: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-2 h-2 rounded-full bg-primary mt-2" />
      <div className="flex-1 space-y-0.5">
        <p className="text-sm">
          <span className="font-bold">{user}</span> {action} <span className="text-primary font-medium">{target}</span>
        </p>
        <p className="text-xs text-muted-foreground">{time}</p>
      </div>
      <ArrowUpRight size={14} className="text-muted-foreground" />
    </div>
  );
}
