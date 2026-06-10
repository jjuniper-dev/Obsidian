export type CaptureType = "text" | "webclip" | "voice";

export type Tag = {
  id: string;
  label: string;
  color: "blue" | "green" | "purple" | "orange";
};

export type Note = {
  id: string;
  type: CaptureType;
  title: string;
  content: string;
  summary: string;
  tags: Tag[];
  sourceUrl?: string;
  createdAt: number;
  updatedAt: number;
  linkedNoteIds: string[];
};

export type VaultStats = {
  totalNotes: number;
  totalTags: number;
  totalLinks: number;
};
