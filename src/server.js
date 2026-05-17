import express from "express";
import cors from "cors";
import { pool } from './db.js';
import { inferQwen } from "./llm.js";
import { tools, toolDefinitions } from "./tools/index.js";
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

pool.connect()
    .then(client => {
        console.log("📌 Connected to PostgreSQL");
        client.release();
        warmModel(); // Pre-load model into VRAM immediately
    })
    .catch(err => console.error("❌ PostgreSQL connection error:", err));

// Pre-warm the model so first user request is instant (no 17s cold-start)
async function warmModel() {
    const jobEndpoint = process.env.JOB_ENDPOINT || "localhost";
    const llmModel = process.env.LLM_MODEL;
    if (!llmModel) return;
    console.log(`🔥 Pre-warming cloud model ${llmModel}...`);
    try {
        const res = await fetch(`http://${jobEndpoint}:11434/api/generate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: llmModel,
                prompt: "hi",
                keep_alive: "2h",   // Keep in VRAM for 2 hours
                stream: false,
                options: { num_predict: 1 }
            })
        });
        if (res.ok) {
            console.log(`✅ Model ${llmModel} is warm and ready!`);
        } else {
            console.warn(`⚠️ Model warm-up failed: ${res.status}`);
        }
    } catch (err) {
        console.warn("⚠️ Model warm-up error:", err.message);
    }
}

function buildFallbackTitle(prompt) {
    const cleaned = (prompt || "")
        .replace(/\s+/g, " ")
        .replace(/[^\w\s-]/g, "")
        .trim();
    if (!cleaned) return "Untitled Project";
    const words = cleaned.split(" ").slice(0, 5);
    return words
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
}

function sanitizeTitle(rawTitle, fallbackTitle) {
    let cleanTitle = (rawTitle || "").replace(/<think>[\s\S]*?<\/think>/gi, "");
    
    const candidate = cleanTitle
        .replace(/^["'`]+|["'`]+$/g, "")
        .replace(/\s+/g, " ")
        .trim();

    if (!candidate) return fallbackTitle;
    return candidate.length > 60 ? `${candidate.slice(0, 57)}...` : candidate;
}

async function generateProjectTitle(userPrompt, assistantResponse) {
    const fallbackTitle = buildFallbackTitle(userPrompt);
    const jobEndpoint = process.env.JOB_ENDPOINT || "localhost";
    const llmModel = process.env.LLM_MODEL || "qwen3-coder-next:cloud";

    const prompt = `Generate a short, relevant project title (2-6 words) for this app request.
Return ONLY the title text. No quotes, no markdown, no punctuation-heavy formatting.

User request:
${userPrompt}

Assistant output summary:
${(assistantResponse || "").slice(0, 1200)}`;

    try {
        const response = await fetch(`http://${jobEndpoint}:11434/api/generate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: llmModel,
                prompt,
                stream: false,
                keep_alive: "30m",
                options: {
                    num_predict: 24,
                    temperature: 0.2
                }
            })
        });

        if (!response.ok) {
            console.warn(`⚠️ Title generation failed: ${response.status}`);
            return fallbackTitle;
        }

        const data = await response.json();
        return sanitizeTitle(data.response, fallbackTitle);
    } catch (err) {
        console.warn("⚠️ Title generation error:", err.message);
        return fallbackTitle;
    }
}


const app = express();
app.use(cors());
app.use(express.json());

const SYSTEM_PROMPT = `You are Akili, an elite, world-class Senior Product Architect and Lead UI/UX Engineer. Your mission is to build production-grade web applications that are stunning, accessible, and logically flawless.

## THE THINKING PHASE (MANDATORY)
Before writing any code or tool calls, you MUST wrap your initial reasoning in a <thinking> block. In this block:
1. **Analyze Requirements**: Deconstruct the user's request.
2. **Architectural Plan**: Decide on state management, UI components, and data flow.
3. **Design System**: Choose a cohesive color palette with high contrast. Explicitly plan background and text color pairs to ensure readability.
4. **Edge Cases**: Identify potential JS bugs or layout issues on mobile.

## ENGINEERING STANDARDS
- **Modern JavaScript**: Use ES6+ features. Avoid spaghetti code. Use modular, clean functions.
- **State Management**: If the app is complex, implement a clear state-driven rendering logic.
- **Accessibility (A11y)**: Use semantic HTML (<main>, <section>, <nav>). Ensure buttons have visible focus states.
- **Design Harmony**: Use DaisyUI and Tailwind CSS to create "premium" feeling interfaces. Avoid "generic" looks. Use gradients, shadows, and consistent spacing.
- **Color Contrast**: NEVER use similar brightness for text and background. (e.g., Use text-slate-900 on bg-slate-100, or text-white on bg-slate-900).

## TECHNOLOGY STACK
- **Core**: HTML5 + Vanilla JS (ES6) + Tailwind CSS + DaisyUI.
- **Icons**: Lucide-icons.
- **Images**: Pollinations.ai (Use descriptive prompts, hyphens for spaces).
- **Rule**: NO frameworks (React/Vue). Pure Vanilla JS only.
- **JS Execution**: ALL logic and data (like arrays/constants) MUST go in `script.js`. You MUST link it in `index.html` using `<script src="script.js" defer></script>` inside the `<head>` section.
- **Rule**: NEVER use `<script>` tags in `index.html` unless they have a `src` attribute (e.g., for external CDNs or your own `script.js`).
- **Sandpack Constraint**: NEVER use `window.onload` or `document.addEventListener("DOMContentLoaded")`. These events already fired. Write your code to execute immediately.

## FILE OUTPUT FORMAT
Output each file using this EXACT XML format. 

\`\`\`
<tool name="createFile">
    <filePath>filename.ext</filePath>
    <content>
FULL_FILE_CONTENT
    </content>
</tool>
\`\`\`

## CRITICAL WORKFLOW RULES
1. **Plan First**: Always provide your <thinking> block first.
2. **Incremental Fixes**: If the user asks for a fix (e.g., "button doesn't work"), DO NOT recreate the entire project. ONLY update the specific file and specific lines that are broken. Use updateFile for this.
3. **Read Before Edit**: If modifying existing code, you MUST use readFile first to understand the current state.
4. **Atomic Updates**: Only update files that need changes. 
5. **Pure Content**: The <content> tag MUST contain ONLY the source code. DO NOT include summaries, markdown, or chat text inside the <content> tag.
6. **Post-Tool Summary**: Provide your brief plain-text summary ONLY after all tool calls are closed (after the final </tool>).
Available Tools:
${JSON.stringify(toolDefinitions, null, 2)} `;

async function executeToolCall(toolCall) {
    const { name, args } = toolCall;
    const tool = tools[name];
    if (!tool) return { success: false, error: { message: `Tool '${name}' not found`, tool: name, args: args } };
    console.log(`🛠️ Executing tool: ${name}`);
    try {
        let result;
        if (name === 'createFile' || name === 'updateFile') {
            result = tool(args.projectId, args.filePath, args.content || '');
        } else if (name === 'readFile') {
            result = tool(args.projectId, args.filePath);
        } else if (name === 'runCommand') {
            result = await tool(args.projectId, args.command);
        } else if (name === 'deleteFile') {
            result = await tool(args.projectId, args.filePath);
        } else if (name === 'pushToGitHub') {
            result = await tool(args.projectId, args.commitMessage);
        } else {
            return { success: false, error: { message: "Unknown tool signature", tool: name, args: args } };
        }
        // Ensure all tool results have a success property
        if (result && typeof result === 'object' && 'success' in result) {
            return result;
        } else if (result && typeof result === 'object' && 'error' in result) {
            return { success: false, error: { message: result.error, tool: name, args: args } };
        }
        return { success: true, output: result }; // Default success if tool returns something else
    } catch (err) {
        return { success: false, error: { message: err.message, tool: name, args: args } };
    }
}

// Strip <thinking> blocks that may have leaked into generated file content
function sanitizeContent(content) {
    if (!content) return content;
    // Remove complete <thinking>...</thinking> blocks
    let cleaned = content.replace(/<thinking>[\s\S]*?<\/thinking>/gi, '');
    // Remove any dangling open <thinking> block (mid-stream leak)
    cleaned = cleaned.replace(/<thinking>[\s\S]*$/gi, '');
    return cleaned;
}

function parseToolCalls(text) {
    const regex = /<tool name="(\w+)">([\s\S]*?)(?:<\/tool>|<tool|$)/g;
    const found = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
        const [, name, content] = match;
        const isTruncated = !text.includes(`</tool>`, match.index);
        
        const args = {};
        const paramRegex = /<(\w+)>([\s\S]*?)<\/\1>/g;
        let paramMatch;
        while ((paramMatch = paramRegex.exec(content)) !== null) {
            args[paramMatch[1]] = paramMatch[2].trim();
        }

        // If content is truncated, the closing </content> might be missing
        if (isTruncated && args.content === undefined) {
             const partialContentMatch = /<content>([\s\S]*)$/.exec(content);
             if (partialContentMatch) args.content = partialContentMatch[1];
        }

        if (name === 'createFile' && args.content === undefined) {
            args.content = "";
        }
        // Sanitize file content — strip any leaked <thinking> blocks
        if ((name === 'createFile' || name === 'updateFile') && args.content) {
            args.content = sanitizeContent(args.content);
        }
        // Tool Validation & Auto-Correction for missing extensions
        if ((name === 'createFile' || name === 'updateFile') && args.filePath) {
            const fileName = args.filePath.split('/').pop();
            // Assign .js extension dynamically if no extension found and not package.json
            if (fileName && !fileName.includes('.')) {
                args.filePath += '.js';
            }
        }
        found.push({ name, args, isTruncated });
    }
    return found;
}

function validateIndexHtmlQuality(content) {
    const issues = [];
    const html = content || "";

    // Only flag genuinely bad placeholder copy
    if (/\b(lorem ipsum|sample text|product description goes here)\b/i.test(html)) {
        issues.push("Generic placeholder copy detected. Use realistic, domain-specific content.");
    }

    // Flag invalid DaisyUI surface tokens
    if (/\bbg-base-(800|900)\b/i.test(html)) {
        issues.push("Invalid DaisyUI class `bg-base-800/900` detected. Use `bg-base-100`, `bg-base-200`, or Tailwind slate/zinc classes.");
    }

    // Flag inline JS in HTML (must go in script.js)
    const scriptMatches = html.matchAll(/<script(?![^>]*src)[^>]*>([\s\S]*?)<\/script>/gi);
    for (const match of scriptMatches) {
        if (match[1] && match[1].trim().length > 20) {
            issues.push("Inline JS detected in index.html. Move all logic to script.js.");
            break;
        }
    }

    return issues;
}

// --- Endpoints ---

app.post("/api/project", async (req, res) => {
    const { name, prompt, content } = req.body;
    try {
        const result = await pool.query(
            "INSERT INTO projects (name, prompt, content) VALUES ($1, $2, $3) RETURNING *",
            [name, prompt, content]
        );
        res.json({ success: true, project: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false });
    }
});

app.get("/api/projects/:id/files", async (req, res) => {
    try {
        const { id } = req.params;
        const result = tools.getFileTree(id);
        if (result.error) {
            if (result.error === "Project not found") return res.json({ success: true, tree: [] });
            return res.status(404).json({ error: result.error });
        }
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch file tree" });
    }
});

app.get(/^\/api\/projects\/([^/]+)\/files\/(.*)$/, async (req, res) => {
    try {
        const result = tools.readFile(req.params[0], req.params[1]);
        if (result.error) return res.status(404).json({ error: result.error });
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: "Failed to read file" });
    }
});

app.post("/api/chats", async (req, res) => {
    try {
        const result = await pool.query("INSERT INTO chats (title) VALUES ($1) RETURNING *", ["New Chat"]);
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ success: false });
    }
});

