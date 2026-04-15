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
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm hover:bg-muted/50 transition-colors ${isSelected ? "bg-primary/15 text-primary font-medium border border-primary/30" : "text-foreground"
                    }`}
                style={{ paddingLeft: `${level * 12 + 8}px` }}
            >
                <File size={14} className="flex-shrink-0" />
                <span className="truncate">{node.name}</span>
            </button>
        );
    }

    return (
        <div>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm hover:bg-muted/50 transition-colors text-foreground"
                style={{ paddingLeft: `${level * 12 + 8}px` }}
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
