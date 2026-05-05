"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowRight,
  Folder,
  Sparkles,
  Clock,
  Zap,
  Code2,
  Globe,
  Plus,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface Project {
  id: number;
  title: string;
  created_at: string;
}

const EXAMPLES = [
  "A task manager with drag-and-drop and local storage",
  "A weather dashboard with live charts and city search",
  "An e-commerce product landing page with animations",
  "A personal portfolio with smooth scroll and dark mode",
  "A finance tracker with budgets and visual summaries",
];

const FEATURES = [
  { icon: Zap, label: "Instant Generation", desc: "From idea to working app in seconds" },
  { icon: Code2, label: "Clean Code", desc: "Semantic HTML, vanilla JS, Tailwind CSS" },
  { icon: Globe, label: "Live Preview", desc: "See your app render in real-time as it builds" },
];

export default function LandingPage() {
  const [input, setInput] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIdx((i) => (i + 1) % EXAMPLES.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetch("http://localhost:4000/api/chats")
      .then((r) => r.json())
      .then((d) => setProjects(Array.isArray(d) ? d : []))
      .catch(() => {});
  }, []);

  const handleStartProject = async () => {
    if (!input.trim()) return;
    try {
      const chatRes = await fetch("http://localhost:4000/api/chats", { method: "POST" });
      if (!chatRes.ok) return;
      const chat = await chatRes.json();
      router.push(`/project/${chat.id}?prompt=${encodeURIComponent(input)}`);
    } catch {}
  };

  const handleCreateEmptyProject = async () => {
    try {
      const chatRes = await fetch("http://localhost:4000/api/chats", { method: "POST" });
      if (!chatRes.ok) return;
      const chat = await chatRes.json();
      router.push(`/project/${chat.id}`);
    } catch {}
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleStartProject();
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col selection:bg-primary/30">

      {/* ── Navbar ── */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-background/60 backdrop-blur-2xl">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-[0_0_20px_rgba(var(--primary),0.4)]">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-black tracking-tight text-foreground uppercase italic">
              Akili <span className="text-primary not-italic">AI</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-[10px] font-bold tracking-widest uppercase text-muted-foreground border border-white/10 rounded-full px-3 py-1 bg-white/5">
              Alpha v1.0
            </span>
            <Button
              size="sm"
              className="rounded-xl bg-white text-black hover:bg-white/90 shadow-xl font-bold px-5 btn-shine"
              onClick={handleCreateEmptyProject}
            >
              <Plus size={16} className="mr-2" /> New Project
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 pb-24">

        {/* ── Hero ── */}
        <section className="py-24 md:py-32 text-center relative overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-primary mb-8 shadow-[0_0_20px_rgba(var(--primary),0.1)]">
              <Zap size={14} />
              AI-Powered Product Studio
            </div>

            {/* Headline */}
            <h1 className="mx-auto max-w-4xl text-5xl font-black leading-[1.1] tracking-tighter text-foreground md:text-7xl lg:text-8xl">
              Describe your idea. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
                Akili builds it.
              </span>
            </h1>

            <p className="mx-auto mt-8 max-w-2xl text-lg text-muted-foreground md:text-xl font-medium leading-relaxed">
              The ultimate playground for creators. Instantly generate full web applications, 
              complete with clean code and live previews, all from a simple prompt.
            </p>
          </motion.div>

          {/* Input Area */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mx-auto mt-14 w-full max-w-3xl"
          >
            <div
              className={`group relative flex items-center p-2 rounded-3xl border transition-all duration-500 ${
                isFocused
                  ? "border-primary/50 bg-white/5 ring-8 ring-primary/10 shadow-[0_0_50px_rgba(var(--primary),0.2)]"
                  : "border-white/10 bg-white/5 hover:border-white/20 shadow-2xl"
              }`}
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={isFocused ? "What are we building today?" : EXAMPLES[placeholderIdx]}
                className="h-16 w-full rounded-2xl border-0 bg-transparent pl-6 pr-20 text-lg text-foreground placeholder:text-muted-foreground/40 shadow-none focus-visible:ring-0"
                autoFocus
              />
              <Button
                onClick={handleStartProject}
                disabled={!input.trim()}
                className="absolute right-4 h-12 w-12 rounded-2xl bg-primary p-0 text-white shadow-xl hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all disabled:opacity-20 btn-shine"
              >
                <ArrowRight size={24} />
              </Button>
            </div>

            {/* Example chips */}
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {EXAMPLES.slice(0, 4).map((ex, idx) => (
                <motion.button
                  key={ex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + idx * 0.1 }}
                  onClick={() => setInput(ex)}
                  className="rounded-full border border-white/5 bg-white/5 px-4 py-2 text-xs font-semibold text-muted-foreground hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all duration-300 shadow-sm"
                >
                  {ex}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ── Feature Grid ── */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 py-20">
          {FEATURES.map(({ icon: Icon, label, desc }, idx) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="glass-card flex flex-col gap-4 p-8 rounded-3xl"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-[0_0_20px_rgba(var(--primary),0.1)]">
                <Icon size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">{label}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground font-medium">{desc}</p>
              </div>
            </motion.div>
          ))}
        </section>

        {/* ── Recent Projects Section ── */}
        <section className="mt-12 pt-12 border-t border-white/5">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-3 uppercase italic">
              <Clock className="text-primary not-italic" size={24} />
              Recent <span className="text-primary not-italic">Creations</span>
            </h2>
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground font-bold uppercase tracking-widest text-[10px]">
              View All
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* New Project Card */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCreateEmptyProject}
              className="group flex h-56 flex-col items-center justify-center gap-4 rounded-[2.5rem] border-2 border-dashed border-primary/30 bg-primary/5 transition-all duration-300 hover:border-primary hover:bg-primary/10 hover:shadow-[0_0_40px_rgba(var(--primary),0.15)]"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-black shadow-xl transition-transform duration-500 group-hover:rotate-90">
                <Plus size={28} />
              </div>
              <span className="text-sm font-black uppercase tracking-widest text-primary">New Project</span>
            </motion.button>

            {/* Project Cards */}
            {projects.map((project, idx) => (
              <motion.button
                key={project.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                onClick={() => router.push(`/project/${project.id}`)}
                className="group flex h-56 flex-col justify-between rounded-[2.5rem] glass-card p-8 text-left transition-all duration-300"
              >
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Folder size={24} />
                    </div>
                    <div className="h-8 w-8 items-center justify-center rounded-full bg-white/5 opacity-0 group-hover:opacity-100 transition-all flex">
                      <ChevronRight size={18} className="text-primary" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold leading-tight text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                    {project.title || "Untitled Masterpiece"}
                  </h3>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    <Clock size={12} />
                    {new Date(project.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary/50">#00{project.id}</span>
                </div>
              </motion.button>
            ))}
          </div>

          {projects.length === 0 && (
            <div className="py-20 text-center glass-card rounded-[2.5rem]">
              <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                Your creation gallery is empty
              </p>
              <p className="mt-2 text-xs text-muted-foreground/60">
                Describe an idea above to witness the magic.
              </p>
            </div>
          )}
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 bg-black/20 py-10 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 opacity-50">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-xs font-bold uppercase tracking-tighter">Akili AI Studio</span>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">
            Built for the next generation of builders
          </p>
          <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
            <a href="#" className="hover:text-primary transition-colors">Twitter</a>
            <a href="#" className="hover:text-primary transition-colors">Github</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
