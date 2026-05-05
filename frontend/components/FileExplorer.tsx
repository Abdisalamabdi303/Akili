"use client";

import { ChevronRight, ChevronDown, File, Folder, FolderOpen } from "lucide-react";
import { useState } from "react";

interface FileNode {
    name: string;
    type: "file" | "directory";
    path: string;
    children?: FileNode[];
}

interface FileExplorerProps {
    tree: FileNode[];
    onFileSelect: (path: string) => void;
    selectedFile: string | null;
}

export function FileExplorer({ tree, onFileSelect, selectedFile }: FileExplorerProps) {
    return (
        <div className="h-full bg-card/40 overflow-auto">
            <div className="p-3 border-b border-border/70 bg-card/30 backdrop-blur-sm">
                <h3 className="text-sm font-semibold text-foreground">Files</h3>
            </div>
            <div className="p-2">
                {tree.map((node) => (
                    <TreeNode
                        key={node.path}
                        node={node}
                        onFileSelect={onFileSelect}
                        selectedFile={selectedFile}
                        level={0}
                    />
                ))}
            </div>
        </div>
    );
}

interface TreeNodeProps {
    node: FileNode;
    onFileSelect: (path: string) => void;
    selectedFile: string | null;
    level: number;
}

function TreeNode({ node, onFileSelect, selectedFile, level }: TreeNodeProps) {
    const [isOpen, setIsOpen] = useState(true);
    const isSelected = selectedFile === node.path;

    if (node.type === "file") {
        return (
            <button
                onClick={() => onFileSelect(node.path)}
                className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-[13px] transition-all group ${isSelected 
                    ? "bg-primary/10 text-primary font-bold border border-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.1)]" 
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                    }`}
                style={{ paddingLeft: `${level * 12 + 10}px` }}
            >
                <File size={14} className={`flex-shrink-0 ${isSelected ? "text-primary" : "text-muted-foreground/60 group-hover:text-primary/70"}`} />
                <span className="truncate">{node.name}</span>
            </button>
        );
    }

    return (
        <div>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-[13px] font-bold text-foreground hover:bg-white/5 transition-all"
                style={{ paddingLeft: `${level * 12 + 10}px` }}
            >
                {isOpen ? (
                    <>
                        <ChevronDown size={14} className="flex-shrink-0" />
                        <FolderOpen size={14} className="flex-shrink-0 text-primary" />
                    </>
                ) : (
                    <>
                        <ChevronRight size={14} className="flex-shrink-0" />
                        <Folder size={14} className="flex-shrink-0 text-primary" />
                    </>
                )}
                <span className="truncate font-medium">{node.name}</span>
            </button>
            {isOpen && node.children && (
                <div>
                    {node.children.map((child) => (
                        <TreeNode
                            key={child.path}
                            node={child}
                            onFileSelect={onFileSelect}
                            selectedFile={selectedFile}
                            level={level + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
