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
    "40_Reference": {"reference", "source", "clipping"},
    # Transitional capture taxonomy from OneDrive Remotely Save
    "10_Reflections": {"reflection", "concept", "note"},
    "20_Notes": {"note", "capture", "research"},
    "30_Clippings": {"clipping", "reference"},
    "40_Research": {"research", "note"},
    "50_Tasks": {"task", "project"},
    "60_Reference": {"reference", "source"},
    "70_Processed": {"output", "archived", "decision"},
}


def parse_frontmatter(text: str):
    if not text.startswith('---\n'):
        return {}
    end = text.find('\n---\n', 4)
    if end == -1:
        return {}
    block = text[4:end]
    data = {}
    for line in block.splitlines():
        if ':' in line and not line.startswith('  '):
            k, v = line.split(':', 1)
            data[k.strip()] = v.strip()
    return data


errors = []
for p in ROOT.rglob('*.md'):
    rel = p.relative_to(ROOT)
    if str(rel).startswith('.git') or str(rel).startswith('_System/scripts'):
        continue

    text = p.read_text(encoding='utf-8', errors='ignore')
    fm = parse_frontmatter(text)
    if not fm:
        continue

    sot = fm.get('source_of_truth', '')
    if sot not in {'true', 'false'}:
        errors.append(f"{rel}: missing/invalid source_of_truth")

    if sot == 'false' and 'canonical_source' not in text:
        errors.append(f"{rel}: mirror note missing canonical_source")

    parent = rel.parts[0] if rel.parts else ''
    note_type = fm.get('note_type', '')
    if parent in TAXONOMY and note_type and note_type not in TAXONOMY[parent]:
        allowed = ','.join(sorted(TAXONOMY[parent]))
        errors.append(f"{rel}: folder/type mismatch ({parent} vs note_type={note_type}; allowed={allowed})")

if errors:
    print('Vault validation failed:')
    for e in errors:
        print('-', e)
    raise SystemExit(1)

print('Vault validation passed')
