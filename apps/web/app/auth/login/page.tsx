'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { motion } from 'framer-motion';
import { ArrowRight, Lock, LogIn, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Mock login for now, would call your API /auth/login
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/auth/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        },
      );

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('auth_token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        // Redirect to organization selection
        router.push('/auth/organizations');
      } else {
        alert('Login failed. Check console.');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass p-8 rounded-2xl shadow-2xl space-y-8"
      >
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-xl bg-primary/10 text-primary mb-2">
            <LogIn size={28} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
          <p className="text-muted-foreground">
            Login to access your organizations
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium ml-1">Email</label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-3 text-muted-foreground"
                size={18}
              />
              <input
                type="email"
                required
                className="w-full bg-secondary/50 border border-border rounded-xl py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium ml-1">Password</label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-3 text-muted-foreground"
                size={18}
              />
              <input
                type="password"
                required
                className="w-full bg-secondary/50 border border-border rounded-xl py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 group transition-all animate-glow"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
            <ArrowRight
              size={18}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        </form>

        <div className="text-center text-sm text-muted-foreground pt-4">
          Don&apos;t have an account?{' '}
          <span className="text-primary hover:underline cursor-pointer font-medium">
            Contact support
          </span>
        </div>
      </motion.div>
      <Card className="max-w-sm">
        <CardHeader>
          <CardTitle>Project Overview</CardTitle>
          <CardDescription>
            Track progress and recent activity for your Next.js app.
          </CardDescription>
        </CardHeader>
        <CardContent>
          Your design system is ready. Start building your next component.
        </CardContent>
      </Card>
    </div>
  );
}
