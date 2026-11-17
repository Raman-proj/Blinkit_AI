require('dotenv').config();
const NVIDIA_API_URL = "https://integrate.api.nvidia.com/v1/chat/completions";
const NVIDIA_KEY = process.env.NVIDIA_API_KEY || "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";

/**
 * Generic NVIDIA NIM caller for both Vision (Gemma-3) and Text (Llama-3.1) tasks.
 * Consolidates all AI logic to bypass Mistral 429 limits.
 */
async function callNvidiaNim({ model, messages, max_tokens = 512, temperature = 0.2, top_p = 0.7 }) {
    console.log(`[NVIDIA-NIM] Calling ${model}...`);
    
    const payload = {
        model,
        messages,
        max_tokens,
        temperature,
        top_p,
        stream: false
    };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 45000);

    try {
        const startTime = Date.now();
        const response = await fetch(NVIDIA_API_URL, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${NVIDIA_KEY}`,
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(payload),
            signal: controller.signal
        });

        clearTimeout(timeout);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`NVIDIA API Error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        const latency = Date.now() - startTime;
        console.log(`[NVIDIA-NIM] ${model} settled in ${latency}ms`);
        
        return data.choices[0].message.content;
    } catch (error) {
        if (error.name === 'AbortError') throw new Error(`NVIDIA Timeout (${model})`);
        console.error(`[NVIDIA-NIM-ERROR] ${model}:`, error);
        throw error;
    }
}

/**
 * Optimized Gemma-3 Vision Wrapper
 */
async function analyzeImageWithNvidia(base64Image, prompt = "Analyze this grocery item. List specific products seen.") {
    const base64Data = base64Image.includes('base64,') ? base64Image.split('base64,')[1] : base64Image;
    
    return callNvidiaNim({
        model: "google/gemma-3-27b-it",
        messages: [
            {
                role: "user",
                content: [
                    { type: "text", text: prompt },
                    { type: "image_url", image_url: { url: `data:image/jpeg;base64,${base64Data}` } }
                ]
            }
        ]
    });
}

/**
 * Optimized Llama 3.1 Chat Wrapper (Replacement for Mistral)
 */
async function callLlama3(messages, jsonMode = false) {
    return callNvidiaNim({
        model: "meta/llama-3.1-8b-instruct",
        messages,
        max_tokens: 1024,
        temperature: 0.1 // Lower temp for more reliable JSON and intent classification
    });
}

module.exports = { analyzeImageWithNvidia, callLlama3, callNvidiaNim };
