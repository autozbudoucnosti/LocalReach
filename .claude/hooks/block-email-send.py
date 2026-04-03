#!/usr/bin/env python3
"""
PreToolUse hook — blocks any Bash command that invokes an email-send endpoint.
Enforces CLAUDE.md §3: manual approval gate, no auto-send.

Exit codes:
  0  — allow
  2  — hard block (message printed to stdout is shown to the user)
"""
import json
import re
import sys

BLOCKED_PATTERNS = [
    r"\bsendEmail\b",
    r"resend\.emails\.send",
    r"api\.resend\.com",
    r"\boutreach-actions\b",
    r"lib/resend",
]


def main() -> None:
    try:
        payload = json.load(sys.stdin)
    except (json.JSONDecodeError, ValueError):
        sys.exit(0)  # Malformed input — do not block

    if payload.get("tool_name") != "Bash":
        sys.exit(0)

    command = payload.get("tool_input", {}).get("command", "")

    for pattern in BLOCKED_PATTERNS:
        if re.search(pattern, command, re.IGNORECASE):
            print(
                f"BLOCKED: Email-send pattern detected ({pattern!r}).\n"
                "All outreach must be drafted to outreach.md and sent manually.\n"
                "Ref: CLAUDE.md §3 — manual approval gate."
            )
            sys.exit(2)


if __name__ == "__main__":
    main()
