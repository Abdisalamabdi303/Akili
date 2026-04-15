"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Folder, Sparkles, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useRouter } from "next/navigation";

interface Project {
  id: number;
  title: string;
  created_at: string;
}

export default function LandingPage() {
  const [input, setInput] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const router = useRouter();

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/chats");
        if (!res.ok) return;
        const data = await res.json();
        setProjects(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch projects:", err);
      }
    };
    loadProjects();
  }, []);

  const handleStartProject = async () => {
    if (!input.trim()) return;
    try {
      const chatRes = await fetch("http://localhost:4000/api/chats", { method: "POST" });
      if (!chatRes.ok) return;
      const chat = await chatRes.json();
      router.push(`/project/${chat.id}?prompt=${encodeURIComponent(input)}`);
    } catch (err) {
      console.error("Failed to create chat:", err);
    }
  };

  const handleCreateEmptyProject = async () => {
    try {
      const chatRes = await fetch("http://localhost:4000/api/chats", { method: "POST" });
      if (!chatRes.ok) return;
      const chat = await chatRes.json();
      router.push(`/project/${chat.id}`);
    } catch (err) {
      console.error("Failed to create chat:", err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleStartProject();
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col">
      {/* Navbar / Header */}
      <header className="sticky top-0 z-20 border-b border-border/70 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:h-16 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-primary/35 bg-gradient-to-br from-primary/30 via-primary/15 to-accent/30 shadow-[0_0_24px_rgba(34,211,238,0.35)] sm:h-10 sm:w-10">
              <span className="text-sm font-extrabold text-primary-foreground sm:text-base">A</span>
              <Sparkles className="absolute -right-1 -top-1 h-3.5 w-3.5 text-primary" />
            </div>
            <h1 className="bg-gradient-to-r from-primary via-cyan-300 to-accent bg-clip-text text-xl font-bold tracking-tight text-transparent sm:text-2xl">
              Akili AI
            </h1>
          </div>
          <div className="rounded-full border border-border/70 bg-card/60 px-3 py-1 text-xs text-muted-foreground sm:text-sm">
            v1.0.0
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col overflow-y-auto px-4 sm:px-6 lg:px-8">

        {/* Hero Section */}
        <section className="w-full py-10 text-center md:py-16 lg:pt-16 lg:pb-20 animate-in fade-in slide-in-from-bottom-5 duration-700">
          <div className="mx-auto max-w-4xl rounded-3xl border border-border/70 bg-card/45 px-5 py-10 shadow-[0_24px_80px_rgba(3,7,18,0.65)] backdrop-blur-xl sm:px-8 sm:py-12">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/35 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              AI Product Studio
            </div>
            <h2 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight leading-tight md:text-5xl">
              Build from idea to deploy-ready in one <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">flow</span>
            </h2>
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Describe your product once. Akili plans, designs, and generates code with a modern stack and clean project structure.
            </p>

            <div className="group relative mx-auto mt-8 w-full max-w-2xl transform transition-transform duration-300 hover:scale-[1.01]">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary/45 via-cyan-400/35 to-accent/45 blur-md opacity-70 transition duration-500 group-hover:opacity-100"></div>
              <div className="relative flex items-center">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Describe your project (e.g., 'A login page with glassmorphism')..."
                  className="h-14 w-full rounded-full border-border/80 bg-background/90 pl-6 pr-16 text-base shadow-2xl backdrop-blur-xl focus:ring-2 focus:ring-primary/60 md:h-16 md:pl-8 md:text-lg"
                  autoFocus
                />
                <Button
                  onClick={handleStartProject}
                  disabled={!input.trim()}
                  className="absolute bottom-1.5 right-1.5 top-1.5 h-11 w-11 rounded-full bg-gradient-to-br from-primary to-accent p-0 text-primary-foreground shadow-lg transition-all hover:brightness-110 md:bottom-2 md:right-2 md:top-2 md:h-12 md:w-12"
                >
                  <ArrowRight size={24} />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Projects Grid */}
        <section className="w-full animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-100">
          <div className="mb-6 flex items-center justify-between border-b border-border/70 pb-4">
            <h3 className="text-2xl font-semibold flex items-center gap-2">
              <Clock className="text-primary w-5 h-5" />
              Recent Projects
            </h3>
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
              View All
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* New Project Card */}
            <Card
              className="group h-64 cursor-pointer border border-primary/35 bg-gradient-to-br from-primary/15 to-accent/10 p-8 transition-all hover:-translate-y-1 hover:border-primary/60 hover:shadow-[0_18px_45px_rgba(14,165,233,0.22)] flex flex-col items-center justify-center"
              onClick={handleCreateEmptyProject}
            >
              <div className="mb-4 rounded-full border border-primary/40 bg-primary/20 p-4 transition-transform group-hover:scale-110">
                <Folder className="w-8 h-8 text-primary" />
              </div>
              <p className="text-lg font-medium text-primary">Start New Project</p>
            </Card>

            {projects.map((project) => (
              <Card
                key={project.id}
                className="group cursor-pointer overflow-hidden border border-border/80 bg-card/65 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_20px_55px_rgba(15,23,42,0.55)]"
                onClick={() => router.push(`/project/${project.id}`)}
              >
                <CardHeader className="pb-3 bg-secondary/25">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors truncate">
                      {project.title || "Untitled Project"}
                    </CardTitle>
                    <div className="rounded-full border border-border/70 bg-background/80 p-1.5 shadow-sm">
                      <Folder size={16} className="text-muted-foreground" />
                    </div>
                  </div>
                  <CardDescription className="text-xs flex items-center gap-1 mt-1">
                    <Clock size={12} /> {new Date(project.created_at).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-sm text-muted-foreground line-clamp-2 italic">
                    Project ID: {project.id}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
