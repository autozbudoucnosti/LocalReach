#!/usr/bin/env python3
"""
PreToolUse hook — blocks Write or Edit tool calls targeting paths outside
the repo root. Enforces CLAUDE.md §1: stay inside the repo structure.

Exit codes:
  0  — allow
  2  — hard block (message printed to stdout is shown to the user)
"""
import json
import os
import sys


def main() -> None:
    try:
        payload = json.load(sys.stdin)
    except (json.JSONDecodeError, ValueError):
        sys.exit(0)  # Malformed input — do not block

    if payload.get("tool_name") not in ("Write", "Edit"):
        sys.exit(0)

    file_path = payload.get("tool_input", {}).get("file_path", "")
    if not file_path:
        sys.exit(0)

    try:
        resolved = os.path.realpath(os.path.abspath(file_path))
        repo_root = os.path.realpath(os.getcwd())
    except Exception:
        sys.exit(0)  # Cannot resolve paths — do not block

    # Allow if path is inside repo root
    if resolved.startswith(repo_root + os.sep) or resolved == repo_root:
        sys.exit(0)

    print(
        f"BLOCKED: Write target '{file_path}' is outside the repo root "
        f"('{repo_root}').\n"
        "Stay inside the repo structure. Ref: CLAUDE.md §1."
    )
    sys.exit(2)


if __name__ == "__main__":
    main()
