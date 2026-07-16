from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from psycopg2 import Error as Psycopg2Error

import db
from schemas import VisitanteCreate, VisitanteOut


@asynccontextmanager
async def lifespan(app: FastAPI):
    db.init_pool()
    yield
    db.close_pool()


app = FastAPI(title="API Visitantes - Centro Cultural Inteligente", lifespan=lifespan)


@app.get("/api/health")
def health() -> dict:
    return {"status": "ok"}


@app.post("/api/visitantes", response_model=VisitanteOut, status_code=201)
def crear_visitante(visitante: VisitanteCreate) -> dict:
    try:
        return db.insert_visitante(
            nombre=visitante.nombre,
            correo=visitante.correo,
            categoria_entrada=visitante.categoria_entrada,
        )
    except Psycopg2Error:
        raise HTTPException(status_code=500, detail="Error al registrar el visitante")


@app.get("/api/visitantes", response_model=list[VisitanteOut])
def listar_visitantes() -> list[dict]:
    try:
        return db.list_visitantes()
    except Psycopg2Error:
        raise HTTPException(status_code=500, detail="Error al consultar los visitantes")
