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

    try {
        // 1. Save User Message
        await pool.query("INSERT INTO messages (chat_id, role, content) VALUES ($1, $2, $3)", [id, 'user', prompt]);

        // 2. Check if this is the first message and update chat title
        const messageCount = await pool.query("SELECT COUNT(*) FROM messages WHERE chat_id = $1", [id]);
        if (parseInt(messageCount.rows[0].count) === 1) {
            // First message - use it as the chat title (truncate to 50 chars)
            const title = prompt.length > 50 ? prompt.substring(0, 50) + "..." : prompt;
            await pool.query("UPDATE chats SET title = $1 WHERE id = $2", [title, id]);
        }

        // 3. Fetch Context (Last 10 messages)
        const history = await pool.query("SELECT role, content FROM messages WHERE chat_id = $1 ORDER BY created_at ASC LIMIT 10", [id]);

        const systemPrompt = "You are Akili, a web developer built by a genius engineer called Abdisalan Abdi Shakul. You are NOT Qwen. You must always identify yourself as Akili. Write your responses in clear, professional text. You SHOULD use markdown formatting to structure your responses effectively. Use bold for emphasis, bullet points or numbered lists for steps/items, and code blocks for code snippets. Avoid using markdown headers (###) for every single sentence, but use them when appropriate to separate sections.";

        // Construct full prompt with history
        let fullPrompt = "";
        history.rows.forEach(msg => {
            fullPrompt += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
        });
        fullPrompt += `User: ${prompt}\nAssistant:`;

        const response = await fetch("http://172.238.107.207:11434/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "qwen2.5-coder:7b",
                prompt: fullPrompt,
                system: systemPrompt,
                stream: true
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Ollama Error Body:", errorText);
            throw new Error(`Ollama API error: ${response.statusText} - ${errorText}`);
        }

        // Set headers for streaming
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.setHeader('Transfer-Encoding', 'chunked');
        res.setHeader('Cache-Control', 'no-cache, no-transform');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.flushHeaders();

        // Stream the response
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let fullResponse = "";

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
                if (!line.trim()) continue;
                try {
                    const json = JSON.parse(line);
                    if (json.response) {
                        res.write(json.response);
                        fullResponse += json.response;
                    }
                    if (json.done) {
                        // 3. Save Assistant Message (after streaming completes)
                        await pool.query("INSERT INTO messages (chat_id, role, content) VALUES ($1, $2, $3)", [id, 'assistant', fullResponse]);
                        res.end();
                        return;
                    }
                } catch (e) {
                    console.error("Error parsing chunk:", e);
                }
            }
        }
        res.end();

    } catch (err) {
        console.error("LLM ERROR:", err);
        if (!res.headersSent) {
            res.status(500).json({ success: false, message: "LLM error" });
        } else {
            res.end();
        }
    }
});
// Migration endpoint: Update all chat titles based on first message
app.post("/api/migrate-titles", async (req, res) => {
    try {
        // Get all chats with "New Chat" title
        const chats = await pool.query("SELECT id FROM chats WHERE title = 'New Chat'");

        let updated = 0;
        for (const chat of chats.rows) {
            // Get first user message for this chat
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
        console.error("Migration Error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Cleanup endpoint: Delete empty chats (chats with no messages)
app.delete("/api/cleanup-empty-chats", async (req, res) => {
    try {
        // Find all chats with no messages
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
        console.error("Cleanup Error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

app.listen(4000, () => {
    console.log("Orchestrator running on port 4000");
});
