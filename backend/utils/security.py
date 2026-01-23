from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Any

import jwt
from werkzeug.security import check_password_hash, generate_password_hash

from config import Config


def hash_password(password: str) -> str:
    return generate_password_hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    return check_password_hash(password_hash, password)


def create_access_token(cfg: Config, user_id: int, role: str) -> str:
    now = datetime.now(tz=timezone.utc)
    exp = now + timedelta(minutes=cfg.JWT_EXPIRES_MINUTES)
    payload = {
        "sub": str(user_id),
        "role": role,
        "iat": int(now.timestamp()),
        "exp": int(exp.timestamp()),
    }
    return jwt.encode(payload, cfg.JWT_SECRET, algorithm="HS256")


def decode_access_token(cfg: Config, token: str) -> dict[str, Any]:
    return jwt.decode(token, cfg.JWT_SECRET, algorithms=["HS256"])

