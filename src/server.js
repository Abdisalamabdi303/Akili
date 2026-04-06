import express from "express";
import cors from "cors";
import { pool } from './db.js';
import { inferQwen } from "./llm.js";
import { tools, toolDefinitions } from "./tools/index.js";
import dotenv from 'dotenv';

dotenv.config();

// Test database connection
pool.connect()
    .then(client => {
        console.log("📌 Connected to PostgreSQL");
        client.release();
    })
    .catch(err => console.error("❌ PostgreSQL connection error:", err));

const app = express();
app.use(cors());
app.use(express.json());

// --- Helper Functions ---

const SYSTEM_PROMPT = `
You are Akili, an expert AI software engineer built by Abdisalan Abdi Shakul. You are consistent, logical, and fast.

**Identity & Constraints:**
- Name: Akili
- Role: Web Developer (Expert in HTML, TailwindCSS, Vanilla JS)
- Style: Professional, concise, and agentic.

**CRITICAL WORKFLOW (2 PHASES):**
You MUST follow this 2-Phase workflow for every new project idea:

**[PHASE 1: CLARIFICATION]**
When the user gives an initial project idea:
1. Do NOT write any code yet. Do not use the createFile tool.
2. Ask exactly 3 short, specific clarifying questions to gather necessary details (e.g., color scheme, specific features, layout).
3. Wait for the user to answer.

**[PHASE 2: IMPLEMENTATION]**
Once the user answers your questions:
1. Generate standard HTML, Vanilla JS, and Tailwind CSS for the fastest live preview (unless explicitly told otherwise).
2. Use the \`createFile\` tool to generate the implementation file by file.

**Capabilities:**
You can and SHOULD use tools to perform actions. When you need to read a file, create a file, or run a command, you MUST output a tool call in the specific XML format below.

**Tool Usage Syntax:**
To use a tool, output a single XML block like this:
<tool name="createFile">
    <filePath>index.html</filePath>
    <content>
        <!DOCTYPE html>
        ...
    </content>
</tool>

**Available Tools:**
\${JSON.stringify(toolDefinitions, null, 2)}

**Rules:**
1. Only use the tools provided.
2. When you use a tool, stop generating immediately after the closing </tool> tag. The system will execute the tool and give you the result.
3. After receiving a tool result, analyze it and decide the next step (e.g., did the command fail? do I need to fix code?).
4. Do not hallucinate file contents. Always use 'readFile' to check before editing.
5. Provide a final response to the user after your tasks are complete.
`;

async function executeToolCall(toolCall) {
    const { name, args } = toolCall;
    const tool = tools[name];
    if (!tool) {
        return { error: `Tool '${name}' not found` };
    }
    console.log(`🛠️ Executing tool: ${name}`, args);
    try {
        // Map XML args to function arguments
        // 'createFile' -> (projectId, filePath, content)
        // 'readFile' -> (projectId, filePath)
        // 'updateFile' -> (projectId, filePath, content)
        // 'runCommand' -> (projectId, command)

        // We assume args is an object { projectId: "...", ... }
        // We unpack based on tool signature. 
        // For simplicity in this factory, our tools take specific args. 
        // We can refactor tools to take a single object, but for now we map manually or wrapped.

        // Actually, looking at src/tools/files.js, they take (projectId, filePath, content).
        // runCommand takes (projectId, command).

        if (name === 'createFile' || name === 'updateFile') {
            return tool(args.projectId, args.filePath, args.content);
        } else if (name === 'readFile') {
            return tool(args.projectId, args.filePath);
        } else if (name === 'runCommand') {
            return await tool(args.projectId, args.command);
        }

        return { error: "Unknown tool signature" };
    } catch (err) {
        return { error: err.message };
    }
}

function parseToolCalls(text) {
    const regex = /<tool name="(\w+)">([\s\S]*?)<\/tool>/g;
    const tools = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
        const [fullTag, name, content] = match;
        const args = {};

        // Simple XML-like parser for params: <key>value</key>
        const paramRegex = /<(\w+)>([\s\S]*?)<\/\1>/g;
        let paramMatch;
        while ((paramMatch = paramRegex.exec(content)) !== null) {
            args[paramMatch[1]] = paramMatch[2].trim();
        }
        tools.push({ name, args, fullTag });
    }

    return tools;
}

// --- Endpoints ---

