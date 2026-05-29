import { Router } from "express";
import { z } from "zod";
import { createOpenAIClient, DEFAULT_TEXT_MODEL } from "../lib/openaiClient";

const parseRequestSchema = z.object({
  input: z.string().trim().min(1),
  projects: z.array(z.string().trim().min(1)).default([]),
  eventContext: z
    .object({
      city: z.string().optional(),
      interests: z.array(z.string()).optional(),
      selectedEventTitle: z.string().optional(),
    })
    .optional(),
});

const summaryRequestSchema = z.object({
  tasks: z.array(
    z.object({
      task: z.string(),
      project: z.string().nullable(),
      tags: z.array(z.string()),
      contexts: z.array(z.string()),
      timestamp: z.string(),
    }),
  ).min(1),
  period: z.string().default("recent"),
});

const router = Router();

router.post("/pca/parse", async (req, res) => {
  const parsedBody = parseRequestSchema.safeParse(req.body);

  if (!parsedBody.success) {
    res.status(400).json({ error: "Invalid PCA parse request", details: parsedBody.error.flatten() });
    return;
  }

  const { input, projects, eventContext } = parsedBody.data;
  const projectList = projects.length > 0
    ? `The user's current Obsidian project areas are: ${projects.join(", ")}.`
    : "The user has not defined project areas yet. Suggest a short project area if useful.";
  const eventLine = eventContext
    ? `Event concierge context: city=${eventContext.city ?? "unknown"}; interests=${eventContext.interests?.join(", ") ?? "unknown"}; selectedEvent=${eventContext.selectedEventTitle ?? "none"}.`
    : "No event concierge context was provided.";

  const systemPrompt = `You are a Personal Cognitive Architecture (PCA) task-capture assistant inside an event concierge PoC.

${projectList}
${eventLine}

Rules:
- Extract only the actionable task from the user's raw voice or text.
- Preserve event names, locations, dates, and follow-up actions when present.
- Capitalize the task and do not add a period.
- Suggest 1-3 lowercase #tags.
- Detect explicit @context mentions.
- Suggest one project area from the user's list, or a short new project area when useful.
- Add a one-sentence enrichment note only when it helps the user act.

Respond only with JSON in this shape:
{
  "task": "string",
  "project": "string or null",
  "tags": ["#tag"],
  "contexts": ["@context"],
  "enrichment": "string or null"
}`;

  try {
    const openai = createOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: DEFAULT_TEXT_MODEL,
      max_completion_tokens: 512,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: input },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    const content = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/i, "").trim();
    res.json(JSON.parse(content));
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI request failed";
    res.status(500).json({ error: message });
  }
});

router.post("/pca/summary", async (req, res) => {
  const parsedBody = summaryRequestSchema.safeParse(req.body);

  if (!parsedBody.success) {
    res.status(400).json({ error: "Invalid PCA summary request", details: parsedBody.error.flatten() });
    return;
  }

  const { tasks, period } = parsedBody.data;
  const taskLines = tasks
    .map((task, index) => {
      const tags = task.tags.join(" ");
      const project = task.project ? `[${task.project}]` : "";
      const date = new Date(task.timestamp).toLocaleDateString(undefined, { month: "short", day: "numeric" });
      return `${index + 1}. ${task.task} ${project} ${tags} (${date})`.trim();
    })
    .join("\n");

  try {
    const openai = createOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: DEFAULT_TEXT_MODEL,
      max_completion_tokens: 512,
      messages: [
        {
          role: "system",
          content: "Summarize captured PCA tasks for an event concierge user. Group related event follow-ups and personal tasks. Keep it under 200 words.",
        },
        { role: "user", content: `My ${period} tasks:\n\n${taskLines}` },
      ],
    });

    res.json({ summary: completion.choices[0]?.message?.content ?? "" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI request failed";
    res.status(500).json({ error: message });
  }
});

export default router;
