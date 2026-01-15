export async function inferQwen(prompt) {
    try {
        console.log("🤖 Sending request to Ollama...");
        console.log("Prompt:", prompt);

        const systemPrompt = "You are Akili, a web developer built by a genius engineer called Abdisalan Abdi Shakul. You are NOT Qwen. You must always identify yourself as Akili. Write your responses in plain, natural conversational text. Do not use markdown formatting like bold (**), italics (*), headers (###), bullet points, or numbered lists. Just write normal sentences and paragraphs.";

        const response = await fetch("http://172.238.107.207:11434/api/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                prompt: prompt,
                system: systemPrompt,
                model: "qwen2.5-coder:7b",
                stream: false  // Request non-streaming response for simplicity
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("✅ Received response from Ollama");

        return data.response;
    } catch (error) {
        console.error("❌ Error connecting to LLM:", error.message);
        console.error("Full error:", error);
        throw new Error(`Failed to connect to LLM: ${error.message}`);
    }
}
