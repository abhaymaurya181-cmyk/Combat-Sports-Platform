"""
AI Rankings router — generates cross-promotional pound-for-pound rankings
using LLM analysis of fighter records, opponents, and performance metrics.
"""

from fastapi import APIRouter, Query
from pydantic import BaseModel

router = APIRouter()


class RankingsRefreshRequest(BaseModel):
    weight_class: str | None = None
    organization: str | None = None
    model: str = "auto"  # auto | gemini | claude | openai


@router.get("/", summary="Get current AI-generated rankings")
async def get_rankings(
    organization: str | None = Query(default=None),
    weight_class: str | None = Query(default=None),
    ranking_type: str = Query(default="ai", description="official | ai | pound-for-pound"),
    limit: int = Query(default=15, le=50),
) -> dict:
    """
    Return the latest AI-generated rankings, optionally filtered by org and weight class.
    TODO: query Ranking table from @combat-sports/db.
    """
    return {
        "rankings": [],
        "organization": organization,
        "weight_class": weight_class,
        "type": ranking_type,
        "generated_at": None,
    }


@router.post("/refresh", summary="Trigger a rankings recalculation job")
async def refresh_rankings(payload: RankingsRefreshRequest) -> dict:
    """
    Enqueue a rankings refresh job via RabbitMQ.
    The worker will pull fighter data, run LLM analysis, and persist results.
    TODO: publish to RabbitMQ exchange.
    """
    return {
        "message": "Rankings refresh job queued.",
        "weight_class": payload.weight_class,
        "organization": payload.organization,
        "model": payload.model,
    }


@router.get("/history/{fighter_id}", summary="Historical ranking positions for a fighter")
async def ranking_history(fighter_id: str) -> dict:
    """
    TODO: fetch historical Ranking records for a fighter from the DB.
    """
    return {"fighter_id": fighter_id, "history": []}
