import { createFile, readFile, updateFile, getFileTree, deleteFile } from "./files.js";
import { runCommand } from "./terminal.js";

export const tools = {
    createFile,
    readFile,
    updateFile,
    deleteFile,
    runCommand,
    getFileTree
};

export const toolDefinitions = [
    {
        name: "createFile",
        description: "Create a file in a project workspace",
        parameters: {
            type: "object",
            properties: {
                filePath: { type: "string" },
                content: { type: "string" },
            },
            required: ["filePath", "content"]
        }
    },
    {
        name: "readFile",
        description: "Read a file from a project",
        parameters: {
            type: "object",
            properties: {
                filePath: { type: "string" },
            },
            required: ["filePath"]
        }
    },
    {
        name: "updateFile",
        description: "Overwrite a file in a project",
        parameters: {
            type: "object",
            properties: {
                filePath: { type: "string" },
                content: { type: "string" },
            },
            required: ["filePath", "content"]
        }
    },
    {
        name: "runCommand",
        description: "Run a shell command in the project directory. Allowed: npm, node, ls, echo, cat",
        parameters: {
            type: "object",
            properties: {
                command: { type: "string" },
            },
            required: ["command"]
        }
    },
    {
        name: "deleteFile",
        description: "Delete a file or folder within the project directory. The agent can only delete files inside the project's own workspace.",
        parameters: {
            type: "object",
            properties: {
                filePath: { type: "string", description: "Relative path to the file or folder to delete" },
            },
            required: ["filePath"]
        }
    }
];
