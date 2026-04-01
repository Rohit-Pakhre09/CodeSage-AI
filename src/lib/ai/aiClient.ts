export class AIProviderError extends Error {
  provider: string;
  status: number;
  retryAfterSeconds?: number;

  constructor(
    provider: string,
    message: string,
    status: number,
    retryAfterSeconds?: number,
  ) {
    super(message);
    this.name = "AIProviderError";
    this.provider = provider;
    this.status = status;
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

type AIResponse = {
  provider: string;
  text: string;
};

export async function getAIResponse(prompt: string): Promise<AIResponse> {
  return getGroqResponse(prompt);
}

async function getGroqResponse(prompt: string): Promise<AIResponse> {
  const apiKey = process.env.GROQ_API_KEY;
  const model = process.env.GROQ_MODEL ?? "llama-3.1-8b-instant";

  if (!apiKey) {
    throw new AIProviderError(
      "groq",
      "GROQ_API_KEY is missing. Add a Groq API key to use AI review.",
      503,
    );
  }

  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          temperature: 0.2,
          response_format: {
            type: "json_object",
          },
          messages: [
            {
              role: "system",
              content:
                "You are a senior software engineer and professional code reviewer. Respond with valid JSON only.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Groq HTTP Error:", errorText);

      let message = `Groq API request failed (${response.status} ${response.statusText})`;
      let retryAfterSeconds: number | undefined;

      try {
        const parsedError = JSON.parse(errorText);
        const apiMessage =
          parsedError?.error?.message ??
          parsedError?.message ??
          parsedError?.error;

        if (typeof apiMessage === "string" && apiMessage.trim()) {
          message = apiMessage.trim();
        }
      } catch {
        // Keep the generic HTTP error if Groq did not return JSON.
      }

      const retryAfterHeader = response.headers.get("retry-after");
      if (retryAfterHeader) {
        const retryAfter = Number(retryAfterHeader);
        if (!Number.isNaN(retryAfter)) {
          retryAfterSeconds = retryAfter;
        }
      }

      throw new AIProviderError(
        "groq",
        message,
        response.status,
        retryAfterSeconds,
      );
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content?.trim();

    if (!text) {
      console.error("Groq Empty Response:", JSON.stringify(data, null, 2));
      throw new Error("Groq returned an empty response");
    }

    return {
      provider: "groq",
      text,
    };
  } catch (error) {
    console.error("Groq AI Error:", error);

    if (error instanceof AIProviderError) {
      throw error;
    }

    if (error instanceof Error) {
      throw new Error(`Failed to get AI response from Groq: ${error.message}`);
    }

    throw new Error("Failed to get AI response from Groq");
  }
}
