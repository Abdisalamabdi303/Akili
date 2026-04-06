import fs from "fs";
import path from "path";

const BASE_DIR = path.join(process.cwd(), "projects");

// Make sure the folder exists
if (!fs.existsSync(BASE_DIR)) {
    fs.mkdirSync(BASE_DIR, { recursive: true });
}

export function createFile(projectId, filePath, content) {
    const projectRoot = path.join(BASE_DIR, projectId);
    const fullPath = path.join(projectRoot, filePath);

    // Ensure folder exists
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });

    fs.writeFileSync(fullPath, content, "utf8");

    return { success: true, filePath };
}

export function readFile(projectId, filePath) {
    const projectRoot = path.join(BASE_DIR, projectId);
    const fullPath = path.join(projectRoot, filePath);

    if (!fs.existsSync(fullPath)) {
        return { error: "File not found" };
    }

    const content = fs.readFileSync(fullPath, "utf8");
    return { success: true, content };
}

export function updateFile(projectId, filePath, content) {
    return createFile(projectId, filePath, content);
}

// NEW: Get file tree structure
export function getFileTree(projectId) {
    const projectRoot = path.join(BASE_DIR, projectId);

    if (!fs.existsSync(projectRoot)) {
        return { error: "Project not found" };
    }

    function buildTree(dir, basePath = "") {
        const items = fs.readdirSync(dir, { withFileTypes: true });

        return items
            .filter(item => !item.name.startsWith('.')) // Skip hidden files
            .map(item => {
                const itemPath = path.join(basePath, item.name);
                const fullPath = path.join(dir, item.name);

                if (item.isDirectory()) {
                    return {
                        name: item.name,
                        type: "directory",
                        path: itemPath,
                        children: buildTree(fullPath, itemPath)
                    };
                } else {
                    return {
                        name: item.name,
                        type: "file",
                        path: itemPath
                    };
                }
            })
            .sort((a, b) => {
                // Directories first, then alphabetical
                if (a.type !== b.type) {
                    return a.type === "directory" ? -1 : 1;
                }
                return a.name.localeCompare(b.name);
            });
    }

    try {
        const tree = buildTree(projectRoot);
        return { success: true, tree };
    } catch (error) {
        return { error: error.message };
    }
}

export function deleteFile(projectId, filePath) {
    const projectRoot = path.resolve(BASE_DIR, projectId);
    const fullPath = path.resolve(projectRoot, filePath);

    // Permission check: ensure the target is inside the project directory
    if (!fullPath.startsWith(projectRoot + path.sep)) {
        return { error: "Permission denied: path is outside the project directory" };
    }

    if (!fs.existsSync(fullPath)) {
        return { error: "File not found" };
    }

    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
        fs.rmSync(fullPath, { recursive: true });
    } else {
        fs.unlinkSync(fullPath);
    }

    return { success: true, deleted: filePath };
}
