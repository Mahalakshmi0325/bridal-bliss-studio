from __future__ import annotations

from functools import wraps
from typing import Any, Callable, Iterable

from flask import g, jsonify, request

from config import Config
from utils.security import decode_access_token


def _get_bearer_token() -> str | None:
    auth = request.headers.get("Authorization", "")
    if not auth.startswith("Bearer "):
        return None
    return auth.replace("Bearer ", "", 1).strip()


def auth_required(cfg: Config) -> Callable[[Callable[..., Any]], Callable[..., Any]]:
    def decorator(fn: Callable[..., Any]) -> Callable[..., Any]:
        @wraps(fn)
        def wrapper(*args: Any, **kwargs: Any) -> Any:
            token = _get_bearer_token()
            if not token:
                return jsonify({"error": "Missing or invalid Authorization header"}), 401
            try:
                payload = decode_access_token(cfg, token)
            except Exception:
                return jsonify({"error": "Invalid or expired token"}), 401
            g.user_id = int(payload.get("sub"))
            g.role = str(payload.get("role"))
            return fn(*args, **kwargs)

        return wrapper

    return decorator


def roles_required(cfg: Config, roles: Iterable[str]) -> Callable[[Callable[..., Any]], Callable[..., Any]]:
    roles_set = {r.lower() for r in roles}

    def decorator(fn: Callable[..., Any]) -> Callable[..., Any]:
        @wraps(fn)
        @auth_required(cfg)
        def wrapper(*args: Any, **kwargs: Any) -> Any:
            role = str(getattr(g, "role", "")).lower()
            if role not in roles_set:
                return jsonify({"error": "Forbidden"}), 403
            return fn(*args, **kwargs)

        return wrapper

    return decorator

