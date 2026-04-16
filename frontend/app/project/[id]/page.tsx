"use client";

import { useState, useRef, useEffect, use, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Code, Eye, Loader2, ArrowLeft, MoreVertical, StopCircle, Edit2, PanelLeftClose, PanelLeft } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { FileExplorer } from "@/components/FileExplorer";
import {
    SandpackProvider,
    SandpackLayout,
    SandpackPreview,
    useSandpack
} from "@codesandbox/sandpack-react";

const FUNNY_QUOTES = [
    "Locating the 'Any' key...",
    "Compiling... because 'it works on my machine' isn't good enough.",
    "Bribing the compiler with digital cookies...",
    "Writing code... and immediately regretting my variable names.",
    "Refactoring exactly one line of code...",
    "Wait, did I forget a semicolon?",
    "Calculating the meaning of life, the universe, and everything...",
    "Deleting the bugs...",
    "Adding more bugs so the debugging team stays employed...",
    "Translating English into 1s and 0s...",
];

function SandpackAutoFixer({ onAutoFix }: { onAutoFix: (errorMsg: string) => void }) {
    const { sandpack } = useSandpack();
    const { error } = sandpack;
    const prevErrorRef = useRef<string | null>(null);

    useEffect(() => {
        if (error && error.message) {
            if (error.message !== prevErrorRef.current) {
                prevErrorRef.current = error.message;
                const timer = setTimeout(() => {
                    onAutoFix(`${error.title || 'Compile Error'}\n${error.message}`);
                }, 1000);
                return () => clearTimeout(timer);
            }
        } else {
            // Reset if error clears
            prevErrorRef.current = null;
        }
    }, [error, onAutoFix]);

    return null;
}

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
    const [debouncedVirtualFiles, setDebouncedVirtualFiles] = useState<Record<string, string>>({});

    useEffect(() => {
        if (!loading) {
            // Apply instantly on initial load or when inference finishes
            setDebouncedVirtualFiles(virtualFiles);
            return;
        }

        // Throttle updates to Sandpack so it doesn't crash when receiving tokens rapidly
        const timer = setTimeout(() => {
            setDebouncedVirtualFiles(virtualFiles);
        }, 1500);
        return () => clearTimeout(timer);
    }, [virtualFiles, loading]);
    const [projectTitle, setProjectTitle] = useState("Loading project...");

    const [quoteIndex, setQuoteIndex] = useState(0);
    const autoFixCount = useRef(0);

    useEffect(() => {
        if (!loading) return;
        setQuoteIndex(Math.floor(Math.random() * FUNNY_QUOTES.length));
        const interval = setInterval(() => {
            setQuoteIndex(Math.floor(Math.random() * FUNNY_QUOTES.length));
        }, 9000);
        return () => clearInterval(interval);
    }, [loading]);

    // New UI States
    const [isChatOpen, setIsChatOpen] = useState(true);
    const [isHistoryLoaded, setIsHistoryLoaded] = useState(false);
    const abortControllerRef = useRef<AbortController | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const initialPromptRan = useRef(false);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    // Live parsing of messages to extract files token-by-token
    useEffect(() => {
        const allContent = messages.map(m => m.content).join("\n");
        const files: Record<string, string> = {};
        let updated = false;

        // 1. Extract completely generated files (createFile AND updateFile)
        const toolRegex = /<tool name="(?:createFile|updateFile)">([\s\S]*?)(?:<\/tool>|$)/g;
        let m;
        while ((m = toolRegex.exec(allContent)) !== null) {
            const inner = m[1];
            const pathMatch = /<filePath>([\s\S]*?)(?:<\/filePath>|$)/.exec(inner);
            const contentMatch = /<content>([\s\S]*?)(?:<\/content>|$)/.exec(inner);
            if (pathMatch) {
                let path = pathMatch[1].split('<')[0].trim();
                const fileName = path.split('/').pop();
                if (fileName && !fileName.includes('.')) {
                    path += '.js';
                }
                const content = contentMatch ? contentMatch[1].trim() : "";
                if (path) {
                    files[path] = content;
                    updated = true;
                }
            }
        }

        // 2. Extract partial (currently streaming) files
        const lastMsg = messages[messages.length - 1];
        if (lastMsg && lastMsg.role === "assistant") {
            const openToolMatch = /<tool name="(?:createFile|updateFile)">(?!.*<\/tool>)([\s\S]*)$/.exec(lastMsg.content);
            if (openToolMatch) {
                const inner = openToolMatch[1];
                const pathMatch = /<filePath>([\s\S]*?)<\/filePath>/.exec(inner);
                if (pathMatch) {
                    let path = pathMatch[1].split('<')[0].trim();
                    const fileName = path.split('/').pop();
                    if (fileName && !fileName.includes('.')) {
                        path += '.js';
                    }
                    const contentMatch = /<content>([\s\S]*)$/.exec(inner);
                    if (contentMatch && path) {
                        let currentContent = contentMatch[1];
                        currentContent = currentContent.replace(/<\/content>[\s\S]*$/, ""); // Strip if closing tags streamed
                        files[path] = currentContent;
                        updated = true;
                    }
                }
            }
        }

        if (updated) {
            // Remove extensionless duplicate files if a version with an extension exists
            const extensionlessKeys = Object.keys(files).filter(k => !k.split('/').pop()?.includes('.'));
            extensionlessKeys.forEach(k => {
                if (Object.keys(files).some(other => other !== k && other.startsWith(k + '.'))) {
                    delete files[k];
                }
            });

            setVirtualFiles(prev => {
                let hasChanges = false;
                const next = { ...prev };
                for (const k in files) {
                    if (prev[k] !== files[k]) {
                        next[k] = files[k];
                        hasChanges = true;
                    }
                }
                for (const k in prev) {
                    if (!(k in files)) {
                        delete next[k];
                        hasChanges = true;
                    }
                }
                return hasChanges ? next : prev;
            });

            setFileTree(prev => {
                const newTree = buildFileTree(files);
                return JSON.stringify(prev) === JSON.stringify(newTree) ? prev : newTree;
            });

            if (selectedFile && files[selectedFile]) {
                setCode(files[selectedFile]);
            }
        }
    }, [messages, selectedFile]);

    useEffect(() => {
        fetchFileTree();
        fetchProjectInfo();
        fetchChatHistory();
    }, [id]);

    const fetchProjectInfo = async () => {
        try {
            const res = await fetch(`http://localhost:4000/api/chats/${id}/info`);
            if (res.ok) {
                const data = await res.json();
                setProjectTitle(data.title || `Project #${id}`);
            }
        } catch (err) {
            console.error("Failed to fetch project info:", err);
        }
    };

    const fetchChatHistory = async () => {
        try {
            const res = await fetch(`http://localhost:4000/api/chats/${id}`);
            if (res.ok) {
                const data = await res.json();
                if (data.length > 0) {
                    setMessages(data);
                    initialPromptRan.current = true; // Block initial prompt if history exists
                }
            }
        } catch (err) {
            console.error("Failed to fetch chat history:", err);
        } finally {
            setIsHistoryLoaded(true);
        }
    };

    useEffect(() => {
        if (!isHistoryLoaded) return;

        const initialPrompt = searchParams.get("prompt");
        if (!initialPrompt) return;
        if (initialPromptRan.current) return;

        initialPromptRan.current = true;

        const run = async () => {
            setInput(initialPrompt);
            await sendMessage(initialPrompt);
        };
        run();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isHistoryLoaded]);

    const fetchFileTree = async () => {
        try {
            const res = await fetch(`http://localhost:4000/api/projects/${id}/files`);
            if (res.ok) {
                const data = await res.json();
                // Merge backend file tree with virtual files and base Sandpack files
                const allFiles = { ...virtualFiles };
                if (data.tree) {
                    const extractFiles = (nodes: FileNode[], currentPath = '') => {
                        nodes.forEach((node) => {
                            const nodePath = currentPath ? `${currentPath}/${node.name}` : node.name;
                            if (node.type === 'file') {
                                allFiles[nodePath] = ''; // Content will be fetched on demand
                            } else if (node.type === 'directory' && node.children) {
                                extractFiles(node.children, nodePath);
                            }
                        });
                    };
                    extractFiles(data.tree);
                }
                setFileTree(buildFileTree(allFiles));
            }
        } catch (err) {
            console.error("Failed to fetch file tree:", err);
        }
    };

    const handleFileSelect = async (path: string) => {
        setSelectedFile(path);
        setActiveTab("code");

        const relativePath = path.replace(/^\/+/, '');
        const matchingKey = Object.keys(virtualFiles).find(k => k === path || k === relativePath || `/${k}` === path);

        if (matchingKey && virtualFiles[matchingKey]) {
            setCode(virtualFiles[matchingKey]);
            return;
        }

        if (baseSandpackFiles[path as keyof typeof baseSandpackFiles]) {
            setCode(baseSandpackFiles[path as keyof typeof baseSandpackFiles]);
            return;
        }

        setLoadingFile(true);
        try {
            const cleanPath = path.replace(/^\/+/, '');
            const res = await fetch(`http://localhost:4000/api/projects/${id}/files/${cleanPath}`);
            if (res.ok) {
                const data = await res.json();
                setCode(data.content || "// File is empty");
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

    const handleInterrupt = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
    };

    const handleEditPrompt = (content: string) => {
        setInput(content);
    };

    const sendMessage = async (messageOverride?: string) => {
        const prompt = (messageOverride ?? input).trim();
        if (!prompt) return;

        if (messageOverride) {
            autoFixCount.current += 1;
            if (autoFixCount.current > 3) {
                console.warn("Max auto-fix retries reached.");
                return;
            }
        } else {
            autoFixCount.current = 0; // manual user message resets count
        }

        const controller = new AbortController();
        abortControllerRef.current = controller;

        const userMsg: Message = { role: "user", content: prompt };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

        try {
            const res = await fetch(`http://localhost:4000/api/chats/${id}/messages`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt }),
                signal: controller.signal
            });

            if (!res.ok || !res.body) {
                throw new Error("Failed to connect to backend chat stream");
            }

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let accumulated = "";
            let lastUpdateTime = Date.now();

            while (true) {
                const { done, value } = await reader.read();
                if (done) {
                    setMessages((prev) => {
                        const next = [...prev];
                        next[next.length - 1] = { role: "assistant", content: accumulated };
                        return next;
                    });
                    break;
                }

                accumulated += decoder.decode(value, { stream: true });

                if (Date.now() - lastUpdateTime > 50) {
                    setMessages((prev) => {
                        const next = [...prev];
                        next[next.length - 1] = { role: "assistant", content: accumulated };
                        return next;
                    });
                    lastUpdateTime = Date.now();
                    // CRITICAL FIX: Yield to macrotask event loop.
                    // Localhost streams buffer massive amounts of chunks instantly. React 18+ correctly attempts 
                    // to batch them inside microtasks, but if the CPU processes chunks for >50ms, it queues 
                    // over 50 setMessages calls synchronously, crashing React's Maximum Update Depth.
                    // This forces a state flush and paint frame between heavy buffers!
                    await new Promise(resolve => setTimeout(resolve, 0));
                }
            }
        } catch (err: unknown) {
            if (err instanceof Error && err.name === 'AbortError') {
                console.log("Stream aborted by user.");
            } else {
                setMessages((prev) => {
                    const next = [...prev];
                    next[next.length - 1] = {
                        role: "assistant",
                        content: `Error: ${err instanceof Error ? err.message : "Unknown error"}`
                    };
                    return next;
                });
            }
        } finally {
            setLoading(false);
            abortControllerRef.current = null;
            fetchFileTree();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    // Filter <tool> tags out of the chat display so the user only sees conversation
    const displayMessages = messages.map(msg => ({
        ...msg,
        content: msg.content.replace(/<tool name="(?:createFile|updateFile)">[\s\S]*?(?:<\/tool>|$)/g, '\n\n✅ *Generated File*\n\n')
    }));

    // Convert virtualFiles to Sandpack format (must start with /)
    const sandpackFiles = useMemo(() => {
        const result: Record<string, string> = {};

        Object.keys(debouncedVirtualFiles).forEach((key) => {
            const normalizedKey = key.startsWith('/') ? key : `/${key}`;

            // Skip package.json to prevent JSON.parse crashes in Sandpack during streaming
            if (normalizedKey !== '/package.json') {
                result[normalizedKey] = debouncedVirtualFiles[key];
            }
        });

        // Removed React App.js mapping; vanilla just expects index.html and script.js

        return result;
    }, [debouncedVirtualFiles]);

    // Inject minimal vanilla boilerplate
    // All files here will be available in Sandpack's bundler as authored files.
    const baseSandpackFiles = useMemo(() => ({
        "/index.html": `<!DOCTYPE html>
<html lang="en" data-theme="dark" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Akili Vanilla App</title>
  <link href="https://cdn.jsdelivr.net/npm/daisyui@4.10.1/dist/full.min.css" rel="stylesheet" type="text/css" />
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="styles.css">
</head>
<body class="bg-slate-950 text-white min-h-screen antialiased">
  <div id="app"></div>
  <script src="script.js"></script>
</body>
</html>`,
        "/styles.css": `/* Global styles */
* { box-sizing: border-box; margin: 0; padding: 0; }
body { background-color: transparent !important; color: inherit !important; }`,
        "/script.js": `// App Logic Here
// Note: Sandpack executes JS after page load, so do NOT use DOMContentLoaded.
console.log("App loaded");`,
        "/index.js": `import "./styles.css";\nimport "./script.js";`
    }), []);

    const finalSandpackFiles = useMemo(() => ({ ...baseSandpackFiles, ...sandpackFiles }), [baseSandpackFiles, sandpackFiles]);
    const sandpackCustomSetup = useMemo(() => ({
        dependencies: {}
    }), []);

    // Helper to build a hierarchical file tree from a flat list of paths
    function buildFileTree(files: Record<string, string>): FileNode[] {
        const tree: FileNode[] = [];
        const pathMap: Map<string, FileNode> = new Map();

        // Add baseSandpackFiles to the map first
        Object.keys(baseSandpackFiles).forEach(filePath => {
            pathMap.set(filePath, { name: filePath.split('/').pop() || '', type: 'file', path: filePath });
        });

        // Add virtualFiles, overwriting if paths conflict
        Object.keys(files).forEach(filePath => {
            // Clean path to prevent trailing slashes behaving strangely
            const cleanPath = filePath.replace(/\/+$/, '');
            if (!cleanPath) return; // ignore totally empty paths
            const normalizedPath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
            pathMap.set(normalizedPath, { name: normalizedPath.split('/').pop() || '', type: 'file', path: normalizedPath });
        });

        // Convert map to hierarchical tree
        pathMap.forEach(fileNode => {
            const parts = fileNode.path.split('/').filter(Boolean);
            let currentLevel = tree;
            let currentPath = '';

            parts.forEach((part, index) => {
                currentPath += `/${part}`;
                let existingNode = currentLevel.find(node => node.name === part);

                // If found but different type, the one we encounter later overrides or we skip creation
                // But generally folders vs files shouldn't share names exactly. We'll reuse if it's already a directory.

                if (!existingNode) {
                    existingNode = {
                        name: part,
                        type: (index === parts.length - 1 && fileNode.type === 'file') ? 'file' : 'directory',
                        path: currentPath,
                        children: []
                    };
                    currentLevel.push(existingNode);
                } else if (index < parts.length - 1 && existingNode.type === 'file') {
                    // Turn it into a directory if it was mistakenly added as a file but has children
                    existingNode.type = 'directory';
                    existingNode.children = existingNode.children || [];
                }

                if (index < parts.length - 1) {
                    if (!existingNode.children) {
                        existingNode.children = [];
                    }
                    currentLevel = existingNode.children;
                }
            });
        });

        // Sort directories first, then files, then alphabetically
        const sortTree = (nodes: FileNode[]) => {
            nodes.sort((a, b) => {
                if (a.type === 'directory' && b.type === 'file') return -1;
                if (a.type === 'file' && b.type === 'directory') return 1;
                return a.name.localeCompare(b.name);
            });
            nodes.forEach(node => {
                if (node.children) {
                    sortTree(node.children);
                }
            });
        };

        sortTree(tree);
        return tree;
    }

    return (
        <div className="h-screen bg-background flex overflow-hidden font-sans">
            {/* Sidebar: Chat Panel */}
            <div className={`border-r border-border/80 bg-card/60 backdrop-blur-xl flex flex-col h-[50vh] md:h-full shadow-[0_0_45px_rgba(2,6,23,0.4)] z-20 transition-all duration-300 ease-in-out shrink-0 overflow-hidden ${isChatOpen ? "w-full md:w-[400px]" : "w-0 border-none opacity-0"}`}>
                <div className="p-4 border-b border-border/80 bg-card/40 flex items-center justify-between min-w-[300px]">
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => router.push('/')} className="mr-1 hover:bg-primary/10">
                            <ArrowLeft size={18} />
                        </Button>
                        <div>
                            <h2 className="font-semibold text-foreground truncate max-w-[180px]">{projectTitle}</h2>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span> Online
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon">
                            <MoreVertical size={18} />
                        </Button>
                    </div>
                </div>

                {/* Messages */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 min-w-[300px] space-y-4">
                    {displayMessages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                            {msg.role === "user" && (
                                <div className="flex flex-col justify-center gap-1 mr-2 opacity-50 hover:opacity-100 transition-opacity">
                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleEditPrompt(msg.content)} title="Edit Prompt">
                                        <Edit2 size={12} />
                                    </Button>
                                </div>
                            )}
                            <div
                                className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${msg.role === "user"
                                    ? "bg-gradient-to-br from-primary to-accent text-primary-foreground rounded-br-none"
                                    : "bg-muted/70 text-foreground rounded-bl-none border border-border/70"
                                    }`}
                            >
                                {msg.role === "assistant" && !msg.content.trim() && loading ? (
                                    <div className="flex items-center gap-1.5 px-1 py-1">
                                        <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce [animation-delay:0ms]"></span>
                                        <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce [animation-delay:150ms]"></span>
                                        <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce [animation-delay:300ms]"></span>
                                    </div>
                                ) : (
                                    <div className="prose prose-sm dark:prose-invert max-w-none break-words">
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            components={{
                                                p: ({ ...props }) => <p className="mb-0" {...props} />
                                            }}
                                        >
                                            {msg.content}
                                        </ReactMarkdown>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input */}
                <div className="p-4 border-t border-border/80 bg-card/30 min-w-[300px]">
                    <div className="relative flex items-center shadow-sm">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type a message..."
                            className="pr-12 rounded-full border-border/80 focus:ring-primary bg-background/85"
                            disabled={loading}
                        />
                        {loading ? (
                            <Button
                                onClick={handleInterrupt}
                                className="absolute right-1 w-8 h-8 rounded-full p-0 transition-transform active:scale-95 bg-red-500 hover:bg-red-600 text-white"
                                size="icon"
                                title="Stop Generation"
                            >
                                <StopCircle size={14} />
                            </Button>
                        ) : (
                            <Button
                                onClick={() => sendMessage()}
                                disabled={!input.trim()}
                                className="absolute right-1 w-8 h-8 rounded-full p-0 transition-transform active:scale-95 bg-gradient-to-br from-primary to-accent text-primary-foreground"
                                size="icon"
                                title="Send Message"
                            >
                                <Send size={14} />
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Area: Workspace */}
            <div className="flex-1 flex flex-col bg-background relative overflow-hidden min-w-0">
                {/* Toolbar */}
                <div className="h-14 border-b border-border/80 flex items-center px-4 bg-background/80 backdrop-blur-lg shadow-sm z-10 shrink-0 gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsChatOpen(!isChatOpen)}
                        className="text-muted-foreground hover:bg-primary/10"
                        title={isChatOpen ? "Close Chat" : "Open Chat"}
                    >
                        {isChatOpen ? <PanelLeftClose size={18} /> : <PanelLeft size={18} />}
                    </Button>

                    <div className="flex bg-card/70 border border-border/70 p-1 rounded-lg">
                        <button
                            onClick={() => setActiveTab("preview")}
                            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === "preview"
                                ? "bg-background text-primary shadow-sm ring-1 ring-primary/30"
                                : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            <Eye size={16} /> Preview
                        </button>
                        <button
                            onClick={() => setActiveTab("code")}
                            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === "code"
                                ? "bg-background text-primary shadow-sm ring-1 ring-primary/30"
                                : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            <Code size={16} /> Code
                        </button>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground ml-auto pr-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse hidden md:block"></div>
                        <span className="hidden md:inline">React Compiler</span>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden bg-transparent relative flex">
                    {activeTab === "code" && (
                        <div className="w-64 flex-shrink-0 border-r border-border/80 bg-card/40">
                            <FileExplorer
                                tree={fileTree}
                                onFileSelect={handleFileSelect}
                                selectedFile={selectedFile}
                            />
                        </div>
                    )}

                    <div className="flex-1 overflow-auto bg-background flex flex-col">
                        {activeTab === "code" ? (
                            <div className="p-0 h-full">
                                {loadingFile ? (
                                    <div className="flex items-center justify-center h-full">
                                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                    </div>
                                ) : (
                                    <pre className="p-6 font-mono text-sm leading-relaxed text-foreground bg-card/80 h-full overflow-auto">
                                        <code>{code}</code>
                                    </pre>
                                )}
                            </div>
                        ) : (
                            <div className="h-full w-full relative" style={{ height: '100%' }}>
                                {(loading || Object.keys(virtualFiles).length === 0) && (
                                    <div className="absolute inset-0 z-50 bg-background/92 backdrop-blur-sm animate-in fade-in duration-500">
                                        <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center">
                                            <Loader2 className="mb-4 h-10 w-10 animate-spin text-primary" />
                                            <h3 className="max-w-md text-sm font-medium tracking-wide text-foreground/90">
                                                {Object.keys(virtualFiles).length === 0 && !loading
                                                    ? "Preparing preview environment..."
                                                    : "Compiling your generated app..."}
                                            </h3>
                                        </div>
                                        {loading && (
                                            <div className="pointer-events-none absolute bottom-4 left-4 max-w-sm rounded-full border border-border/70 bg-card/70 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur-sm transition-opacity duration-300">
                                                {FUNNY_QUOTES[quoteIndex]}
                                            </div>
                                        )}
                                    </div>
                                )}
                                <SandpackProvider
                                    template="vanilla"
                                    theme="dark"
                                    files={finalSandpackFiles}
                                    customSetup={sandpackCustomSetup}
                                    options={{
                                        externalResources: [
                                            "https://cdn.tailwindcss.com",
                                            "https://cdn.jsdelivr.net/npm/daisyui@4.10.1/dist/full.min.css"
                                        ]
                                    }}
                                    style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                                >
                                    <SandpackLayout style={{ flex: 1, border: 'none', borderRadius: 0, minHeight: 0, height: '100%' }}>
                                        <SandpackPreview
                                            style={{ flex: 1, height: '100%' }}
                                            showOpenInCodeSandbox={false}
                                            showRefreshButton={true}
                                        />
                                        <SandpackAutoFixer onAutoFix={(errorMsg) => {
                                            // Build a file manifest so the LLM knows the exact content of every file
                                            const fileManifest = Object.entries(virtualFiles)
                                                .filter(([path]) => !path.includes('node_modules'))
                                                .map(([path, content]) => `=== ${path} ===\n${content}`)
                                                .join('\n\n');
                                            const prompt = `[SYSTEM: Compile Error] Sandpack failed to compile with this error:\n\n${errorMsg}\n\nHere are all the current project files:\n\n${fileManifest}\n\nIdentify which file contains the HTML/JS error and output exactly ONE <tool name="updateFile"> with the corrected file. Do NOT output any other text.`;
                                            sendMessage(prompt);
                                        }} />
                                    </SandpackLayout>
                                </SandpackProvider>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
