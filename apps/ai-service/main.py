"""
Combat Sports Intelligence — AI Service
FastAPI application entry point.
"""

from contextlib import asynccontextmanager
from typing import AsyncIterator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import analysis, matchmaker, rankings, search


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    """Startup and shutdown lifecycle events."""
    # TODO: initialise DB connection pool, load LLM router, warm embedding model
    print("AI Service starting up...")
    yield
    print("AI Service shutting down...")


app = FastAPI(
    title="Combat Sports AI Service",
    description="Semantic search, fight analysis, AI rankings, and fantasy matchmaking.",
    version="0.0.1",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# ─── CORS ─────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:4000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Health Check ─────────────────────────────────────────────────────────────
@app.get("/health", tags=["meta"])
async def health_check() -> dict:
    return {
        "status": "ok",
        "service": "ai-service",
    }


# ─── Routers ──────────────────────────────────────────────────────────────────
app.include_router(search.router, prefix="/search", tags=["search"])
app.include_router(analysis.router, prefix="/analysis", tags=["analysis"])
app.include_router(rankings.router, prefix="/rankings", tags=["rankings"])
app.include_router(matchmaker.router, prefix="/matchmaker", tags=["matchmaker"])