app.post('/api/ask', async (req, res) => {
    try {
        const { prompt } = req.body;
        const llmResponse = await inferQwen(prompt);
        await pool.query(
            'INSERT INTO projects (name, prompt, content) VALUES ($1, $2, $3)',
            ['Untitled Project', prompt, llmResponse]
        );
        res.json({ result: llmResponse });
    } catch (err) {
        console.error(err);
        res.json({ result: "Failed to process" });
    }
});

app.post("/api/project", async (req, res) => {
    const { name, prompt, content } = req.body;
    try {
        const result = await pool.query(
            "INSERT INTO projects (name, prompt, content) VALUES ($1, $2, $3) RETURNING *",
            [name, prompt, content]
        );
        res.json({ success: true, project: result.rows[0] });
    } catch (err) {
        console.error("DB Insert Error:", err);
        res.status(500).json({ success: false });
    }
});

// Get file tree for a project
app.get("/api/projects/:id/files", async (req, res) => {
    try {
        const { id } = req.params;
        const result = tools.getFileTree(id);

        if (result.error) {
            if (result.error === "Project not found") {
                return res.json({ success: true, tree: [] });
            }
            return res.status(404).json({ error: result.error });
        }

        res.json(result);
    } catch (err) {
        console.error("File Tree Error:", err);
        res.status(500).json({ error: "Failed to fetch file tree" });
    }
});

// Get file content for a project
app.get(/^\/api\/projects\/([^/]+)\/files\/(.*)$/, async (req, res) => {
    try {
        const id = req.params[0];
        const filePath = req.params[1]; // Everything after /files/

        const result = tools.readFile(id, filePath);

        if (result.error) {
            return res.status(404).json({ error: result.error });
        }

        res.json(result);
    } catch (err) {
        console.error("Read File Error:", err);
        res.status(500).json({ error: "Failed to read file" });
    }
});

app.get("/api/projects", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM projects ORDER BY created_at DESC");
        res.json(result.rows);
    } catch (err) {
        console.error("DB Fetch Error:", err);
        res.status(500).json({ success: false });
    }
});

app.post("/api/chats", async (req, res) => {
    try {
        const result = await pool.query("INSERT INTO chats (title) VALUES ($1) RETURNING *", ["New Chat"]);
        res.json(result.rows[0]);
    } catch (err) {
        console.error("Create Chat Error:", err);
        res.status(500).json({ success: false });
    }
});

app.get("/api/chats", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM chats ORDER BY created_at DESC");
        res.json(result.rows);
    } catch (err) {
        console.error("Fetch Chats Error:", err);
        res.status(500).json({ success: false });
    }
});

app.get("/api/chats/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query("SELECT * FROM messages WHERE chat_id = $1 ORDER BY created_at ASC", [id]);
        res.json(result.rows);
    } catch (err) {
        console.error("Fetch Messages Error:", err);
        res.status(500).json({ success: false });
    }
});

