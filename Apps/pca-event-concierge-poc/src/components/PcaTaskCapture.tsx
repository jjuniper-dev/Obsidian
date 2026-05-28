import { useEffect, useMemo, useState } from "react";
import { Bot, CheckSquare, ClipboardCopy, Sparkles, Trash2 } from "lucide-react";
import { aiParseTask } from "../lib/api";
import {
  extractContexts,
  extractTags,
  formatFullMarkdown,
  formatObsidianCheckbox,
  generateId,
  parseCommand,
  type CapturedTask,
} from "../lib/taskParser";

const TASKS_KEY = "pca-event-concierge-tasks";
const PROJECTS_KEY = "pca-event-concierge-projects";
const SOURCE = "pca-event-concierge-poc";

function loadJson<T>(key: string, fallback: T): T {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) as T : fallback;
}

export function PcaTaskCapture({ selectedEventTitle }: { selectedEventTitle?: string }) {
  const [input, setInput] = useState("");
  const [tasks, setTasks] = useState<CapturedTask[]>(() => loadJson(TASKS_KEY, []));
  const [projects, setProjects] = useState<string[]>(() => loadJson(PROJECTS_KEY, ["Events", "Personal", "Work"]));
  const [projectDraft, setProjectDraft] = useState(projects.join(", "));
  const [copied, setCopied] = useState(false);
  const [aiBusy, setAiBusy] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  useEffect(() => localStorage.setItem(TASKS_KEY, JSON.stringify(tasks)), [tasks]);
  useEffect(() => localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects)), [projects]);
  useEffect(() => {
    const seedInput = (event: Event) => {
      const prompt = (event as CustomEvent<string>).detail;
      if (prompt) setInput(prompt);
    };

    window.addEventListener("pca-seed-task", seedInput);
    return () => window.removeEventListener("pca-seed-task", seedInput);
  }, []);

  const markdown = useMemo(() => formatFullMarkdown(tasks), [tasks]);

  const addTask = (partial: Omit<CapturedTask, "id" | "timestamp" | "source" | "rawInput">, rawInput: string) => {
    setTasks((current) => [
      {
        ...partial,
        id: generateId(),
        rawInput,
        timestamp: new Date().toISOString(),
        source: SOURCE,
      },
      ...current,
    ]);
  };

  const captureDeterministic = () => {
    const task = parseCommand(input);
    if (!task) return;

    addTask(
      {
        task,
        tags: selectedEventTitle ? [...extractTags(input), "#event"] : extractTags(input),
        contexts: extractContexts(input),
        project: selectedEventTitle ? "Events" : null,
        enrichment: selectedEventTitle ? `Related event: ${selectedEventTitle}` : null,
        aiParsed: false,
      },
      input,
    );
    setInput("");
  };

  const captureWithAi = async () => {
    if (!input.trim()) return;
    setAiBusy(true);
    setAiError(null);

    try {
      const parsed = await aiParseTask(input, projects, selectedEventTitle);
      addTask({ ...parsed, aiParsed: true }, input);
      setInput("");
    } catch (error) {
      setAiError(error instanceof Error ? error.message : "AI parse failed");
    } finally {
      setAiBusy(false);
    }
  };

  const saveProjects = () => {
    setProjects(projectDraft.split(",").map((item) => item.trim()).filter(Boolean));
  };

  const copyMarkdown = async () => {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <section className="panel stack">
      <div className="section-heading">
        <CheckSquare aria-hidden="true" />
        <div>
          <h2>PCA capture</h2>
          <p>Capture follow-ups as Obsidian-compatible markdown tasks.</p>
        </div>
      </div>

      {selectedEventTitle && <p className="context-pill">Selected event context: {selectedEventTitle}</p>}

      <label className="field-label" htmlFor="task-input">Task, reminder, or event follow-up</label>
      <textarea
        id="task-input"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        placeholder="Example: remind me to invite Sam to the pottery workshop #date-night"
        rows={4}
      />

      <div className="button-row">
        <button className="primary" type="button" onClick={captureDeterministic}>Capture locally</button>
        <button className="secondary" type="button" onClick={captureWithAi} disabled={aiBusy}>
          <Sparkles aria-hidden="true" /> {aiBusy ? "Parsing…" : "AI enrich"}
        </button>
      </div>
      {aiError && <p className="warning">{aiError}</p>}

      <div className="project-box">
        <label className="field-label" htmlFor="projects">Project areas</label>
        <div className="inline-controls">
          <input id="projects" value={projectDraft} onChange={(event) => setProjectDraft(event.target.value)} />
          <button className="secondary" type="button" onClick={saveProjects}>Save</button>
        </div>
      </div>

      <div className="export-box">
        <div className="section-heading small">
          <Bot aria-hidden="true" />
          <div>
            <h3>Obsidian export</h3>
            <p>{tasks.length} captured task{tasks.length === 1 ? "" : "s"}</p>
          </div>
        </div>
        <pre>{markdown || "## PCA Inbox\n\nNo tasks captured yet."}</pre>
        <div className="button-row">
          <button className="secondary" type="button" onClick={copyMarkdown} disabled={!markdown}>
            <ClipboardCopy aria-hidden="true" /> {copied ? "Copied" : "Copy markdown"}
          </button>
          <button className="danger" type="button" onClick={() => setTasks([])} disabled={tasks.length === 0}>
            <Trash2 aria-hidden="true" /> Clear
          </button>
        </div>
      </div>

      <div className="task-list">
        {tasks.map((task) => (
          <article key={task.id} className="task-card">
            <strong>{task.task}</strong>
            {task.enrichment && <p>{task.enrichment}</p>}
            <code>{formatObsidianCheckbox(task)}</code>
          </article>
        ))}
      </div>
    </section>
  );
}
