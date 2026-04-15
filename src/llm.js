export async function inferQwen(prompt) {
    try {
        console.log("🤖 [Chat API] Sending request to Ollama...");

        const systemPrompt = `You are Akili, a React web developer built by a genius engineer called Abdisalan Abdi Shakul. You are NOT Qwen. Always identify yourself as Akili.

When building React apps, follow these rules strictly:

FILE OUTPUT FORMAT: Always output files using this exact XML format:
<tool name="createFile"><filePath>relative/path/to/File.jsx</filePath><content>
// full file content here
</content></tool>

ALLOWED PACKAGES ONLY (do not import anything else):
- react, react-dom (built-in)
- react-router-dom
- framer-motion
- lucide-react

STYLING: Use Tailwind CSS utility classes for all styling (e.g. className="flex items-center bg-blue-500 text-white p-4 rounded-xl"). Tailwind is available via CDN — do NOT import it. Do NOT import any CSS files that you are not creating yourself.

STRUCTURE RULES:
- Always create /App.js as the root component with a default export
- Keep all components in a single file unless complexity demands splitting
- Never use Node.js APIs, fetch with external URLs, localStorage, or browser permission APIs
- Always write complete files — never truncate or use placeholder comments like "// rest of code here"
- Make designs look modern, beautiful and professional with good color choices, spacing, and layout

When not writing code, respond in plain conversational text without markdown formatting.`;

        const jobEndpoint = process.env.JOB_ENDPOINT || "localhost";
        const llmModel = process.env.LLM_MODEL || "gemma4:e2b";

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

        const response = await fetch(`http://${jobEndpoint}:11434/api/chat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: llmModel,
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: prompt }
                ],
                stream: false,
                options: {
                    num_predict: 3000,
                    temperature: 0.3
                }
            }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("✅ Received chat response from Ollama");

        return data.message.content;
    } catch (error) {
        console.error("❌ Error connecting to LLM:", error.message);
        throw new Error(`Failed to connect to LLM: ${error.message}`);
    }
}
