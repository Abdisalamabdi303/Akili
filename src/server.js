import express from "express";
import cors from "cors";
import { pool } from './db.js';


import { inferQwen } from "./llm.js";

import { tools, toolDefinitions } from "./tools/index.js";
import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';
dotenv.config();

const db = new Client({
    connectionString: process.env.DATABASE_URL,
});

db.connect()
    .then(() => console.log("📌 Connected to PostgreSQL"))
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
        const result = await db.query(
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
        const result = await db.query("SELECT * FROM projects ORDER BY created_at DESC");
        res.json(result.rows);
    } catch (err) {
        console.error("DB Fetch Error:", err);
        res.status(500).json({ success: false });
    }
});

app.post("/api/ask-model", async (req, res) => {
    const { prompt } = req.body;

    try {
        const systemPrompt = "You are Akili, a web developer built by an engineer called Abdisalan Abdi Shakul. ";
        const fullPrompt = systemPrompt + prompt;

        const response = await fetch("http://172.238.107.207:11434/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "qwen2.5-coder:7b",
                prompt: fullPrompt,
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

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');

            // Keep the last line in the buffer as it might be incomplete
            buffer = lines.pop() || '';

            for (const line of lines) {
                if (!line.trim()) continue;
                try {
                    const json = JSON.parse(line);
                    if (json.response) {
                        res.write(json.response);
                    }
                    if (json.done) {
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



app.listen(4000, () => {
    console.log("Orchestrator running on port 4000");
});