app.get("/api/chats", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM chats ORDER BY created_at DESC");
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ success: false });
    }
});

app.get("/api/chats/:id/info", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query("SELECT * FROM chats WHERE id = $1", [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: "Chat not found" });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ success: false });
    }
});

app.get("/api/chats/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query("SELECT * FROM messages WHERE chat_id = $1 ORDER BY created_at ASC", [id]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ success: false });
    }
});

app.delete("/api/chats/:chatId/messages/after/:messageId", async (req, res) => {
    try {
        const { chatId, messageId } = req.params;
        const targetResult = await pool.query("SELECT created_at FROM messages WHERE id = $1 AND chat_id = $2", [messageId, chatId]);

        if (targetResult.rows.length === 0) {
            return res.status(404).json({ error: "Message not found" });
        }

        // Truncate everything at or after the target timestamp (because we are rewriting it)
        const timestamp = targetResult.rows[0].created_at;
        await pool.query("DELETE FROM messages WHERE chat_id = $1 AND created_at >= $2", [chatId, timestamp]);

        res.json({ success: true });
    } catch (err) {
        console.error("Delete messages error:", err);
        res.status(500).json({ success: false });
    }
});

app.post("/api/chats/:id/messages", async (req, res) => {
    const { id } = req.params;
    const { prompt } = req.body;

    console.log(`📩 Received message for chat ${id}: "${prompt.slice(0, 50)}..."`);

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    
    try {
        if (typeof res.flushHeaders === 'function') {
            res.flushHeaders();
        } else if (typeof res.flush === 'function') {
            res.flush();
        }

        await pool.query("INSERT INTO messages (chat_id, role, content) VALUES ($1, $2, $3)", [id, 'user', prompt]);

        const countRes = await pool.query("SELECT COUNT(*) FROM messages WHERE chat_id = $1", [id]);
        const isFirstUserMessage = parseInt(countRes.rows[0].count) === 1;

        // NEW: Clear project directory if this is a brand new chat to prevent ID collisions from old runs
        if (isFirstUserMessage) {
            console.log(`🧹 New chat detected (ID: ${id}). Clearing project directory...`);
            const projectRoot = path.join(process.cwd(), "projects", id.toString());
            if (fs.existsSync(projectRoot)) {
                fs.rmSync(projectRoot, { recursive: true, force: true });
            }
        }

        let loopCount = 0;
        const MAX_LOOPS = 5;
        let qualityGateFailures = 0;
        const MAX_QUALITY_GATE_FAILURES = 2;

        while (loopCount < MAX_LOOPS) {
            loopCount++;

            const history = await pool.query("SELECT role, content FROM messages WHERE chat_id = $1 ORDER BY created_at ASC", [id]);
            const systemPrompt = SYSTEM_PROMPT;

            // Extract the workspace context (files already created)
            const fileTreeResult = tools.getFileTree(id);
            let workspaceContext = `[System Data: Project Context ID: ${id}]\n[System Data: Current files in workspace:\n`;
            if (!fileTreeResult.error && fileTreeResult.tree) {
                const extractPaths = (nodes, basePath = "") => {
                    let paths = [];
                    nodes.forEach(node => {
                        const fullPath = basePath ? `${basePath}/${node.name}` : node.name;
                        if (node.type === "file") paths.push(fullPath);
                        else if (node.children) paths = paths.concat(extractPaths(node.children, fullPath));
                    });
                    return paths;
                };
                const paths = extractPaths(fileTreeResult.tree);
                if (paths.length > 0) {
                    for (const p of paths) {
                        const fileData = tools.readFile(id, p);
                        if (!fileData.error) {
                            workspaceContext += `\n=== ${p} ===\n\`\`\`\n${fileData.content}\n\`\`\`\n`;
                        } else {
                            workspaceContext += `${p} (Error reading file)\n`;
                        }
                    }
                } else {
                    workspaceContext += "None\n";
                }
            } else {
                workspaceContext += "None\n";
            }
            workspaceContext += "]\n\n";

            // Build flat prompt string for /api/generate (more reliable than /api/chat)
            let fullPrompt = workspaceContext;

            // Context Truncation to optimize Time-To-First-Token (TTFT)
            const recentMessages = history.rows.slice(-6);
            if (history.rows.length > 6) {
                fullPrompt += `[SYSTEM: Older chat history truncated. Original project requirement:]\nUser: ${history.rows[0].content}\n\n`;
            }

            recentMessages.forEach(msg => {
                let strippedContent = msg.content;
                // Drastically reduce Token Payload by stripping old code file outputs
                if (msg.role === 'assistant') {
                    strippedContent = strippedContent.replace(/<content>[\s\S]*?<\/content>/g, "<content>... [omitted] ...</content>");
                }
                fullPrompt += `### ${msg.role === 'user' ? 'User' : 'Assistant'}:\n${strippedContent}\n\n`;
            });
            fullPrompt += "### Assistant:\n";

            const jobEndpoint = process.env.JOB_ENDPOINT || "127.0.0.1";
            const llmModel = process.env.LLM_MODEL || "qwen3-coder-next:cloud";

            console.log(`🤖 [Loop ${loopCount}] Autonomous Product Manager Phase, model: ${llmModel}`);

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 600000); // 10 minute timeout for code gen

            const response = await fetch(`http://${jobEndpoint}:11434/api/generate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: llmModel,
                    prompt: fullPrompt,
                    system: systemPrompt,
                    context: [],
                    stream: true,
                    keep_alive: "30m",
                    options: {
                        num_predict: 8192,
                        temperature: 0.1,
                        stop: ["### User:", "### Assistant:"]
                    }
                }),
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`LLM API Error (${response.status}): ${errorText}`);
            }

            console.log("📡 LLM Response received, starting stream...");
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let accumulatedResponse = "";
            let buffer = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) {
                    console.log("🏁 Stream finished.");
                    break;
                }
                // console.log(`📦 Received chunk (${value.length} bytes)`);

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    if (!line.trim()) continue;
                    try {
                        const json = JSON.parse(line);
                        if (json.response) {
                            res.write(json.response);
                            accumulatedResponse += json.response;
                        }
                    } catch (e) { }
                }
            }

            await pool.query("INSERT INTO messages (chat_id, role, content) VALUES ($1, $2, $3)", [id, 'assistant', accumulatedResponse]);

            if (isFirstUserMessage && loopCount === 1) {
                const generatedTitle = await generateProjectTitle(prompt, accumulatedResponse);
                await pool.query("UPDATE chats SET title = $1 WHERE id = $2", [generatedTitle, id]);
            }

            const toolCalls = parseToolCalls(accumulatedResponse);
            if (toolCalls.length > 0) {
                // Quality gate: only run on createFile/updateFile for index.html
                const qualityIssues = [];
                toolCalls.forEach((toolCall) => {
                    if ((toolCall.name === "createFile" || toolCall.name === "updateFile") && toolCall.args?.filePath) {
                        const normalizedPath = toolCall.args.filePath.replace(/^\/+/, "");
                        if (normalizedPath.toLowerCase() === "index.html") {
                            const issues = validateIndexHtmlQuality(toolCall.args.content || "");
                            qualityIssues.push(...issues);
                        }
                    }
                });

                if (qualityIssues.length > 0 && qualityGateFailures < MAX_QUALITY_GATE_FAILURES) {
                    const uniqueIssues = [...new Set(qualityIssues)];
                    qualityGateFailures += 1;
                    console.warn(`⚠️ Quality gate failure #${qualityGateFailures} for chat ${id}:`, uniqueIssues);
                    const feedback = `[SYSTEM: Quality Gate Failed]
Your index.html has issues that must be fixed:
${uniqueIssues.map(issue => `- ${issue}`).join("\n")}

Fix the listed issues and any other inconsistencies caused by the fix. Output the corrected files using createFile or updateFile.
Do NOT add explanation outside the tool tags.`;
                    await pool.query("INSERT INTO messages (chat_id, role, content) VALUES ($1, $2, $3)", [id, "user", feedback]);
                    continue;
                }

                // Execute all tool calls
                let allSucceeded = true;
                let allResults = "";
                for (const toolCall of toolCalls) {
                    toolCall.args.projectId = id;
                    const result = await executeToolCall(toolCall);
                    
                    if (result.success) {
                        const outputStr = typeof result.output === 'object' ? JSON.stringify(result.output, null, 2) : String(result.output || 'success ✓');
                        allResults += `[TOOL_RESULT: ${toolCall.name} (${toolCall.args.filePath || toolCall.args.command || ''})]\n${outputStr}\n\n`;
                    } else {
                        allResults += `[TOOL_ERROR: ${toolCall.name}]\n${JSON.stringify(result.error)}\n\n`;
                        allSucceeded = false;
                    }
                }

                console.log(`🗂️ Tool results:\n${allResults}`);

                // Check if the model has created all expected files (index.html + script.js)
                // We check the chat history for tool calls to ensure they were created IN THIS CHAT
                const sessionHistory = await pool.query("SELECT content FROM messages WHERE chat_id = $1 AND role = 'assistant'", [id]);
                const allAssistantContent = sessionHistory.rows.map(r => r.content).join("\n");
                
                const hasIndex = allAssistantContent.includes('<filePath>index.html</filePath>');
                const hasScript = allAssistantContent.includes('<filePath>script.js</filePath>');

                if (allSucceeded && hasIndex && hasScript) {
                    const anyTruncated = toolCalls.some(tc => tc.isTruncated);
                    if (anyTruncated) {
                        console.log(`⚠️ Files were truncated. Asking model to continue...`);
                        await pool.query(
                            "INSERT INTO messages (chat_id, role, content) VALUES ($1, $2, $3)",
                            [id, 'user', '[SYSTEM: Your last output was truncated due to length. Please continue from where you left off. Specifically, ensure the files are properly closed and any missing logic is provided. If index.html was incomplete, provide the full version again but keep it more concise if possible.]']
                        );
                        continue;
                    }

                    // All required files are in place — signal completion and break
                    console.log(`✅ All files created for chat ${id} in this session. Stopping loop.`);
                    await pool.query(
                        "INSERT INTO messages (chat_id, role, content) VALUES ($1, $2, $3)",
                        [id, 'user', '[SYSTEM: All files saved successfully. Your task is complete. Do not create any more files. IMPORTANT: You now have the ability to push this code to GitHub for the user. Mention this to the user and ask if they want you to push it. If they say yes, use the pushToGitHub tool. Your GitHub username is abdisalamabdi303. Write a brief plain-text summary of what you built and offer the GitHub push.]']
                    );
                    // Do one final loop to get the summary message from the model, then break
                    const finalResponse = await (async () => {
                        const finalHistory = await pool.query("SELECT role, content FROM messages WHERE chat_id = $1 ORDER BY created_at ASC", [id]);
                        let finalPrompt = "";
                        finalHistory.rows.forEach(msg => {
                            // Filter out tool results and system messages for the summary phase
                            if (msg.role === 'user' && (msg.content.startsWith('[TOOL_RESULT') || msg.content.startsWith('[SYSTEM:'))) {
                                return;
                            }
                            let c = msg.content;
                            if (msg.role === 'assistant') c = c.replace(/<content>[\s\S]*?<\/content>/g, '<content>... [omitted] ...</content>');
                            finalPrompt += `### ${msg.role === 'user' ? 'User' : 'Assistant'}:\n${c}\n\n`;
                        });
                        finalPrompt += "### Assistant:\n";
                        const fr = await fetch(`http://${process.env.JOB_ENDPOINT || 'localhost'}:11434/api/generate`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                model: process.env.LLM_MODEL,
                                prompt: finalPrompt,
                                system: SYSTEM_PROMPT,
                                stream: true,
                                keep_alive: "30m",
                                options: { 
                                    num_predict: 512, 
                                    temperature: 0.3,
                                    stop: ["### User:", "### Assistant:"]
                                }
                            })
                        });
                        if (!fr.ok) return '';
                        const reader2 = fr.body.getReader();
                        const decoder2 = new TextDecoder();
                        let summary = ''; let buf2 = '';
                        while (true) {
                            const { done, value } = await reader2.read();
                            if (done) break;
                            buf2 += decoder2.decode(value, { stream: true });
                            const lines2 = buf2.split('\n');
                            buf2 = lines2.pop() || '';
                            for (const line of lines2) {
                                if (!line.trim()) continue;
                                try { const j = JSON.parse(line); if (j.response) { res.write(j.response); summary += j.response; } } catch (e) { }
                            }
                        }
                        return summary;
                    })();
                    if (finalResponse) {
                        await pool.query("INSERT INTO messages (chat_id, role, content) VALUES ($1, $2, $3)", [id, 'assistant', finalResponse]);
                    }
                    break;
                }

                // Files not complete yet — feed tool results back and continue
                await pool.query("INSERT INTO messages (chat_id, role, content) VALUES ($1, $2, $3)", [id, 'user', allResults]);
                continue;
            }

            break;
        }

        res.end();
    } catch (err) {
        console.error("❌ CRITICAL LLM Handler Error:", err);
        if (!res.headersSent) {
            res.status(500).json({ error: err.message, stack: err.stack });
        } else {
            res.end();
        }
    }
});

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
    console.log(`Orchestrator running on port ${PORT}`);
});

