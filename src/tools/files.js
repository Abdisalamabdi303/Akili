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
