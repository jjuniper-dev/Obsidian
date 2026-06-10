import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Note, Tag, VaultStats } from "@/types";

const STORAGE_KEY = "vault_notes";

type VaultContextType = {
  notes: Note[];
  addNote: (note: Omit<Note, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  updateNote: (id: string, updates: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  linkNotes: (noteId: string, targetId: string) => Promise<void>;
  getNote: (id: string) => Note | undefined;
  searchNotes: (query: string) => Note[];
  getNotesByTag: (tagLabel: string) => Note[];
  getLinkedNotes: (noteId: string) => Note[];
  getAllTags: () => Tag[];
  stats: VaultStats;
  isLoading: boolean;
};

const VaultContext = createContext<VaultContextType | undefined>(undefined);

function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

export function VaultProvider({ children }: { children: React.ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setNotes(JSON.parse(stored));
      } else {
        const seedNotes = getSeedNotes();
        setNotes(seedNotes);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(seedNotes));
      }
    } catch (e) {
      console.error("Failed to load notes", e);
    } finally {
      setIsLoading(false);
    }
  };

  const saveNotes = async (updated: Note[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save notes", e);
    }
  };

  const addNote = useCallback(
    async (note: Omit<Note, "id" | "createdAt" | "updatedAt">) => {
      const now = Date.now();
      const newNote: Note = {
        ...note,
        id: generateId(),
        createdAt: now,
        updatedAt: now,
      };
      const updated = [newNote, ...notes];
      setNotes(updated);
      await saveNotes(updated);
    },
    [notes]
  );

  const updateNote = useCallback(
    async (id: string, updates: Partial<Note>) => {
      const updated = notes.map((n) =>
        n.id === id ? { ...n, ...updates, updatedAt: Date.now() } : n
      );
      setNotes(updated);
      await saveNotes(updated);
    },
    [notes]
  );

  const deleteNote = useCallback(
    async (id: string) => {
      const updated = notes
        .filter((n) => n.id !== id)
        .map((n) => ({
          ...n,
          linkedNoteIds: n.linkedNoteIds.filter((lid) => lid !== id),
        }));
      setNotes(updated);
      await saveNotes(updated);
    },
    [notes]
  );

  const linkNotes = useCallback(
    async (noteId: string, targetId: string) => {
      const updated = notes.map((n) => {
        if (n.id === noteId && !n.linkedNoteIds.includes(targetId)) {
          return { ...n, linkedNoteIds: [...n.linkedNoteIds, targetId], updatedAt: Date.now() };
        }
        if (n.id === targetId && !n.linkedNoteIds.includes(noteId)) {
          return { ...n, linkedNoteIds: [...n.linkedNoteIds, noteId], updatedAt: Date.now() };
        }
        return n;
      });
      setNotes(updated);
      await saveNotes(updated);
    },
    [notes]
  );

  const getNote = useCallback(
    (id: string) => notes.find((n) => n.id === id),
    [notes]
  );

  const searchNotes = useCallback(
    (query: string): Note[] => {
      if (!query.trim()) return notes;
      const q = query.toLowerCase();
      return notes.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q) ||
          n.summary.toLowerCase().includes(q) ||
          n.tags.some((t) => t.label.toLowerCase().includes(q))
      );
    },
    [notes]
  );

  const getNotesByTag = useCallback(
    (tagLabel: string): Note[] =>
      notes.filter((n) =>
        n.tags.some((t) => t.label.toLowerCase() === tagLabel.toLowerCase())
      ),
    [notes]
  );

  const getLinkedNotes = useCallback(
    (noteId: string): Note[] => {
      const note = notes.find((n) => n.id === noteId);
      if (!note) return [];
      return notes.filter((n) => note.linkedNoteIds.includes(n.id));
    },
    [notes]
  );

  const getAllTags = useCallback((): Tag[] => {
    const tagMap = new Map<string, Tag>();
    notes.forEach((n) =>
      n.tags.forEach((t) => {
        if (!tagMap.has(t.label)) tagMap.set(t.label, t);
      })
    );
    return Array.from(tagMap.values());
  }, [notes]);

  const stats: VaultStats = {
    totalNotes: notes.length,
    totalTags: getAllTags().length,
    totalLinks: notes.reduce((sum, n) => sum + n.linkedNoteIds.length, 0) / 2,
  };

  return (
    <VaultContext.Provider
      value={{
        notes,
        addNote,
        updateNote,
        deleteNote,
        linkNotes,
        getNote,
        searchNotes,
        getNotesByTag,
        getLinkedNotes,
        getAllTags,
        stats,
        isLoading,
      }}
    >
      {children}
    </VaultContext.Provider>
  );
}

export function useVault() {
  const ctx = useContext(VaultContext);
  if (!ctx) throw new Error("useVault must be used inside VaultProvider");
  return ctx;
}

function getSeedNotes(): Note[] {
  const now = Date.now();
  return [
    {
      id: "seed1",
      type: "text",
      title: "The Second Brain Framework",
      content:
        "Tiago Forte's Building a Second Brain methodology centers around CODE: Capture, Organize, Distill, and Express. The key insight is that our brains are for having ideas, not for storing them.",
      summary:
        "CODE framework: Capture relevant info, Organize by projects, Distill to key insights, Express by creating.",
      tags: [
        { id: "t1", label: "productivity", color: "blue" },
        { id: "t2", label: "knowledge", color: "purple" },
      ],
      createdAt: now - 86400000 * 5,
      updatedAt: now - 86400000 * 5,
      linkedNoteIds: ["seed2"],
    },
    {
      id: "seed2",
      type: "webclip",
      title: "Obsidian Graph View — How it Works",
      content:
        "Obsidian's graph view shows a visual map of all your notes and how they connect through backlinks. Nodes represent notes, edges represent connections. Clusters emerge organically.",
      summary:
        "Graph view visualizes note connections; clusters reveal knowledge domains.",
      tags: [
        { id: "t3", label: "obsidian", color: "purple" },
        { id: "t4", label: "PKM", color: "green" },
      ],
      sourceUrl: "https://obsidian.md/features",
      createdAt: now - 86400000 * 3,
      updatedAt: now - 86400000 * 3,
      linkedNoteIds: ["seed1", "seed3"],
    },
    {
      id: "seed3",
      type: "text",
      title: "RAG — Retrieval Augmented Generation",
      content:
        "RAG combines dense retrieval with generative AI. Instead of relying solely on parametric knowledge, the model retrieves relevant documents from a knowledge base and uses them as context.",
      summary:
        "RAG retrieves relevant docs at query time, grounding LLM responses in real knowledge.",
      tags: [
        { id: "t5", label: "AI", color: "blue" },
        { id: "t6", label: "RAG", color: "orange" },
      ],
      createdAt: now - 86400000 * 2,
      updatedAt: now - 86400000 * 2,
      linkedNoteIds: ["seed2"],
    },
    {
      id: "seed4",
      type: "text",
      title: "Atomic Notes Principle",
      content:
        "Each note should contain exactly one idea. When notes are atomic, they become reusable building blocks. Linking atomic notes creates emergent knowledge structures.",
      summary:
        "One idea per note — enables reuse and emergent connections.",
      tags: [
        { id: "t7", label: "PKM", color: "green" },
        { id: "t8", label: "zettelkasten", color: "purple" },
      ],
      createdAt: now - 86400000,
      updatedAt: now - 86400000,
      linkedNoteIds: ["seed1"],
    },
  ];
}
