"use client";

import { useState, useRef, useEffect, use, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
    Send, Code, Eye, Loader2, ArrowLeft, MoreVertical, 
    StopCircle, Edit2, PanelLeftClose, PanelLeft,
    FileText, Terminal, Cpu, Layers, Sparkles, CheckCircle2,
    Activity, Box, Zap
} from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { FileExplorer } from "@/components/FileExplorer";
import { motion, AnimatePresence } from "framer-motion";
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

// ── Premium UI Components ──

function FileBadge({ filename, action }: { filename: string; action: string }) {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="my-2 flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 p-2.5 backdrop-blur-md hover:bg-primary/10 transition-colors"
        >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary shadow-[0_0_10px_rgba(var(--primary),0.2)]">
                <FileText size={16} />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[9px] font-black uppercase tracking-widest text-primary/80">{action}</span>
                    <div className="h-0.5 w-0.5 rounded-full bg-primary/30" />
                    <span className="text-[9px] font-medium text-muted-foreground/60">Success</span>
                </div>
                <div className="truncate text-xs font-bold text-foreground/90">{filename}</div>
            </div>
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-500">
                <CheckCircle2 size={12} />
            </div>
        </motion.div>
    );
}

function BuildSequence({ loading }: { loading: boolean }) {
    const steps = [
        { icon: Cpu, label: "Initializing engine", duration: 1500 },
        { icon: Terminal, label: "Resolving modules", duration: 2000 },
        { icon: Layers, label: "Optimizing assets", duration: 1800 },
        { icon: Activity, label: "Starting bundler", duration: 1200 },
    ];

    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        if (!loading) {
            setCurrentStep(0);
            return;
        }
        const interval = setInterval(() => {
            setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
        }, 2000);
        return () => clearInterval(interval);
    }, [loading, steps.length]);

    return (
        <div className="flex flex-col items-center gap-8">
            <div className="relative">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="h-24 w-24 rounded-full border-t-2 border-primary/40 p-1"
                />
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 m-auto h-16 w-16 rounded-full border-b-2 border-primary/60 p-1"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="h-8 w-8 text-primary animate-pulse" />
                </div>
            </div>

            <div className="flex flex-col items-center gap-4 min-w-[200px]">
                <h3 className="text-lg font-bold tracking-tight text-foreground">
                    Building your vision
                </h3>
                <div className="space-y-3 w-full">
                    {steps.map((step, idx) => (
                        <motion.div
                            key={step.label}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ 
                                opacity: idx <= currentStep ? 1 : 0.3,
                                x: 0,
                                scale: idx === currentStep ? 1.05 : 1
                            }}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                                idx === currentStep ? "bg-primary/10 border border-primary/20" : ""
                            }`}
                        >
                            <step.icon size={14} className={idx === currentStep ? "text-primary" : "text-muted-foreground"} />
                            <span className={`text-xs font-medium ${idx === currentStep ? "text-foreground" : "text-muted-foreground"}`}>
                                {step.label}
                            </span>
                            {idx < currentStep && (
                                <CheckCircle2 size={12} className="ml-auto text-emerald-500" />
                            )}
                            {idx === currentStep && (
                                <div className="ml-auto flex gap-1">
                                    <span className="h-1 w-1 rounded-full bg-primary animate-bounce" />
                                    <span className="h-1 w-1 rounded-full bg-primary animate-bounce [animation-delay:150ms]" />
                                    <span className="h-1 w-1 rounded-full bg-primary animate-bounce [animation-delay:300ms]" />
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
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
        // Atomic Update: Only push virtual files to Sandpack when generation finishes
        if (!loading) {
            setDebouncedVirtualFiles(virtualFiles);
        }
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
        const toolRegex = /<tool name="(?:createFile|updateFile)">([\s\S]*?)(?=<\/tool>|<tool|$)/g;
        let m;
        while ((m = toolRegex.exec(allContent)) !== null) {
            const inner = m[1];
            const pathMatch = /<filePath>([\s\S]*?)(?=<\/filePath>|<|$)/.exec(inner);
            const contentMatch = /<content>([\s\S]*?)(?=<\/content>|<|$)/.exec(inner);
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
                        // Cut off if the model starts writing a new tag or ends the current one
                        const tagIndex = currentContent.search(/<\/content>|<\/tool>|<tool|<filePath/);
                        if (tagIndex !== -1) {
                            currentContent = currentContent.slice(0, tagIndex);
                        }
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
    const displayMessages = useMemo(() => {
        return messages
            .filter(msg => {
                // Hide internal system feedback from the user view
                if (msg.role === "user") {
                    return !msg.content.startsWith("[TOOL_RESULT:") && 
                           !msg.content.startsWith("[TOOL_ERROR:") &&
                           !msg.content.startsWith("[SYSTEM:");
                }
                return true;
            })
            .map(msg => {
                let content = msg.content;
                
                // 0. Hide the internal thinking process from the UI
                content = content.replace(/<thinking>[\s\S]*?<\/thinking>/g, "");
                // If the thinking block is still open (streaming), hide everything from the start of it
                content = content.replace(/<thinking>[\s\S]*$/g, "");

                // 1. Replace completed tool tags with a stable marker
                content = content.replace(/<tool name="(createFile|updateFile)">[\s\S]*?<filePath>([\s\S]*?)<\/filePath>[\s\S]*?<\/tool>/g, (match, action, path) => {
                    const cleanPath = path.split('<')[0].trim();
                    const actionType = action === "createFile" ? "CREATED" : "UPDATED";
                    return `\n\n:::FILE_BADGE:${cleanPath}:${actionType}:::\n\n`;
                });

                // 2. Strip any in-progress tool tag (from the first <tool to the end of string)
                // This prevents raw XML from "blinking" into view while streaming
                content = content.replace(/<tool name="(?:createFile|updateFile|readFile|runCommand|deleteFile|pushToGitHub)">[\s\S]*$/g, "\n\n:::LOADING_FILE:::\n\n");

                // 3. Final cleanup of any stray tags
                content = content.replace(/<\/tool>/g, "");

                return { ...msg, content };
            });
    }, [messages]);

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
            <div className={`border-r border-border/50 bg-card/30 backdrop-blur-3xl flex flex-col h-[50vh] md:h-full shadow-[20px_0_50px_rgba(0,0,0,0.3)] z-20 transition-all duration-300 ease-in-out shrink-0 overflow-hidden ${isChatOpen ? "w-full md:w-[400px]" : "w-0 border-none opacity-0"}`}>
                <div className="p-5 border-b border-border/50 bg-white/5 flex items-center justify-between min-w-[300px]">
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => router.push('/')} className="mr-1 text-muted-foreground hover:text-primary hover:bg-primary/10">
                            <ArrowLeft size={18} />
                        </Button>
                        <div>
                            <h2 className="font-semibold text-foreground truncate max-w-[180px] text-sm">{projectTitle}</h2>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span> Online
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
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 min-w-[300px] space-y-6 bg-transparent scroll-smooth">
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
                                className={`max-w-[88%] rounded-[1.25rem] px-5 py-4 text-sm leading-relaxed transition-all ${msg.role === "user"
                                    ? "bg-primary text-white rounded-tr-none shadow-[0_10px_30px_rgba(var(--primary),0.3)] ml-auto"
                                    : "glass-card text-foreground rounded-tl-none border-white/10"
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
                                                p: ({ children, ...props }) => {
                                                    // Check if this paragraph is our special marker
                                                    const text = String(children);
                                                    if (text.startsWith(":::FILE_BADGE:") && text.endsWith(":::")) {
                                                        const [_, filename, action] = text.split(":");
                                                        return <FileBadge filename={filename} action={action} />;
                                                    }
                                                    if (text === ":::LOADING_FILE:::") {
                                                        return (
                                                            <div className="flex items-center gap-2 py-2 text-primary animate-pulse">
                                                                <Activity size={14} />
                                                                <span className="text-xs font-bold uppercase tracking-widest">Generating file...</span>
                                                            </div>
                                                        );
                                                    }
                                                    return <p className="mb-0" {...props}>{children}</p>;
                                                }
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
                <div className="p-6 border-t border-border/50 bg-white/5 backdrop-blur-xl min-w-[300px]">
                    <div className="relative flex items-center shadow-2xl">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="What's next for your project?"
                            className="h-14 pr-16 rounded-[1.25rem] border-white/5 bg-white/5 focus:ring-2 focus:ring-primary/40 focus:border-primary/40 text-[15px] placeholder:text-muted-foreground/30 transition-all shadow-inner"
                            disabled={loading}
                        />
                        {loading ? (
                            <Button
                                onClick={handleInterrupt}
                                className="absolute right-1.5 w-9 h-9 rounded-xl p-0 transition-all active:scale-95 bg-red-500/20 border border-red-500/30 text-red-500 hover:bg-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                                size="icon"
                                title="Stop Generation"
                            >
                                <StopCircle size={16} />
                            </Button>
                        ) : (
                            <Button
                                onClick={() => sendMessage()}
                                disabled={!input.trim()}
                                className="absolute right-1.5 w-9 h-9 rounded-xl p-0 transition-all active:scale-90 bg-primary hover:bg-primary/90 text-white shadow-[0_0_15px_rgba(var(--primary),0.4)] disabled:opacity-40 btn-shine"
                                size="icon"
                                title="Send Message"
                            >
                                <Send size={16} />
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Area: Workspace */}
            <div className="flex-1 flex flex-col bg-background relative overflow-hidden min-w-0">
                {/* Toolbar */}
                <div className="h-14 border-b border-white/5 flex items-center px-4 bg-card/50 backdrop-blur-xl z-10 shrink-0 gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsChatOpen(!isChatOpen)}
                        className="text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg"
                        title={isChatOpen ? "Close Chat" : "Open Chat"}
                    >
                        {isChatOpen ? <PanelLeftClose size={17} /> : <PanelLeft size={17} />}
                    </Button>

                    <div className="flex bg-white/5 border border-white/10 p-1 rounded-xl backdrop-blur-md">
                        <button
                            onClick={() => setActiveTab("preview")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === "preview"
                                ? "bg-primary text-white shadow-[0_0_20px_rgba(var(--primary),0.3)]"
                                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                                }`}
                        >
                            <Eye size={14} /> Preview
                        </button>
                        <button
                            onClick={() => setActiveTab("code")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === "code"
                                ? "bg-primary text-white shadow-[0_0_20px_rgba(var(--primary),0.3)]"
                                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                                }`}
                        >
                            <Code size={14} /> Code
                        </button>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground ml-auto pr-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse hidden md:block"></div>
                        <span className="hidden md:inline font-medium">Sandpack</span>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden bg-background relative flex">
                    {activeTab === "code" && (
                        <div className="w-64 flex-shrink-0 border-r border-white/5 bg-card/20 backdrop-blur-xl">
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
                                    <pre className="p-8 font-mono text-[13px] leading-relaxed text-foreground/90 bg-black/40 backdrop-blur-md h-full overflow-auto selection:bg-primary/30">
                                        <code>{code}</code>
                                    </pre>
                                )}
                            </div>
                        ) : (
                            <div className="h-full w-full relative" style={{ height: '100%' }}>
                                {((loading && messages[messages.length - 1]?.content.includes("<tool")) || Object.keys(virtualFiles).length === 0) && (
                                    <div className="absolute inset-0 z-50 bg-background/80 backdrop-blur-xl animate-in fade-in duration-700">
                                        <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center">
                                            <BuildSequence loading={loading} />
                                            {Object.keys(virtualFiles).length === 0 && !loading && (
                                                <p className="mt-4 text-sm text-muted-foreground animate-pulse">
                                                    Waiting for first file generation...
                                                </p>
                                            )}
                                        </div>
                                        {loading && (
                                            <motion.div 
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 max-w-sm rounded-2xl border border-primary/20 bg-primary/5 px-6 py-3 text-xs font-medium text-primary backdrop-blur-xl shadow-[0_0_30px_rgba(var(--primary),0.1)]"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Zap size={14} className="animate-pulse" />
                                                    {FUNNY_QUOTES[quoteIndex]}
                                                </div>
                                            </motion.div>
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
