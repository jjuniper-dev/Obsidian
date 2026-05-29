#!/usr/bin/env python3
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]

TAXONOMY = {
    # Canonical taxonomy
    "00_Inbox": {"capture", "review_queue", "note"},
    "01_Daily": {"daily"},
    "02_Projects": {"project", "task"},
    "03_Research": {"research", "note"},
    "04_Concepts": {"concept", "reflection"},
    "05_Themes": {"theme", "concept"},
    "06_People": {"person"},
    "07_Outputs": {"output", "decision"},
    "08_Media": {"media", "asset", "source", "reference"},
    "20_MOCs": {"moc"},
    "30_Templates": {
        "template",
        "capture",
        "concept",
        "daily",
        "decision",
        "reference",
        "research",
    },
    "40_Reference": {"reference", "source", "clipping"},
    "_System": {"system"},
    "90_Archive": {"archived", "archive", "capture", "concept", "daily", "decision", "note", "project", "reference", "research"},
    # Transitional capture taxonomy from OneDrive Remotely Save
    "10_Reflections": {"reflection", "concept", "note"},
    "20_Notes": {"note", "capture", "research"},
    "30_Clippings": {"clipping", "reference"},
    "40_Research": {"research", "note"},
    "50_Tasks": {"task", "project"},
    "60_Reference": {"reference", "source"},
    "70_Processed": {"output", "archived", "decision"},
}

REQUIRED_CANONICAL_SOURCE_FIELDS = ("repo", "path", "branch")


def parse_frontmatter(text: str):
    if not text.startswith("---\n"):
        return {}
    end = text.find("\n---\n", 4)
    if end == -1:
        return {}

    block = text[4:end]
    data = {}
    current_key = None
    for line in block.splitlines():
        if not line.strip() or line.lstrip().startswith("#"):
            continue
        if line.startswith("  ") and current_key:
            nested_line = line.strip()
            if ":" in nested_line:
                nested_key, nested_value = nested_line.split(":", 1)
                nested = data.get(current_key)
                if not isinstance(nested, dict):
                    nested = {}
                    data[current_key] = nested
                nested[nested_key.strip()] = nested_value.strip()
            continue
        if ":" in line:
            key, value = line.split(":", 1)
            current_key = key.strip()
            data[current_key] = value.strip()
    return data


def is_template(rel: Path):
    return rel.parts and rel.parts[0] == "30_Templates"


def validate_canonical_source(rel: Path, fm: dict):
    canonical_source = fm.get("canonical_source")
    if not isinstance(canonical_source, dict):
        return [f"{rel}: mirror note missing canonical_source object"]

    missing = [
        field
        for field in REQUIRED_CANONICAL_SOURCE_FIELDS
        if not canonical_source.get(field)
    ]
    if missing:
        return [f"{rel}: mirror note canonical_source missing populated field(s): {', '.join(missing)}"]
    return []


errors = []
for p in ROOT.rglob("*.md"):
    rel = p.relative_to(ROOT)
    rel_text = str(rel)
    if rel_text.startswith(".git") or rel_text.startswith("_System/scripts"):
        continue

    text = p.read_text(encoding="utf-8", errors="ignore")
    fm = parse_frontmatter(text)
    if not fm:
        continue

    parent = rel.parts[0] if rel.parts else ""
    note_type = fm.get("note_type", "")
    if parent in TAXONOMY and note_type and note_type not in TAXONOMY[parent]:
        allowed = ",".join(sorted(TAXONOMY[parent]))
        errors.append(f"{rel}: folder/type mismatch ({parent} vs note_type={note_type}; allowed={allowed})")

    if is_template(rel):
        continue

    sot = fm.get("source_of_truth", "")
    if sot not in {"true", "false"}:
        errors.append(f"{rel}: missing/invalid source_of_truth")
    elif sot == "false":
        errors.extend(validate_canonical_source(rel, fm))

if errors:
    print("Vault validation failed:")
    for e in errors:
        print("-", e)
    raise SystemExit(1)

print("Vault validation passed")
