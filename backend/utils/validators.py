from __future__ import annotations

import re


EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


def require_fields(data: dict, fields: list[str]) -> tuple[bool, str | None]:
    for f in fields:
        if f not in data or data[f] is None or str(data[f]).strip() == "":
            return False, f"Missing field: {f}"
    return True, None


def is_valid_email(email: str) -> bool:
    return bool(EMAIL_RE.match(email.strip().lower()))

