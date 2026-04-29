'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Database, Globe, Layers, Shield, Zap } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen Selection:bg-primary selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-background/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-2xl tracking-tighter">
            <div className="bg-primary p-1.5 rounded-lg">
              <Layers size={24} className="text-white" />
            </div>
            SAAS<span className="text-primary">CORE</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <Link href="#" className="hover:text-primary transition-colors">
              Features
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Pricing
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Docs
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Changelog
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/auth/login"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/auth/login"
              className="bg-white text-black px-5 py-2.5 rounded-full text-sm font-bold hover:bg-white/90 transition-all flex items-center gap-2"
            >
              Get Started <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-48 pb-32 px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6"
            >
              <Zap size={14} /> Redefining Enterprise SaaS
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl md:text-8xl font-extrabold tracking-tighter leading-[0.9] mb-8"
            >
              The Multi-Tenant <br />
              <span className="text-primary">Operating System.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-muted-foreground leading-relaxed mb-10 max-w-xl"
            >
              Securely scale from one organization to thousands with our modern
              relational architecture. Global users, localized security, and
              unparalleled performance.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-4"
            >
              <Link
                href="/auth/login"
                className="bg-primary text-white px-8 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-all shadow-2xl shadow-primary/40 animate-glow"
              >
                Start Building Now
              </Link>
              <button className="px-8 py-4 rounded-2xl font-bold text-lg glass hover:bg-white/5 transition-all">
                Book a Demo
              </button>
            </motion.div>
          </div>
        </div>

        {/* Floating elements for aesthetics */}
        <div className="absolute top-1/4 right-0 w-1/3 h-1/2 bg-primary/20 blur-[150px] -z-10 rounded-full" />
      </section>

      {/* Features Grid */}
      <section className="py-24 px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Globe />}
              title="Global Identity"
              desc="One user, unlimited organizations. Manage roles and permissions seamlessly across workspaces."
            />
            <FeatureCard
              icon={<Shield />}
              title="Schema Isolation"
              desc="Physical data separation using PostgreSQL schemas. Enterprise-grade security for every client."
            />
            <FeatureCard
              icon={<Database />}
              title="Relational Excellence"
              desc="Drizzle-powered ORM ensures data integrity between organizations, departments, and employees."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-8 border-t border-white/5 text-center text-sm text-muted-foreground">
        <p>© 2026 SAASCORE. Built with NestJS, Next.js, and PostgreSQL.</p>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: any;
  title: string;
  desc: string;
}) {
  return (
    <div className="glass p-8 rounded-3xl space-y-4 hover:border-primary/50 transition-all cursor-default">
      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
        {icon}
      </div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  );
}
