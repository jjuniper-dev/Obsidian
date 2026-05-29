import OpenAI from "openai";

export function createOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is required for AI-assisted PCA parsing.");
  }

  return new OpenAI({ apiKey });
}

export const DEFAULT_TEXT_MODEL = process.env.OPENAI_TEXT_MODEL ?? "gpt-5.4";
