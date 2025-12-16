import { createFile, readFile, updateFile } from "./files.js";

export const tools = {
    createFile,
    readFile,
    updateFile,
};

export const toolDefinitions = [
    {
        name: "createFile",
        description: "Create a file in a project workspace",
        parameters: {
            type: "object",
            properties: {
                projectId: { type: "string" },
                filePath: { type: "string" },
                content: { type: "string" },
            },
            required: ["projectId", "filePath", "content"]
        }
    },
    {
        name: "readFile",
        description: "Read a file from a project",
        parameters: {
            type: "object",
            properties: {
                projectId: { type: "string" },
                filePath: { type: "string" },
            },
            required: ["projectId", "filePath"]
        }
    },
    {
        name: "updateFile",
        description: "Overwrite a file in a project",
        parameters: {
            type: "object",
            properties: {
                projectId: { type: "string" },
                filePath: { type: "string" },
                content: { type: "string" },
            },
            required: ["projectId", "filePath", "content"]
        }
    }
];
