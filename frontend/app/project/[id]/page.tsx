"use client";

import { useState, useRef, useEffect, use } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Code, Eye, Loader2, ArrowLeft, MoreVertical } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useRouter } from "next/navigation";
import Image from "next/image";

// Mock Initial Code
const INITIAL_CODE = `import React from 'react';

export default function App() {
  return (
    <div className="p-8 bg-gradient-to-br from-indigo-500 to-purple-600 min-h-screen text-white flex flex-col items-center justify-center">
      <h1 className="text-6xl font-extrabold mb-4 animate-bounce">Hello World!</h1>
      <p className="text-xl opacity-90">Welcome to your new project.</p>
      <button className="mt-8 px-6 py-3 bg-white text-indigo-600 rounded-full font-bold shadow-lg hover:scale-105 transition-transform">
        Click Me
      </button>
    </div>
  );
}`;

interface Message {
    role: "user" | "assistant";
    content: string;
}

export default function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [messages, setMessages] = useState<Message[]>([
        { role: "assistant", content: "Hello! I've set up your project. I've created a basic React component for you. How would you like to modify it?" }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<"code" | "preview">("preview");
    const [code, setCode] = useState(INITIAL_CODE);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMsg: Message = { role: "user", content: input };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        // Simulate AI Response
        setTimeout(() => {
            const assistantMsg: Message = { role: "assistant", content: "I'm working on that change for you... (This is a mock response)" };
            setMessages((prev) => [...prev, assistantMsg]);
            setLoading(false);
        }, 1500);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="h-screen bg-background flex flex-col md:flex-row overflow-hidden font-sans">
            {/* Sidebar: Chat Panel */}
            <div className="w-full md:w-[400px] border-r border-border bg-card flex flex-col h-[50vh] md:h-full shadow-xl z-20">
                <div className="p-4 border-b border-border bg-primary/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => router.push('/')} className="mr-1">
                            <ArrowLeft size={18} />
                        </Button>
                        <div>
                            <h2 className="font-semibold text-foreground">Project #{id}</h2>
                            <p className="text-xs text-muted-foreground">Online</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon">
                        <MoreVertical size={18} />
                    </Button>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4" ref={scrollRef}>
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                <div
                                    className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${msg.role === "user"
                                            ? "bg-primary text-primary-foreground rounded-br-none"
                                            : "bg-muted text-muted-foreground rounded-bl-none"
                                        }`}
                                >
                                    <div className="prose prose-sm dark:prose-invert max-w-none break-words">
                                        <ReactMarkdown
                                            components={{
                                                p: ({ node, ...props }) => <p className="mb-0" {...props} />
                                            }}
                                        >
                                            {msg.content}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-muted text-muted-foreground rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" /> Thinking...
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>

                {/* Input */}
                <div className="p-4 border-t border-border bg-background">
                    <div className="relative">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type a message..."
                            className="pr-12 rounded-full border-primary/20 focus:ring-primary shadow-inner bg-muted/30"
                        />
                        <Button
                            onClick={sendMessage}
                            disabled={!input.trim() || loading}
                            className="absolute right-1 top-1 h-8 w-8 rounded-full p-0"
                            size="icon"
                        >
                            <Send size={14} />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Area: Workspace */}
            <div className="flex-1 flex flex-col bg-background relative">
                {/* Toolbar */}
                <div className="h-14 border-b border-border flex items-center justify-between px-6 bg-card/50 backdrop-blur-sm">
                    <div className="flex bg-muted/50 p-1 rounded-lg">
                        <button
                            onClick={() => setActiveTab("preview")}
                            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === "preview"
                                    ? "bg-background text-primary shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            <Eye size={16} /> Preview
                        </button>
                        <button
                            onClick={() => setActiveTab("code")}
                            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === "code"
                                    ? "bg-background text-primary shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            <Code size={16} /> Code
                        </button>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        Saved
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto bg-muted/10 relative">
                    {activeTab === "code" ? (
                        <div className="p-0 h-full">
                            <pre className="p-6 font-mono text-sm leading-relaxed text-foreground bg-card h-full overflow-auto">
                                <code>{code}</code>
                            </pre>
                        </div>
                    ) : (
                        <div className="h-full w-full flex items-center justify-center p-8">
                            {/* 
                       In a real app, this would be an iframe or a sandboxed renderer.
                       For mock purposes, we'll try to visually simulate the "output" of the code
                       by hardcoding the JSX result of the INITIAL_CODE.
                     */}
                            <div className="w-full h-full bg-white rounded-xl shadow-2xl overflow-hidden border border-border/50 relative">
                                {/* Browser Chrome Mock */}
                                <div className="h-8 bg-gray-100 border-b border-gray-200 flex items-center px-4 gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                    <div className="flex-1 mx-4 bg-white h-5 rounded text-[10px] flex items-center justify-center text-gray-400 font-mono">localhost:3000</div>
                                </div>

                                {/* Rendered Content */}
                                <div className="p-8 bg-gradient-to-br from-indigo-500 to-purple-600 h-full text-white flex flex-col items-center justify-center">
                                    <h1 className="text-6xl font-extrabold mb-4 animate-bounce">Hello World!</h1>
                                    <p className="text-xl opacity-90">Welcome to your new project.</p>
                                    <button className="mt-8 px-6 py-3 bg-white text-indigo-600 rounded-full font-bold shadow-lg hover:scale-105 transition-transform">
                                        Click Me
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
