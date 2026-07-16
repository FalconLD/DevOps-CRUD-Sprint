"""Contrato JSON acordado en Documentacion/MapaGeneralDelProyecto.md."""

from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


class VisitanteCreate(BaseModel):
    nombre: str = Field(min_length=1, max_length=100)
    correo: EmailStr
    categoria_entrada: str = Field(min_length=1, max_length=50)


class VisitanteUpdate(VisitanteCreate):
    """Body de actualización; mismos campos que el alta."""


class VisitanteOut(BaseModel):
    id: int
    nombre: str
    correo: str
    categoria_entrada: str
    creado_en: datetime
