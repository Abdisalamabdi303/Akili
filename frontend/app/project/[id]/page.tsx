"use client";

import { useState, useRef, useEffect, use } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Code, Eye, Loader2, ArrowLeft, MoreVertical } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { FileExplorer } from "@/components/FileExplorer";

interface Message {
    role: "user" | "assistant";
    content: string;
}

interface FileNode {
    name: string;
    type: "file" | "directory";
    path: string;
    children?: FileNode[];
}

export default function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const searchParams = useSearchParams();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<"code" | "preview">("preview");
    const [code, setCode] = useState("// Select a file to view its contents.");
    const [fileTree, setFileTree] = useState<FileNode[]>([]);
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [loadingFile, setLoadingFile] = useState(false);
    const [virtualFiles, setVirtualFiles] = useState<Record<string, string>>({});
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    // Live parsing of messages to extract files token-by-token
    useEffect(() => {
        const allContent = messages.map(m => m.content).join("\n");
        const files: Record<string, string> = { ...virtualFiles };
        let updated = false;

        // 1. Extract completely generated files
        const toolRegex = /<tool name="createFile">([\s\S]*?)<\/tool>/g;
        let m;
        while ((m = toolRegex.exec(allContent)) !== null) {
            const inner = m[1];
            const pathMatch = /<filePath>([\s\S]*?)<\/filePath>/.exec(inner);
            const contentMatch = /<content>([\s\S]*?)<\/content>/.exec(inner);
            if (pathMatch && contentMatch) {
                const path = pathMatch[1].trim();
                const content = contentMatch[1].trim();
                files[path] = content;
                updated = true;
            }
        }

        // 2. Extract partial (currently streaming) files
        const lastMsg = messages[messages.length - 1];
        if (lastMsg && lastMsg.role === "assistant") {
            const openToolMatch = /<tool name="createFile">(?!.*<\/tool>)([\s\S]*)$/.exec(lastMsg.content);
            if (openToolMatch) {
                const inner = openToolMatch[1];
                const pathMatch = /<filePath>([\s\S]*?)<\/filePath>/.exec(inner);
                if (pathMatch) {
                    const path = pathMatch[1].trim();
                    const contentMatch = /<content>([\s\S]*)$/.exec(inner);
                    if (contentMatch) {
                        let currentContent = contentMatch[1];
                        currentContent = currentContent.replace(/<\/content>[\s\S]*$/, ""); // Strip if closing tags streamed
                        files[path] = currentContent;
                        updated = true;
                    }
                }
            }
        }

        if (updated) {
            setVirtualFiles(files);
            setFileTree(prev => {
                const next = [...prev];
                Object.keys(files).forEach(fp => {
                    const nameParts = fp.split("/");
                    const name = nameParts[nameParts.length - 1];
                    if (!next.find(n => n.path === fp)) {
                        next.push({ name: name, type: "file", path: fp });
                    }
                });
                return next;
            });

            // If the user is currently viewing the file being actively streamed, update the code pane live
            if (selectedFile && files[selectedFile]) {
                setCode(files[selectedFile]);
            }
        }
    }, [messages]);

    // Fetch file tree on mount
    useEffect(() => {
        fetchFileTree();
    }, [id]);

    // Optionally auto-send initial prompt from landing page
    useEffect(() => {
        const initialPrompt = searchParams.get("prompt");
        if (!initialPrompt) return;
        if (messages.length > 0) return;

        const run = async () => {
            setInput(initialPrompt);
            await sendMessage(initialPrompt);
        };
        run();
    }, [searchParams, id, messages.length]);

    const fetchFileTree = async () => {
        try {
            const res = await fetch(`http://localhost:4000/api/projects/${id}/files`);
            if (res.ok) {
                const data = await res.json();
                setFileTree(data.tree || []);

                // Initialize virtualFiles based on fetched files to allow preview of saved projects
                // Note: for a large project this would be slow (fetching all files).
                // Doing this minimally or lazily is better, but since it's a prototype:
                // Actually, let's keep it simple: virtualFiles handles streaming updates.
            }
        } catch (err) {
            console.error("Failed to fetch file tree:", err);
        }
    };

    const handleFileSelect = async (path: string) => {
        setSelectedFile(path);
        setActiveTab("code");

        if (virtualFiles[path]) {
            setCode(virtualFiles[path]);
            return;
        }

        setLoadingFile(true);
        try {
            const res = await fetch(`http://localhost:4000/api/projects/${id}/files/${path}`);
            if (res.ok) {
                const data = await res.json();
                setCode(data.content || "// File is empty");
                // Cache into virtualFiles so Preview can use it
                setVirtualFiles(prev => ({ ...prev, [path]: data.content }));
            } else {
                setCode("// Error loading file");
            }
        } catch (err) {
            console.error("Failed to load file:", err);
            setCode("// Error loading file");
        } finally {
            setLoadingFile(false);
        }
    };

    const sendMessage = async (messageOverride?: string) => {
        const prompt = (messageOverride ?? input).trim();
        if (!prompt) return;

        const userMsg: Message = { role: "user", content: prompt };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

        try {
            const res = await fetch(`http://localhost:4000/api/chats/${id}/messages`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt })
            });

            if (!res.ok || !res.body) {
                throw new Error("Failed to connect to backend chat stream");
            }

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let accumulated = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                accumulated += decoder.decode(value, { stream: true });
                setMessages((prev) => {
                    const next = [...prev];
                    next[next.length - 1] = { role: "assistant", content: accumulated };
                    return next;
                });
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Unknown error";
            setMessages((prev) => {
                const next = [...prev];
                next[next.length - 1] = {
                    role: "assistant",
                    content: `Error: ${errorMessage}`
                };
                return next;
            });
        } finally {
            setLoading(false);
            fetchFileTree(); // refresh after generation is complete
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const getPreviewHtml = () => {
        let html = virtualFiles['index.html'] || "";

        // If no HTML file yet, provide a shell building state or empty state
        if (!html) {
            return `<!DOCTYPE html>
            <html>
                <head>
                    <script src="https://cdn.tailwindcss.com"></script>
                </head>
                <body class="bg-gray-50 flex items-center justify-center p-8 text-center text-gray-400 font-sans h-screen">
                    <div>
                        ${loading ? "Building preview live..." : "Waiting for generated HTML... Make sure to request an index.html"}
                    </div>
                </body>
            </html>`;
        }

        // Add tailwind CDN if not present
        if (!html.includes('tailwindcss')) {
            if (html.includes('</head>')) {
                html = html.replace('</head>', '<script src="https://cdn.tailwindcss.com"></script></head>');
            } else {
                html = '<script src="https://cdn.tailwindcss.com"></script>' + html;
            }
        }

        // Inject CSS
        const cssFiles = Object.keys(virtualFiles).filter(f => f.endsWith('.css') && f !== 'index.css');
        let cssInject = "";
        cssFiles.forEach(f => {
            cssInject += `<style>${virtualFiles[f]}</style>`;
        });

        // Handle index.css separately if exists (often global)
        if (virtualFiles['index.css']) {
            cssInject += `<style>${virtualFiles['index.css']}</style>`;
        }

        // Inject JS
        const jsFiles = Object.keys(virtualFiles).filter(f => f.endsWith('.js'));
        let jsInject = "";
        jsFiles.forEach(f => {
            jsInject += `<script type="module">${virtualFiles[f]}</script>`;
        });

        if (html.includes('</head>')) {
            html = html.replace('</head>', `${cssInject}</head>`);
        } else {
            html += cssInject;
        }

        if (html.includes('</body>')) {
            html = html.replace('</body>', `${jsInject}</body>`);
        } else {
            html += jsInject;
        }

        return html;
    };

    // Filter <tool> tags out of the chat display so the user only sees conversation
    const displayMessages = messages.map(msg => ({
        ...msg,
        content: msg.content.replace(/<tool name="createFile">[\s\S]*?<\/tool>/g, '\n\n✅ *Generated File*\n\n')
            .replace(/<tool name="createFile">(?!.*<\/tool>)[\s\S]*$/g, '\n\n⚡ *Generating Live...*\n\n')
    }));

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
                        {displayMessages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                <div
                                    className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${msg.role === "user"
                                        ? "bg-primary text-primary-foreground rounded-br-none"
                                        : "bg-muted text-muted-foreground rounded-bl-none"
                                        }`}
                                >
                                    <div className="prose prose-sm dark:prose-invert max-w-none break-words">
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
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
                <div className="h-14 border-b border-border flex items-center justify-between px-6 bg-card/50 backdrop-blur-sm shadow-sm z-10">
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
                        Live
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden bg-muted/10 relative flex">
                    {activeTab === "code" && (
                        <div className="w-64 flex-shrink-0">
                            <FileExplorer
                                tree={fileTree}
                                onFileSelect={handleFileSelect}
                                selectedFile={selectedFile}
                            />
                        </div>
                    )}

                    <div className="flex-1 overflow-auto bg-white">
                        {activeTab === "code" ? (
                            <div className="p-0 h-full">
                                {loadingFile ? (
                                    <div className="flex items-center justify-center h-full">
                                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                    </div>
                                ) : (
                                    <pre className="p-6 font-mono text-sm leading-relaxed text-foreground bg-card h-full overflow-auto">
                                        <code>{code}</code>
                                    </pre>
                                )}
                            </div>
                        ) : (
                            <iframe
                                srcDoc={getPreviewHtml()}
                                className="w-full h-full border-none bg-white block"
                                sandbox="allow-scripts allow-modals allow-popups allow-forms"
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
