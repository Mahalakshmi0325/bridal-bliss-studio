from __future__ import annotations

from contextlib import contextmanager
from typing import Any, Generator, Iterable

import mysql.connector
from mysql.connector import pooling

from config import Config


_pool: pooling.MySQLConnectionPool | None = None


def init_db_pool(cfg: Config) -> None:
    global _pool
    if _pool is not None:
        return
    _pool = pooling.MySQLConnectionPool(
        pool_name=cfg.MYSQL_POOL_NAME,
        pool_size=cfg.MYSQL_POOL_SIZE,
        pool_reset_session=True,
        host=cfg.MYSQL_HOST,
        port=cfg.MYSQL_PORT,
        user=cfg.MYSQL_USER,
        password=cfg.MYSQL_PASSWORD,
        database=cfg.MYSQL_DATABASE,
        autocommit=False,
    )


def _get_pool() -> pooling.MySQLConnectionPool:
    if _pool is None:
        raise RuntimeError("DB pool is not initialized. Call init_db_pool() first.")
    return _pool


@contextmanager
def get_conn_cursor(dictionary: bool = True) -> Generator[tuple[Any, Any], None, None]:
    conn = _get_pool().get_connection()
    try:
        cur = conn.cursor(dictionary=dictionary)
        try:
            yield conn, cur
        finally:
            cur.close()
    finally:
        conn.close()


def fetch_one(query: str, params: Iterable[Any] | None = None) -> dict[str, Any] | None:
    with get_conn_cursor(dictionary=True) as (_, cur):
        cur.execute(query, params or ())
        row = cur.fetchone()
        return row


def fetch_all(query: str, params: Iterable[Any] | None = None) -> list[dict[str, Any]]:
    with get_conn_cursor(dictionary=True) as (_, cur):
        cur.execute(query, params or ())
        rows = cur.fetchall()
        return list(rows or [])


def execute(query: str, params: Iterable[Any] | None = None) -> int:
    with get_conn_cursor(dictionary=True) as (conn, cur):
        cur.execute(query, params or ())
        conn.commit()
        return int(cur.lastrowid or 0)


def execute_many(query: str, seq_params: list[tuple[Any, ...]]) -> int:
    with get_conn_cursor(dictionary=True) as (conn, cur):
        cur.executemany(query, seq_params)
        conn.commit()
        return int(cur.rowcount or 0)

