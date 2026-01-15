"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Folder, Sparkles, Clock, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useRouter } from "next/navigation";

// Mock Data for Projects
const MOCK_PROJECTS = [
  {
    id: 1,
    name: "E-Commerce Dashboard",
    prompt: "Create a modern dashboard for an e-commerce store with sales charts.",
    created_at: "2024-01-12T10:00:00Z",
    stars: 5
  },
  {
    id: 2,
    name: "Portfolio Website",
    prompt: "A minimalist portfolio site with a gallery and contact form.",
    created_at: "2024-01-14T14:30:00Z",
    stars: 4
  },
  {
    id: 3,
    name: "Task Management App",
    prompt: "A Kanban board application with drag and drop functionality.",
    created_at: "2024-01-15T09:15:00Z",
    stars: 5
  }
];

export default function LandingPage() {
  const [input, setInput] = useState("");
  const router = useRouter();

  const handleStartProject = () => {
    if (!input.trim()) return;
    // In a real app, this would create a project first.
    // For now, we redirect to a "new" project ID or a mock ID.
    router.push(`/project/new?prompt=${encodeURIComponent(input)}`);
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
      <header className="py-6 px-8 flex justify-between items-center border-b border-border/40 bg-card/10 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="bg-primary/20 p-2 rounded-lg">
            <Sparkles className="text-primary w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Akili AI
          </h1>
        </div>
        <div className="text-sm text-muted-foreground">
          v1.0.0
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center p-8 w-full max-w-7xl mx-auto overflow-y-auto">

        {/* Hero Section */}
        <section className="w-full max-w-3xl text-center space-y-8 mt-12 mb-20 animate-in fade-in slide-in-from-bottom-5 duration-700">
          <h2 className="text-5xl font-extrabold tracking-tight">
            What will you <span className="text-primary underline decoration-primary/30 underline-offset-8">build</span> today?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Turn your ideas into production-ready code with the power of Akili AI.
            Describe your vision, and watch it come to life.
          </p>

          <div className="relative w-full max-w-2xl mx-auto transform hover:scale-[1.01] transition-transform duration-300">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-accent/50 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative flex items-center">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Describe your project (e.g., 'A login page with glassmorphism')..."
                className="w-full h-16 pl-8 pr-16 text-lg rounded-full shadow-2xl border-primary/20 focus:ring-2 focus:ring-primary/50 bg-card/90 backdrop-blur-xl"
                autoFocus
              />
              <Button
                onClick={handleStartProject}
                disabled={!input.trim()}
                className="absolute right-2 top-2 bottom-2 rounded-full w-12 h-12 p-0 bg-primary hover:bg-primary/90 shadow-lg transition-all"
              >
                <ArrowRight size={24} />
              </Button>
            </div>
          </div>
        </section>

        {/* Recent Projects Grid */}
        <section className="w-full animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-100">
          <div className="flex items-center justify-between mb-6 border-b border-border/50 pb-4">
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
              className="bg-primary/5 border-2 border-dashed border-primary/20 flex flex-col items-center justify-center p-8 cursor-pointer hover:bg-primary/10 transition-colors h-64 group"
              onClick={() => router.push('/project/new')}
            >
              <div className="bg-primary/20 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
                <Folder className="w-8 h-8 text-primary" />
              </div>
              <p className="text-lg font-medium text-primary">Start New Project</p>
            </Card>

            {/* Mock Projects */}
            {MOCK_PROJECTS.map((project) => (
              <Card
                key={project.id}
                className="group hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border-border/50 bg-card hover:border-primary/50"
                onClick={() => router.push(`/project/${project.id}`)}
              >
                <CardHeader className="pb-3 bg-secondary/30">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {project.name}
                    </CardTitle>
                    <div className="bg-background/80 p-1.5 rounded-full shadow-sm">
                      <Folder size={16} className="text-muted-foreground" />
                    </div>
                  </div>
                  <CardDescription className="text-xs flex items-center gap-1 mt-1">
                    <Clock size={12} /> {new Date(project.created_at).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {project.prompt}
                  </p>
                  <div className="flex gap-1">
                    {[...Array(project.stars)].map((_, i) => (
                      <Star key={i} size={14} className="fill-primary text-primary" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
