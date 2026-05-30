#!/usr/bin/env python3
"""
PCA Vault Validation Script
Validates Obsidian vault note frontmatter against _System/Vault Schema.md rules.

Usage:
    python validate_vault.py [vault_path] [--verbose]

Default vault_path: two levels up from this script (vault root).
Returns exit code 1 if any validation errors are found, 0 if clean.
"""

import argparse
import os
import re
import sys
from dataclasses import dataclass, field
from pathlib import Path
from typing import Optional

# --- Schema constants (from _System/Vault Schema.md) ---

VALID_NOTE_TYPES = {
    "capture", "concept", "reference", "decision", "project",
    "source", "moc", "daily", "system", "reflection", "task", "clipping"
}

VALID_STATUSES = {"inbox", "draft", "active", "canonical", "archived"}

VALID_SENSITIVITIES = {"public", "internal", "confidential", "restricted"}

REQUIRED_FIELDS = {"title", "note_type", "status"}

# Folders exempt from strict frontmatter requirements
EXEMPT_FOLDERS = {"30_Templates", "_ArchivePointers", "Templates"}

# File extensions to skip entirely
SKIP_EXTENSIONS = {".json", ".css", ".js", ".png", ".jpg",
                   ".jpeg", ".gif", ".pdf", ".py", ".sh", ".ps1"}


@dataclass
class ValidationResult:
    path: str
    errors: list[str] = field(default_factory=list)
    warnings: list[str] = field(default_factory=list)

    @property
    def valid(self) -> bool:
        return len(self.errors) == 0


def parse_frontmatter(content: str) -> Optional[dict]:
    """Extract key-value pairs from YAML frontmatter."""
    if not content.startswith("---"):
        return None
    end = content.find("\n---", 3)
    if end == -1:
        return None
    fm_text = content[3:end].strip()
    result: dict = {}
    for line in fm_text.splitlines():
        if ":" in line and not line.startswith(" ") and not line.startswith("-"):
            key, _, val = line.partition(":")
            key = key.strip()
            val = re.sub(r"\s*#.*$", "", val).strip().strip("'\"")
            if key and val:
                result[key] = val
    return result


def is_in_exempt_folder(path: Path, vault_root: Path) -> bool:
    try:
        rel = path.relative_to(vault_root)
    except ValueError:
        return False
    return bool(set(rel.parts[:-1]).intersection(EXEMPT_FOLDERS))


def validate_file(path: Path, vault_root: Path, verbose: bool = False) -> ValidationResult:
    result = ValidationResult(path=str(path.relative_to(vault_root)))

    try:
        content = path.read_text(encoding="utf-8", errors="replace")
    except Exception as exc:
        result.errors.append(f"Cannot read file: {exc}")
        return result

    if not content.strip():
        if verbose:
            result.warnings.append("File is empty")
        return result

    fm = parse_frontmatter(content)

    if fm is None:
        if not is_in_exempt_folder(path, vault_root):
            result.errors.append("Missing YAML frontmatter (--- block)")
        return result

    # Required fields
    for field_name in REQUIRED_FIELDS:
        if field_name not in fm:
            result.errors.append(f"Missing required field: '{field_name}'")

    # note_type validation
    if "note_type" in fm and fm["note_type"] not in VALID_NOTE_TYPES:
        result.errors.append(
            f"Invalid note_type '{fm['note_type']}'. "
            f"Valid values: {sorted(VALID_NOTE_TYPES)}"
        )

    # status validation
    if "status" in fm and fm["status"] not in VALID_STATUSES:
        result.errors.append(
            f"Invalid status '{fm['status']}'. "
            f"Valid values: {sorted(VALID_STATUSES)}"
        )

    # sensitivity validation (optional field)
    if "sensitivity" in fm and fm["sensitivity"] not in VALID_SENSITIVITIES:
        result.errors.append(
            f"Invalid sensitivity '{fm['sensitivity']}'. "
            f"Valid values: {sorted(VALID_SENSITIVITIES)}"
        )

    # source_of_truth mirror metadata check
    if fm.get("source_of_truth") == "false":
        if "mirror_status" not in fm:
            result.warnings.append(
                "source_of_truth=false but mirror_status not set"
            )

    # Recommended fields (warnings only)
    if verbose:
        for rec in ("created", "updated", "tags"):
            if rec not in fm:
                result.warnings.append(f"Recommended field missing: '{rec}'")

    return result


def should_skip(path: Path) -> bool:
    if path.suffix in SKIP_EXTENSIONS:
        return True
    # Skip hidden files and directories
    return any(part.startswith(".") for part in path.parts)


def validate_vault(vault_path: Path, verbose: bool = False) -> tuple[int, int]:
    """
    Validate all markdown files in vault_path.
    Returns (error_count, files_checked).
    """
    all_results: list[ValidationResult] = []
    files_checked = 0

    for md_file in sorted(vault_path.rglob("*.md")):
        if should_skip(md_file):
            continue
        files_checked += 1
        result = validate_file(md_file, vault_path, verbose=verbose)
        if not result.valid or (verbose and result.warnings):
            all_results.append(result)

    error_results = [r for r in all_results if not r.valid]
    warn_results = [r for r in all_results if r.valid and r.warnings]

    if error_results:
        print(f"\n{'=' * 60}")
        print(f"VALIDATION ERRORS ({len(error_results)} file(s))")
        print(f"{'=' * 60}")
        for r in error_results:
            print(f"\n  {r.path}")
            for e in r.errors:
                print(f"    ERROR: {e}")
            if verbose:
                for w in r.warnings:
                    print(f"    WARN:  {w}")

    if verbose and warn_results:
        print(f"\n{'=' * 60}")
        print(f"WARNINGS ({len(warn_results)} file(s))")
        print(f"{'=' * 60}")
        for r in warn_results:
            print(f"\n  {r.path}")
            for w in r.warnings:
                print(f"    WARN: {w}")

    total_errors = sum(len(r.errors) for r in error_results)
    print(
        f"\nResult: {files_checked} files checked — "
        f"{len(error_results)} with errors, "
        f"{len(warn_results)} with warnings, "
        f"{total_errors} total errors"
    )
    return total_errors, files_checked


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Validate PCA Obsidian vault frontmatter against Vault Schema rules."
    )
    parser.add_argument(
        "vault_path",
        nargs="?",
        default=str(Path(__file__).resolve().parent.parent.parent),
        help="Path to vault root (default: three levels up from script location)",
    )
    parser.add_argument(
        "--verbose", "-v",
        action="store_true",
        help="Show warnings and missing recommended fields in addition to errors",
    )
    args = parser.parse_args()

    vault_path = Path(args.vault_path).resolve()
    if not vault_path.is_dir():
        print(f"Error: '{vault_path}' is not a directory", file=sys.stderr)
        sys.exit(1)

    print(f"Validating vault: {vault_path}")
    error_count, _ = validate_vault(vault_path, verbose=args.verbose)
    sys.exit(1 if error_count > 0 else 0)


if __name__ == "__main__":
    main()