app.post("/api/chats/:id/messages", async (req, res) => {
    const { id } = req.params;
    const { prompt } = req.body;

    // Set headers for streaming
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.flushHeaders();

    try {
        // 1. Save User Message
        await pool.query("INSERT INTO messages (chat_id, role, content) VALUES ($1, $2, $3)", [id, 'user', prompt]);

        // 2. Check/Update Title
        const messageCount = await pool.query("SELECT COUNT(*) FROM messages WHERE chat_id = $1", [id]);
        if (parseInt(messageCount.rows[0].count) === 1) {
            const title = prompt.length > 50 ? prompt.substring(0, 50) + "..." : prompt;
            await pool.query("UPDATE chats SET title = $1 WHERE id = $2", [title, id]);
        }

        // --- AGENT LOOP ---
        let currentPrompt = prompt; // The message to send to LLM (usually the user's prompt initially)
        let loopCount = 0;
        const MAX_LOOPS = 5;
        let finalResponseAccumulator = ""; // Track what we've sent to the user (actually we stream, so we just append to DB at the end? specific roles?)

        // We need to keep track of the *entire* assistant response for the DB.
        // Since we might have multiple turns (Assitant: <tool>, System: Result, Assistant: Text),
        // we should probably store them as separate messages or one big one?
        // Standard practice: Store each turn.
        // So step 1: LLM generates tool call -> Save as Assistant Message.
        // Step 2: System executes -> Save as System Message (or User message "Tool Output").
        // Step 3: LLM generates final answer -> Save as Assistant Message.

        // NOTE: The current UI might expect a single assistant reply per user reply?
        // If so, we might need to be careful. But let's assume it renders a list of messages.
        // If we stream, the UI likely appends to the *last* message bubble.
        // If we create multiple DB entries, the UI might flicker or show multiple bubbles.
        // Hack: We can just let the stream continue and insert *one* megapack of messages into the DB? No, that loses structure.
        // Let's insert multiple messages. The UI should handle it (by fetching or just appending the stream).
        // Actually, the UI usually just listens to the stream for the *current* generation.
        // If we do multiple turns, the stream contains all of them.

        while (loopCount < MAX_LOOPS) {
            loopCount++;

            // Fetch History (refreshed each turn)
            const history = await pool.query("SELECT role, content FROM messages WHERE chat_id = $1 ORDER BY created_at ASC", [id]);

            let fullPrompt = "";
            history.rows.forEach(msg => {
                fullPrompt += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
            });
            // Note: The 'currentPrompt' is already in history (inserted at start of handler).
            // For subsequent loops, the previous assistant/tool outputs should be in history too.
            fullPrompt += `Assistant:`;

            // Call LLM
            const jobEndpoint = process.env.JOB_ENDPOINT || "localhost";
            const llmModel = process.env.LLM_MODEL || "gemma4:e2b";
            const response = await fetch(`http://${jobEndpoint}:11434/api/generate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: llmModel,
                    prompt: fullPrompt,
                    system: SYSTEM_PROMPT,
                    stream: true
                })
            });

            if (!response.ok) throw new Error("LLM API Error");

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let accumulatedResponse = "";
            let buffer = "";

            // Stream Loop
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                buffer += chunk;

                // Parse lines from buffer
                const lines = buffer.split('\n');
                buffer = lines.pop() || ''; // Keep incomplete line

                for (const line of lines) {
                    if (!line.trim()) continue;
                    try {
                        const json = JSON.parse(line);
                        if (json.response) {
                            res.write(json.response); // Stream to user
                            accumulatedResponse += json.response;
                        }
                    } catch (e) {
                        // ignore partial JSON
                    }
                }
            }

            // End of this turn's generation. 
            // Save Assistant Message (Result of this turn)
            await pool.query("INSERT INTO messages (chat_id, role, content) VALUES ($1, $2, $3)", [id, 'assistant', accumulatedResponse]);

            // Check for Tool Calls
            const toolCalls = parseToolCalls(accumulatedResponse);
            if (toolCalls.length > 0) {
                let allResults = "";
                for (const toolCall of toolCalls) {
                    // Inject projectId dynamically
                    toolCall.args.projectId = id;

                    const result = await executeToolCall(toolCall);
                    allResults += `Tool '${toolCall.name}' Output:\n${JSON.stringify(result, null, 2)}\n\n`;
                }

                // Save Tool Results silently as a user message for context in future turns
                await pool.query("INSERT INTO messages (chat_id, role, content) VALUES ($1, $2, $3)", [id, 'user', allResults]);
            }

            // Single-pass strategy: Break immediately to optimize for speed. 
            // The LLM generated standard conversational text along with the tools.
            break;
        }

        res.end();

    } catch (err) {
        console.error("LLM Handler Error:", err);
        if (!res.headersSent) res.status(500).json({ error: err.message });
        else res.end(); // Close stream on error
    }
});

// Migration endpoint
app.post("/api/migrate-titles", async (req, res) => {
    try {
        const chats = await pool.query("SELECT id FROM chats WHERE title = 'New Chat'");
        let updated = 0;
        for (const chat of chats.rows) {
            const firstMsg = await pool.query(
                "SELECT content FROM messages WHERE chat_id = $1 AND role = 'user' ORDER BY created_at ASC LIMIT 1",
                [chat.id]
            );
            if (firstMsg.rows.length > 0) {
                const content = firstMsg.rows[0].content;
                const title = content.length > 50 ? content.substring(0, 50) + "..." : content;
                await pool.query("UPDATE chats SET title = $1 WHERE id = $2", [title, chat.id]);
                updated++;
            }
        }
        res.json({ success: true, updated });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Cleanup endpoint
app.delete("/api/cleanup-empty-chats", async (req, res) => {
    try {
        const emptyChats = await pool.query(`
            SELECT c.id FROM chats c
            LEFT JOIN messages m ON c.id = m.chat_id
            WHERE m.id IS NULL
        `);
        let deleted = 0;
        for (const chat of emptyChats.rows) {
            await pool.query("DELETE FROM chats WHERE id = $1", [chat.id]);
            deleted++;
        }
        res.json({ success: true, deleted });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.listen(4000, () => {
    console.log("Orchestrator running on port 4000");
});
