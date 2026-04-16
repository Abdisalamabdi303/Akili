import express from "express";
import cors from "cors";
import { pool } from './db.js';
import { inferQwen } from "./llm.js";
import { tools, toolDefinitions } from "./tools/index.js";
import dotenv from 'dotenv';

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
    const llmModel = process.env.LLM_MODEL || "gemma4:e2b";
    console.log(`🔥 Pre-warming model ${llmModel}...`);
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
    const candidate = (rawTitle || "")
        .replace(/^["'`]+|["'`]+$/g, "")
        .replace(/\s+/g, " ")
        .trim();

    if (!candidate) return fallbackTitle;
    return candidate.length > 60 ? `${candidate.slice(0, 57)}...` : candidate;
}

async function generateProjectTitle(userPrompt, assistantResponse) {
    const fallbackTitle = buildFallbackTitle(userPrompt);
    const jobEndpoint = process.env.JOB_ENDPOINT || "localhost";
    const llmModel = process.env.LLM_MODEL || "gemma4:e2b";

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

const SYSTEM_PROMPT = `You are Akili, an autonomous Senior Product Manager and exceptional UI/UX Developer built by an expert software engineer and AI developer, Abdisalam Abdi Shakul.
Your goal is to build breathtaking, modern web applications from scratch incredibly fast using Vanilla HTML, Javascript, and Tailwind CSS.

AUTONOMOUS PRODUCT MANAGEMENT:
- If the user provides a brief or vague request (e.g., "Build a meditation app"), DO NOT output a minimal skeleton and DO NOT ask basic clarification questions.
- You must independently invent rich features, comprehensive sections (e.g. Hero, Features, Pricing, Testimonials, Dashboards), and insert highly realistic placeholder data.
- Build the ULTIMATE, fully-featured version of whatever they request.

DESIGN STRICT GUIDELINES:
- **DaisyUI Framework**: You have DaisyUI installed via CDN! You MUST utilize DaisyUI component classes (e.g., \`btn btn-primary\`, \`card bg-base-100 shadow-xl\`, \`hero\`, \`navbar\`, \`badge\`, \`mockup-browser\`) rather than stacking raw Tailwind utilities for major components. This guarantees premium aesthetics effortlessly.
- **NAVBAR & HERO PROPORTIONALITY**: Navbars and hero sections MUST feel balanced as one system, not oversized isolated sections.
    - **Shared Container Rule**: Navbar and hero content MUST use the same container width and horizontal padding (e.g. \`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8\`).
    - **Navbar**: Use a \`navbar\` with stable height (\`h-14 sm:h-16\`) and balanced left/right groups. Prefer \`sticky top-0 z-50 backdrop-blur-lg bg-base-100/80 border-b border-white/10\` over oversized bars.
    - **Hero Height & Spacing**: Default to proportional spacing (\`pt-10 md:pt-16 pb-12 md:pb-20\`) instead of always forcing \`min-h-screen\`. Only use full-screen heroes when the user explicitly requests it.
    - **Shared Container Rule**: Navbar and hero content MUST use the same container width and horizontal padding (e.g. 'max-w-6xl mx-auto px-4 sm:px-6 lg:px-8').
    - **Navbar**: Use a 'navbar' with stable height ('h-14 sm:h-16') and balanced left/right groups. Prefer 'sticky top-0 z-50 backdrop-blur-lg bg-base-100/80 border-b border-white/10' over oversized bars.
    - **Hero Height & Spacing**: Default to proportional spacing ('pt-10 md:pt-16 pb-12 md:pb-20') instead of always forcing 'min-h-screen'. Only use full-screen heroes when the user explicitly requests it.
    - **Hero Typography**: Keep headline powerful but controlled ('text-4xl md:text-5xl font-extrabold' by default). Use larger scales only when explicitly requested.
    - **Hero Content Alignment (Critical)**: Hero text/buttons must be vertically stacked, centered, and readable. Use '<div class="hero-content text-center">' with an inner wrapper like 'max-w-3xl flex flex-col items-center gap-6'. NEVER place hero heading/subtext/CTA in a horizontal row.
    - **Pollination Backgrounds (Correct Usage)**: If using Pollination images, always URL-encode prompt keywords and use this format: 'https://pollinations.ai/prompt/${encodeURIComponent('descriptive scene keywords')}?width=1920&height=1080&nologo=true'. Use 'bg-cover bg-center bg-no-repeat' on hero, and always add an overlay (e.g. 'hero-overlay bg-opacity-50' to 'bg-opacity-70') for readability.
    - **Hero Background Fallback (Mandatory)**: If a generated Pollination URL might fail or look weak, include a fallback visual style in CSS (gradient background) so hero never looks blank.
    - **Vertical Rhythm**: Use consistent spacing tokens (multiples of 4/8) between headline, subtext, and CTAs. Avoid arbitrary or excessive gaps.
- LAYOUT & SPACING: Exploit generous whitespace (p-4 md:p-8), clear visual hierarchies, and modern flex/grid. Use dark mode by default (bg-slate-950 text-white) for a sleek look unless specified.
- MOBILE-FIRST RESPONSIVENESS (MANDATORY): The default view is a narrow mobile preview. You MUST build mobile-first. Always use 'flex-col' and stack grid items ('grid-cols-1') on mobile, and apply 'md:flex-row' and 'md:grid-cols-3' for desktop.
- MODERN TOUCHES: Implement glassmorphism (bg-white/10 border border-white/20 backdrop-blur-lg), prominent rounded corners (rounded-2xl, rounded-3xl), and soft glowing shadows (shadow-2xl shadow-indigo-500/20).
- JAVASCRIPT INTEGRATION: You must explicitly generate a <tool name="createFile"><filePath>script.js</filePath>... file to handle functionality. Use 'document.addEventListener("DOMContentLoaded")' to query elements and add event listeners (e.g., interactive tabs, counters, modals).
- INTERACTIVITY: Guarantee smooth CSS micro-interactions on all clickable elements (transition-all duration-300 hover:scale-105 active:scale-95).
- **PRODUCT CONTENT QUALITY (MANDATORY)**: Never use placeholder copy such as "product description", "lorem ipsum", "sample text", or empty fields.
    - For each product/service card, generate: a realistic product name, 1-2 sentence meaningful description, price or value signal, and 2-4 concrete bullet features.
    - Descriptions must be specific to the user domain (e.g. fitness, fintech, education) and not generic marketing filler.
- **IMAGE RELEVANCE (MANDATORY)**: Never use random unrelated images for core products.
    - Build image prompts/URLs from each item's name + category keywords so visuals match content.
    - Prefer deterministic seeds based on item names, not random seeds.
    - If no good relevant image is available, use polished icon/illustration blocks instead of random photos.
- **ICONS (MANDATORY WHEN USEFUL)**: Use relevant icons for feature cards, stats, and navigation affordances.
    - Prefer inline SVG icons or a CDN icon library in \`index.html\` (e.g. Lucide via CDN) when needed.
    - Choose icons that semantically match content (heart for health, chart for analytics, shield for security).
    - Never use generic placeholder logo images when a text/SVG logo mark is more appropriate.

To create files, output this exact XML format and STOP immediately after the closing tag:
<tool name="createFile">
    <filePath>index.html</filePath>
    <content>YOUR CODE HERE</content>
</tool>

CRITICAL WORKFLOW (Follow these exact steps):
1. **Architecture**: You are building a Vanilla web application. Do NOT use React, Vue, or any frameworks. Just standard DOM APIs. Tailwind CSS and DaisyUI are available via CDN.
2. **Files required**:
   - 'index.html' - The main entry point (MUST include the DaisyUI CDN link and Tailwind CDN script)
   - 'styles.css' - Any custom global styles not covered by Tailwind
   - 'script.js' - All your Javascript logic
3. **Strict Formatting Penalties**: 
   - DO NOT nest XML tags. You MUST securely close </content></tool> before starting a new file!
   - DO NOT write multiple versions of 'index.html'. Write it EXACTLY ONCE.
   - If you write code, you MUST wrap it inside the tool format. NEVER output raw HTML or JS outside of the <content> tag.
4. **Execution Loop**: After each tool call, STOP. The system runs the tool and hands control back to you.
5. **Finishing**: When you have completed all files, DO NOT USE ANY TOOL TAGS. Simply write a short final message explaining the features you invented and built.

CORRECT XML FORMAT:

<tool name="createFile">
    <filePath>index.html</filePath>
    <content>
<!-- Your actual FULL HTML code here including tailwind script -->
    </content>
</tool>

<tool name="createFile">
    <filePath>script.js</filePath>
    <content>
// Your actual JavaScript logic here
    </content>
</tool>

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

function parseToolCalls(text) {
    const regex = /<tool name="(\w+)">([\s\S]*?)(?:<\/tool>|$)/g;
    const found = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
        const [, name, content] = match;
        const args = {};
        const paramRegex = /<(\w+)>([\s\S]*?)(?:<\/\1>|$)/g;
        let paramMatch;
        while ((paramMatch = paramRegex.exec(content)) !== null) {
            args[paramMatch[1]] = paramMatch[2].trim();
        }
        if (name === 'createFile' && args.content === undefined) {
            args.content = "";
        }
        // Tool Validation & Auto-Correction for missing extensions
        if ((name === 'createFile' || name === 'updateFile') && args.filePath) {
            const fileName = args.filePath.split('/').pop();
            // Assign .js extension dynamically if no extension found and not package.json
            if (fileName && !fileName.includes('.')) {
                args.filePath += '.js';
            }
        }
        found.push({ name, args });
    }
    return found;
}

function validateIndexHtmlQuality(content) {
    const issues = [];
    const html = content || "";

    const hasHero = /<(section|div)[^>]*class="[^"]*\bhero\b[^"]*"/i.test(html);
    if (hasHero) {
        if (!/pollinations\.ai\/prompt\//i.test(html)) {
            issues.push("Hero section is missing a Pollinations background image URL.");
        }

        if (!/\bbg-cover\b/i.test(html) || !/\bbg-center\b/i.test(html)) {
            issues.push("Hero background must include `bg-cover bg-center` for proper composition.");
        }

        const heroContentClassMatch = /class="[^"]*\bhero-content\b[^"]*"/i.exec(html);
        if (heroContentClassMatch) {
            const classText = heroContentClassMatch[0];
            if (!/\btext-center\b/i.test(classText)) {
                issues.push("Hero content must include `text-center`.");
            }
            if (!/\bflex\b/i.test(classText) || !/\bflex-col\b/i.test(classText) || !/\bitems-center\b/i.test(classText)) {
                issues.push("Hero content must include `flex flex-col items-center` to avoid horizontal alignment.");
            }
        } else {
            issues.push("Hero content container is missing required `hero-content` structure.");
        }
    }

    if (/\b(product name|description of the product|product description|lorem ipsum|sample text)\b/i.test(html)) {
        issues.push("Generic placeholder product copy detected. Product cards need specific names and meaningful descriptions.");
    }

    if (/picsum\.photos\/seed\/\$\{?Math\.floor|\bpicsum\.photos\/seed\/pet\d+\b/i.test(html)) {
        issues.push("Random placeholder product images detected. Use domain-relevant deterministic image prompts/keywords.");
    }

    if (/placehold\.co\/50x50|placeholder/i.test(html)) {
        issues.push("Placeholder branding/assets detected. Use a styled text or SVG logo instead of placeholder images.");
    }

    if (/\bbg-base-(800|900)\b/i.test(html)) {
        issues.push("Invalid DaisyUI surface classes detected (`bg-base-800/900`). Use valid theme tokens like `bg-base-100`, `bg-base-200`, or explicit Tailwind slate/zinc classes.");
    }

    const scriptMatches = html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi);
    for (const match of scriptMatches) {
        if (match[1] && match[1].trim().length > 5) {
            issues.push("INLINE JAVASCRIPT DETECTED: You wrote JS logic inside <script> tags in index.html! This is STRICTLY FORBIDDEN. You must completely remove it from index.html and output it exactly inside a separate <tool name='createFile'><filePath>script.js</filePath> block.");
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

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    try {
        await pool.query("INSERT INTO messages (chat_id, role, content) VALUES ($1, $2, $3)", [id, 'user', prompt]);

        const countRes = await pool.query("SELECT COUNT(*) FROM messages WHERE chat_id = $1", [id]);
        const isFirstUserMessage = parseInt(countRes.rows[0].count) === 1;

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
            let workspaceContext = "[System Data: Current files in workspace: ";
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
                workspaceContext += paths.length > 0 ? paths.join(", ") : "None";
            } else {
                workspaceContext += "None";
            }
            workspaceContext += "]\n\n";

            // Build flat prompt string for /api/generate (more reliable than /api/chat)
            let fullPrompt = workspaceContext;

            // Context Truncation to optimize Time-To-First-Token (TTFT)
            const recentMessages = history.rows.slice(-4);
            if (history.rows.length > 4) {
                fullPrompt += "[SYSTEM: Older chat history truncated for performance]\n\n";
            }

            recentMessages.forEach(msg => {
                let strippedContent = msg.content;
                // Drastically reduce Token Payload by stripping old code file outputs
                if (msg.role === 'assistant') {
                    strippedContent = strippedContent.replace(/<content>[\s\S]*?<\/content>/g, "<content>... [Code omitted from memory to increase generation speed. You already saved this.] ...</content>");
                }
                fullPrompt += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${strippedContent}\n`;
            });
            fullPrompt += "Assistant: ";

            const jobEndpoint = process.env.JOB_ENDPOINT || "localhost";
            const llmModel = process.env.LLM_MODEL || "gemma4:e2b";

            console.log(`🤖 [Loop ${loopCount}] Autonomous Product Manager Phase, model: ${llmModel}`);

            const response = await fetch(`http://${jobEndpoint}:11434/api/generate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: llmModel,
                    prompt: fullPrompt,
                    system: systemPrompt,
                    stream: true,
                    keep_alive: "30m",
                    options: {
                        num_predict: 8192,
                        temperature: 0.1
                    }
                })
            });

            if (!response.ok) throw new Error(`LLM API Error: ${response.status}`);

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let accumulatedResponse = "";
            let buffer = "";

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

                if (qualityIssues.length > 0) {
                    const uniqueIssues = [...new Set(qualityIssues)];
                    qualityGateFailures += 1;

                    if (qualityGateFailures > MAX_QUALITY_GATE_FAILURES) {
                        console.warn(`⚠️ Quality gate exceeded retry budget for chat ${id}. Proceeding to avoid loop.`);
                    } else {
                        const feedback = `[SYSTEM: Quality Gate Failed]
Your proposed index.html failed required quality checks:
${uniqueIssues.map(issue => `- ${issue}`).join("\n")}

Fix all issues now.
Return exactly ONE tool call for index.html only.
Use createFile if index.html does not exist yet, otherwise use updateFile.
Do not include any explanation text outside the tool tag.`;
                        await pool.query("INSERT INTO messages (chat_id, role, content) VALUES ($1, $2, $3)", [id, "user", feedback]);
                        continue;
                    }
                }

                let allResults = "";
                for (const toolCall of toolCalls) {
                    toolCall.args.projectId = id;
                    const result = await executeToolCall(toolCall);
                    allResults += `Tool '${toolCall.name}' Output:\n${JSON.stringify(result, null, 2)}\n\n`;
                }
                await pool.query("INSERT INTO messages (chat_id, role, content) VALUES ($1, $2, $3)", [id, 'user', allResults]);
                continue;
            }

            break;
        }

        res.end();
    } catch (err) {
        console.error("LLM Handler Error:", err);
        if (!res.headersSent) res.status(500).json({ error: err.message });
        else res.end();
    }
});

app.listen(4000, () => {
    console.log("Orchestrator running on port 4000");
});
