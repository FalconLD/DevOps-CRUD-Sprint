"""Capa de acceso a datos. Conexión a PostgreSQL exclusivamente vía variables de entorno."""

import os
import time

import psycopg2
import psycopg2.extras
from psycopg2.pool import SimpleConnectionPool

_pool: SimpleConnectionPool | None = None


def _build_dsn() -> str:
    database_url = os.environ.get("DATABASE_URL")
    if database_url:
        return database_url

    host = os.environ.get("POSTGRES_HOST", "db")
    port = os.environ.get("POSTGRES_PORT", "5432")
    dbname = os.environ.get("POSTGRES_DB", "visitantes")
    user = os.environ.get("POSTGRES_USER", "postgres")
    password = os.environ.get("POSTGRES_PASSWORD", "")

    return f"host={host} port={port} dbname={dbname} user={user} password={password}"


def init_pool(retries: int = 10, delay_seconds: float = 2.0) -> None:
    """Crea el pool de conexiones, reintentando mientras Postgres termina de arrancar."""
    global _pool
    if _pool is not None:
        return

    dsn = _build_dsn()
    last_error: Exception | None = None
    for attempt in range(1, retries + 1):
        try:
            _pool = SimpleConnectionPool(minconn=1, maxconn=10, dsn=dsn)
            return
        except psycopg2.OperationalError as exc:
            last_error = exc
            time.sleep(delay_seconds)

    raise RuntimeError(f"No se pudo conectar a PostgreSQL tras {retries} intentos") from last_error


def close_pool() -> None:
    global _pool
    if _pool is not None:
        _pool.closeall()
        _pool = None


def _get_pool() -> SimpleConnectionPool:
    if _pool is None:
        raise RuntimeError("El pool de conexiones no ha sido inicializado")
    return _pool


def insert_visitante(nombre: str, correo: str, categoria_entrada: str) -> dict:
    conn = _get_pool().getconn()
    try:
        with conn:
            with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
                cur.execute(
                    """
                    INSERT INTO visitantes (nombre, correo, categoria_entrada)
                    VALUES (%s, %s, %s)
                    RETURNING id, nombre, correo, categoria_entrada, creado_en
                    """,
                    (nombre, correo, categoria_entrada),
                )
                return dict(cur.fetchone())
    finally:
        _get_pool().putconn(conn)


def list_visitantes() -> list[dict]:
    conn = _get_pool().getconn()
    try:
        with conn:
            with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
                cur.execute(
                    """
                    SELECT id, nombre, correo, categoria_entrada, creado_en
                    FROM visitantes
                    ORDER BY id ASC
                    """
                )
                return [dict(row) for row in cur.fetchall()]
    finally:
        _get_pool().putconn(conn)
