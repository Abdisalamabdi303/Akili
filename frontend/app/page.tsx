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
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col">

      {/* ── Navbar ── */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-sm shadow-primary/40">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">
              Akili <span className="text-primary font-extrabold">AI</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-xs text-muted-foreground border border-border rounded-full px-2.5 py-0.5 bg-secondary/60">
              v1.0 · Alpha
            </span>
            <Button
              size="sm"
              className="rounded-full bg-accent text-white hover:bg-accent/90 shadow-sm btn-shine"
              onClick={handleCreateEmptyProject}
            >
              <Plus size={14} className="mr-1" /> New Project
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 sm:px-6 lg:px-8">

        {/* ── Hero ── */}
        <section className="py-16 md:py-24 text-center animate-in fade-in slide-in-from-bottom-6 duration-700">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/8 px-3 py-1 text-xs font-semibold text-primary mb-6 shadow-sm">
            <Sparkles size={12} />
            AI-Powered App Factory
          </div>

          {/* Headline */}
          <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Describe your idea.{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-primary">Akili builds it.</span>
              <span className="absolute -bottom-1 left-0 right-0 h-3 rounded-full bg-primary/15 -z-0" />
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground md:text-lg leading-relaxed">
            From a single prompt, Akili designs and generates a full web app — complete UI, logic, and live preview.
          </p>

          {/* Input */}
          <div className="mx-auto mt-10 w-full max-w-2xl">
            <div
              className={`relative flex items-center rounded-2xl border bg-white shadow-lg transition-all duration-300 ${
                isFocused
                  ? "border-primary ring-4 ring-primary/15 shadow-primary/20"
                  : "border-border shadow-sm"
              }`}
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={isFocused ? "Describe your project..." : EXAMPLES[placeholderIdx]}
                className="h-14 w-full rounded-2xl border-0 bg-transparent pl-5 pr-16 text-sm text-foreground placeholder:text-muted-foreground/70 shadow-none focus-visible:ring-0 md:text-base"
                autoFocus
              />
              <Button
                onClick={handleStartProject}
                disabled={!input.trim()}
                className="absolute right-2 h-10 w-10 rounded-xl bg-primary p-0 text-white shadow-md hover:bg-primary/90 disabled:opacity-40 btn-shine"
              >
                <ArrowRight size={18} />
              </Button>
            </div>

            {/* Example chips */}
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {EXAMPLES.slice(0, 3).map((ex) => (
                <button
                  key={ex}
                  onClick={() => setInput(ex)}
                  className="rounded-full border border-border bg-white px-3 py-1 text-xs text-muted-foreground hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all duration-200 shadow-sm"
                >
                  {ex.length > 42 ? ex.slice(0, 42) + "…" : ex}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── Feature Pills ── */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
          {FEATURES.map(({ icon: Icon, label, desc }) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-xl border border-border bg-white/70 px-4 py-3.5 shadow-sm backdrop-blur-sm"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Icon size={18} className="text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}
        </section>

        {/* ── Divider ── */}
        <div className="flex items-center gap-4 pb-6">
          <div className="flex-1 border-t border-border" />
          <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Clock size={12} /> Recent Projects
          </span>
          <div className="flex-1 border-t border-border" />
        </div>

        {/* ── Projects Grid ── */}
        <section className="pb-16 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* New Project Card */}
            <button
              onClick={handleCreateEmptyProject}
              className="group flex h-44 flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 transition-all duration-200 hover:border-primary hover:bg-primary/10 hover:shadow-md"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary/50 bg-white shadow-sm transition-transform duration-200 group-hover:scale-110">
                <Plus size={20} className="text-primary" />
              </div>
              <span className="text-sm font-semibold text-primary">Start New Project</span>
            </button>

            {/* Project Cards */}
            {projects.map((project) => (
              <button
                key={project.id}
                onClick={() => router.push(`/project/${project.id}`)}
                className="group flex h-44 flex-col justify-between rounded-2xl border border-border bg-white p-5 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
              >
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
                      <Folder size={15} className="text-primary" />
                    </div>
                    <ChevronRight
                      size={16}
                      className="text-muted-foreground opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5"
                    />
                  </div>
                  <h3 className="mt-3 text-sm font-semibold leading-snug text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                    {project.title || "Untitled Project"}
                  </h3>
                </div>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock size={11} />
                  {new Date(project.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </button>
            ))}
          </div>

          {projects.length === 0 && (
            <p className="mt-6 text-center text-sm text-muted-foreground">
              No projects yet. Describe an idea above to get started!
            </p>
          )}
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-border bg-secondary/30 py-4 text-center text-xs text-muted-foreground">
        Akili AI · Built with ❤️ using Next.js, Tailwind CSS & Ollama
      </footer>
    </div>
  );
}
