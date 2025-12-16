"use client";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Menu,
  Plus,
  MessageSquare,
  Send,
  Save,
  User,
  Bot,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Project {
  id: number;
  name: string;
  prompt: string;
  content: string;
  created_at: string;
}

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/projects");
      const data = await res.json();
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  // Add a new state for the full streamed content
  const [streamedContent, setStreamedContent] = useState("");

  // Use a ref to track the current index being displayed
  const indexRef = useRef(0);

  useEffect(() => {
    if (streamedContent.length > response.length) {
      const timeout = setTimeout(() => {
        setResponse((prev) => prev + streamedContent.slice(prev.length, prev.length + 1)); // Reveal 1 char at a time
      }, 20); // 20ms interval for visible typing effect
      return () => clearTimeout(timeout);
    }
  }, [streamedContent, response]);

  const askModel = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResponse("");
    setStreamedContent("");
    indexRef.current = 0;

    try {
      const res = await fetch("http://localhost:4000/api/ask-model", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value, { stream: true });
        setStreamedContent((prev) => prev + text);
      }

    } catch (error) {
      console.error("Error fetching model response:", error);
      setResponse("Error: Failed to get response from the model.");
    } finally {
      setLoading(false);
    }
  };

  const saveProject = async () => {
    if (!response) return;
    setSaving(true);
    try {
      await fetch("http://localhost:4000/api/project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: prompt.substring(0, 30) + (prompt.length > 30 ? "..." : ""),
          prompt,
          content: response,
        }),
      });
      await fetchProjects();
      // Could add toast here
    } catch (error) {
      console.error("Error saving project:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      askModel();
    }
  };

  const loadProject = (project: Project) => {
    setSelectedProject(project);
    setPrompt(project.prompt);
    setResponse(project.content);
  };

  const startNewChat = () => {
    setSelectedProject(null);
    setPrompt("");
    setResponse("");
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col gap-4">
      <div className="p-4 pb-0">
        <Button
          onClick={startNewChat}
          className="w-full justify-start gap-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20"
          variant="ghost"
        >
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>

      <ScrollArea className="flex-1 px-2">
        <div className="space-y-2 p-2">
          <h3 className="text-xs font-semibold text-muted-foreground px-2 mb-2 uppercase tracking-wider">Recent</h3>
          {projects.map((project) => (
            <Button
              key={project.id}
              variant={selectedProject?.id === project.id ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start text-sm font-normal truncate",
                selectedProject?.id === project.id ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => loadProject(project)}
            >
              <MessageSquare className="mr-2 h-4 w-4 opacity-70" />
              <span className="truncate">{project.name || "Untitled Project"}</span>
            </Button>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border/40 mt-auto">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/20 text-primary">U</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium text-foreground">User</span>
            <span className="text-xs">Pro Plan</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-col border-r border-border/40 bg-muted/10 backdrop-blur-xl md:flex">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex flex-1 flex-col relative h-full">
        {/* Mobile Header */}
        <header className="flex items-center p-4 md:hidden border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-10">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="-ml-2">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0 bg-background/95 backdrop-blur-xl border-r-border/40">
              <SidebarContent />
            </SheetContent>
          </Sheet>
          <span className="font-semibold ml-2">Akili</span>
          <Button variant="ghost" size="icon" className="ml-auto" onClick={startNewChat}>
            <Plus className="h-5 w-5" />
          </Button>
        </header>

        {/* Chat Area */}
        <ScrollArea className="flex-1 p-4 md:p-8">
          <div className="max-w-3xl mx-auto pb-32 space-y-8">
            {!response && !loading && (
              <div className="flex flex-col items-center justify-center text-center space-y-6 mt-20 opacity-80">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center ring-1 ring-primary/20 shadow-lg shadow-primary/5">
                  <Bot className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight">How can I help you today?</h2>
              </div>
            )}

            {/* User Message */}
            {(response || loading) && prompt && (
              <div className="flex gap-4">
                <Avatar className="h-8 w-8 mt-1">
                  <AvatarFallback className="bg-muted text-muted-foreground">U</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="font-semibold text-sm text-muted-foreground">You</div>
                  <div className="text-foreground leading-relaxed whitespace-pre-wrap">{prompt}</div>
                </div>
              </div>
            )}

            {/* AI Response */}
            {(response || loading) && (
              <div className="flex gap-4">
                <Avatar className="h-8 w-8 mt-1 border border-primary/20">
                  <AvatarFallback className="bg-primary/10 text-primary">AI</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2 min-w-0">
                  <div className="font-semibold text-sm text-muted-foreground">Akili</div>
                  {loading && !response ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Thinking...
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="prose prose-invert max-w-none bg-muted/30 p-4 rounded-lg border border-border/50">
                        <pre className="text-sm font-mono whitespace-pre-wrap bg-transparent p-0 m-0 overflow-x-auto">
                          {response}
                          {loading && <span className="inline-block w-2 h-4 ml-1 bg-primary animate-pulse" />}
                        </pre>
                      </div>
                      <div className="flex justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={saveProject}
                          disabled={saving}
                          className="gap-2 border-primary/20 hover:bg-primary/10 hover:text-primary"
                        >
                          {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                          {saving ? "Saving..." : "Save Project"}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="absolute bottom-0 left-0 w-full p-4 md:p-6 bg-gradient-to-t from-background via-background/90 to-transparent pt-10">
          <div className="max-w-3xl mx-auto relative">
            <div className="glass rounded-xl p-2 shadow-2xl ring-1 ring-white/10">
              <Textarea
                ref={textareaRef}
                rows={1}
                className="min-h-[50px] max-h-[200px] w-full resize-none border-0 bg-transparent px-4 py-3 focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
                placeholder="Message Akili..."
                value={prompt}
                onChange={(e) => {
                  setPrompt(e.target.value);
                  e.target.style.height = 'auto';
                  e.target.style.height = e.target.scrollHeight + 'px';
                }}
                onKeyDown={handleKeyDown}
              />
              <div className="flex justify-between items-center px-2 pb-1 pt-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground h-8 w-8"
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <Button
                  onClick={askModel}
                  disabled={loading || !prompt.trim()}
                  size="icon"
                  className={cn(
                    "h-8 w-8 transition-all duration-200",
                    loading || !prompt.trim()
                      ? "bg-muted text-muted-foreground opacity-50"
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                  )}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="text-center mt-3">
              <p className="text-xs text-muted-foreground/60">
                Akili can make mistakes. Consider checking important information.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

