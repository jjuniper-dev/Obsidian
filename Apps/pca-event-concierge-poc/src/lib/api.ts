export interface AIParseResult {
  task: string;
  project: string | null;
  tags: string[];
  contexts: string[];
  enrichment: string | null;
}

export async function aiParseTask(input: string, projects: string[], selectedEventTitle?: string): Promise<AIParseResult> {
  const response = await fetch("/api/pca/parse", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      input,
      projects,
      eventContext: selectedEventTitle ? { selectedEventTitle } : undefined,
    }),
  });

  if (!response.ok) {
    throw new Error(`AI parse failed: ${response.status}`);
  }

  return response.json() as Promise<AIParseResult>;
}
