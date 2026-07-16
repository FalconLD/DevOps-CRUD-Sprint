from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Response
from psycopg2 import Error as Psycopg2Error

import db
from schemas import VisitanteCreate, VisitanteOut, VisitanteUpdate


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


@app.put("/api/visitantes/{visitante_id}", response_model=VisitanteOut)
def actualizar_visitante(visitante_id: int, visitante: VisitanteUpdate) -> dict:
    try:
        updated = db.update_visitante(
            visitante_id=visitante_id,
            nombre=visitante.nombre,
            correo=visitante.correo,
            categoria_entrada=visitante.categoria_entrada,
        )
    except Psycopg2Error:
        raise HTTPException(status_code=500, detail="Error al actualizar el visitante")

    if updated is None:
        raise HTTPException(status_code=404, detail="Visitante no encontrado")
    return updated


@app.delete("/api/visitantes/{visitante_id}", status_code=204)
def eliminar_visitante(visitante_id: int) -> Response:
    try:
        deleted = db.delete_visitante(visitante_id)
    except Psycopg2Error:
        raise HTTPException(status_code=500, detail="Error al eliminar el visitante")

    if not deleted:
        raise HTTPException(status_code=404, detail="Visitante no encontrado")
    return Response(status_code=204)
