export interface CapturedTask {
  id: string;
  rawInput: string;
  task: string;
  tags: string[];
  contexts: string[];
  project: string | null;
  enrichment: string | null;
  timestamp: string;
  source: string;
  aiParsed?: boolean;
}

const PATTERNS: Array<{ regex: RegExp; extract: (m: RegExpMatchArray) => string }> = [
  {
    regex: /^add\s+(.+?)\s+to\s+(?:my\s+)?(?:to[\s-]?do|todos?|task(?:s)?|list)$/i,
    extract: (m) => m[1],
  },
  {
    regex: /^remind(?:\s+me)?\s+to\s+(.+)$/i,
    extract: (m) => m[1],
  },
  {
    regex: /^(?:set\s+a?\s*)?reminder(?:\s+to)?\s+(.+)$/i,
    extract: (m) => m[1],
  },
  {
    regex: /^(?:don'?t\s+forget\s+to|don'?t\s+forget)\s+(.+)$/i,
    extract: (m) => m[1],
  },
  {
    regex: /^remember\s+to\s+(.+)$/i,
    extract: (m) => m[1],
  },
  {
    regex: /^(?:i\s+need\s+to|need\s+to|i\s+have\s+to|have\s+to|i\s+must|must)\s+(.+)$/i,
    extract: (m) => m[1],
  },
  {
    regex: /^(?:note|task|capture|todo|to-do|inbox)\s*:\s*(.+)$/i,
    extract: (m) => m[1],
  },
  {
    regex: /^(?:note|task|capture)\s+(.+)$/i,
    extract: (m) => m[1],
  },
  {
    regex: /^(?:can\s+you\s+)?(?:add|put|log)\s+(.+?)\s+(?:on|in(?:to)?|to)\s+(?:my\s+)?(?:list|to[\s-]?do|todos?|task(?:s)?|inbox)$/i,
    extract: (m) => m[1],
  },
  {
    regex: /^(?:make\s+a?\s*)?(?:note|task)\s+(?:to\s+|that\s+)?(.+)$/i,
    extract: (m) => m[1],
  },
];

function cleanTask(raw: string): string {
  let t = raw.trim();
  t = t.replace(/[.!?]+$/, "").trim();
  if (t.length > 0) {
    t = t.charAt(0).toUpperCase() + t.slice(1);
  }
  return t;
}

export function extractTags(text: string): string[] {
  const matches = text.match(/#[a-zA-Z0-9_-]+/g) || [];
  return [...new Set(matches.map((t) => t.toLowerCase()))];
}

export function extractContexts(text: string): string[] {
  const matches = text.match(/@[a-zA-Z0-9_-]+/g) || [];
  return [...new Set(matches.map((c) => c.toLowerCase()))];
}

export function parseCommand(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "";

  for (const { regex, extract } of PATTERNS) {
    const match = trimmed.match(regex);
    if (match) {
      return cleanTask(extract(match));
    }
  }

  return cleanTask(trimmed);
}

export function formatObsidianCheckbox(task: CapturedTask): string {
  const date = new Date(task.timestamp);
  const iso = date.toISOString().replace("T", " ").replace(/\.\d{3}Z$/, "");
  const tagStr = task.tags.length > 0 ? ` ${task.tags.join(" ")}` : "";
  const ctxStr = task.contexts.length > 0 ? ` ${task.contexts.join(" ")}` : "";
  const projStr = task.project ? ` [[${task.project}]]` : "";
  return `- [ ] ${task.task}${projStr}${tagStr}${ctxStr} <!-- captured: ${iso} source: ${task.source} -->`;
}

export function formatFullMarkdown(tasks: CapturedTask[]): string {
  if (tasks.length === 0) return "";
  const header = `## PCA Inbox\n`;
  const lines = tasks.map(formatObsidianCheckbox).join("\n");
  return `${header}\n${lines}\n`;
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
