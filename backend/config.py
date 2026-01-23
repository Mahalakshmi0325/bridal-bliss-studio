import os
from dataclasses import dataclass

from dotenv import load_dotenv


load_dotenv()


def _env(name: str, default: str | None = None) -> str:
    v = os.getenv(name)
    if v is None or v == "":
        if default is None:
            raise RuntimeError(f"Missing required environment variable: {name}")
        return default
    return v


@dataclass(frozen=True)
class Config:
    APP_HOST: str = os.getenv("APP_HOST", "0.0.0.0")
    APP_PORT: int = int(os.getenv("APP_PORT", "5000"))
    FLASK_DEBUG: bool = os.getenv("FLASK_DEBUG", "0") == "1"

    JWT_SECRET: str = _env("JWT_SECRET", "CHANGE_ME_SUPER_SECRET")
    JWT_EXPIRES_MINUTES: int = int(os.getenv("JWT_EXPIRES_MINUTES", "10080"))

    MYSQL_HOST: str = _env("MYSQL_HOST", "127.0.0.1")
    MYSQL_PORT: int = int(os.getenv("MYSQL_PORT", "3306"))
    MYSQL_USER: str = _env("MYSQL_USER", "root")
    MYSQL_PASSWORD: str = _env("MYSQL_PASSWORD", "")
    MYSQL_DATABASE: str = _env("MYSQL_DATABASE", "moonlight_elegance")
    MYSQL_POOL_NAME: str = os.getenv("MYSQL_POOL_NAME", "moonlight_pool")
    MYSQL_POOL_SIZE: int = int(os.getenv("MYSQL_POOL_SIZE", "10"))

    CORS_ORIGINS: str = os.getenv("CORS_ORIGINS", "*")

