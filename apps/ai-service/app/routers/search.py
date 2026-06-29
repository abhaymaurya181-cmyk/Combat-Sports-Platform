"""
Semantic search router — vector similarity search over fighters, events, fights.
Uses pgvector + LangChain embeddings.
"""

from fastapi import APIRouter, Query
from pydantic import BaseModel

router = APIRouter()


class SearchResult(BaseModel):
    id: str
    type: str  # "fighter" | "event" | "fight"
    title: str
    score: float
    metadata: dict


class SemanticSearchRequest(BaseModel):
    query: str
    top_k: int = 5
    filter_organization: str | None = None
    filter_weight_class: str | None = None


@router.get("/", summary="Text search across all entities")
async def search(
    q: str = Query(..., min_length=1, description="Search query"),
    limit: int = Query(default=10, le=50),
    entity_type: str = Query(default="all", description="all | fighters | events | fights"),
) -> dict:
    """
    Full-text + vector search across fighters, events, and fights.
    TODO: embed query with LangChain, query pgvector, return ranked results.
    """
    return {
        "query": q,
        "entity_type": entity_type,
        "results": [],
        "total": 0,
    }


@router.post("/semantic", summary="Pure vector similarity search")
async def semantic_search(payload: SemanticSearchRequest) -> dict:
    """
    Embed the user query and run cosine similarity search in pgvector.
    TODO: implement embedding via LiteLLM + pgvector SELECT.
    """
    return {
        "query": payload.query,
        "results": [],
        "top_k": payload.top_k,
    }
