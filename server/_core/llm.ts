import { ENV } from "./env";

export type Role = "system" | "user" | "assistant" | "tool" | "function";

export type Message = {
  role: Role;
  content: string;
};

export type InvokeParams = {
  messages: Message[];
  maxTokens?: number;
};

export type InvokeResult = {
  text: string;
};

/**
 * Calls Google Gemini API (or any OpenAI-compatible endpoint if configured).
 * Falls back to Gemini REST API using GEMINI_API_KEY.
 */
export async function invokeLLM(params: InvokeParams): Promise<InvokeResult> {
  const { messages, maxTokens = 8192 } = params;

  // Build the prompt from messages
  const systemMessage = messages.find((m) => m.role === "system");
  const userMessages = messages.filter((m) => m.role !== "system");

  // If a custom Forge/OpenAI-compatible endpoint is configured, use it
  if (ENV.forgeApiUrl && ENV.forgeApiKey) {
    const payload = {
      model: "gemini-2.5-flash",
      messages: messages.map((m) => ({
        role: m.role === "system" ? "system" : m.role,
        content: m.content,
      })),
      max_tokens: maxTokens,
    };

    const response = await fetch(
      `${ENV.forgeApiUrl.replace(/\/$/, "")}/v1/chat/completions`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${ENV.forgeApiKey}`,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `LLM invoke failed: ${response.status} ${response.statusText} – ${errorText}`
      );
    }

    const data = (await response.json()) as any;
    const text =
      data?.choices?.[0]?.message?.content ||
      data?.choices?.[0]?.text ||
      "";
    return { text };
  }

  // Otherwise use Google Gemini REST API directly
  const geminiApiKey = ENV.geminiApiKey;
  if (!geminiApiKey) {
    throw new Error(
      "Ingen AI API-nøgle konfigureret. Tilføj GEMINI_API_KEY til din .env fil. " +
      "Hent en gratis nøgle på: https://aistudio.google.com/apikey"
    );
  }

  // Build Gemini content format
  const contents = userMessages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const geminiPayload: any = {
    contents,
    generationConfig: {
      maxOutputTokens: maxTokens,
      temperature: 0.7,
    },
  };

  if (systemMessage) {
    geminiPayload.systemInstruction = {
      parts: [{ text: systemMessage.content }],
    };
  }

  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`;

  const response = await fetch(geminiUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(geminiPayload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Gemini API fejl: ${response.status} ${response.statusText} – ${errorText}`
    );
  }

  const data = (await response.json()) as any;
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  return { text };
}
