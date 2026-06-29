"""
LiteLLM router — centralised LLM provider abstraction.
Supports OpenAI, Anthropic Claude, and Google Gemini via a single interface.
"""

import os
from typing import Any

import litellm
from litellm import Router

# ─── Model aliases ────────────────────────────────────────────────────────────
MODEL_ALIASES = {
    "fast": "gemini/gemini-1.5-flash",
    "balanced": "openai/gpt-4o-mini",
    "powerful": "anthropic/claude-3-5-sonnet-20241022",
    "reasoning": "anthropic/claude-3-5-sonnet-20241022",
    "embeddings": "openai/text-embedding-3-small",
}

# ─── LiteLLM global config ───────────────────────────────────────────────────
litellm.set_verbose = os.getenv("LITELLM_VERBOSE", "false").lower() == "true"

_router: Router | None = None


def get_llm_router() -> Router:
    """
    Return the singleton LiteLLM Router, initialising it on first call.
    Reads API keys from environment variables.
    """
    global _router  # noqa: PLW0603
    if _router is not None:
        return _router

    model_list: list[dict[str, Any]] = [
        {
            "model_name": "fast",
            "litellm_params": {
                "model": MODEL_ALIASES["fast"],
                "api_key": os.environ.get("LITELLM_GEMINI_KEY", ""),
            },
        },
        {
            "model_name": "balanced",
            "litellm_params": {
                "model": MODEL_ALIASES["balanced"],
                "api_key": os.environ.get("LITELLM_OPENAI_KEY", ""),
            },
        },
        {
            "model_name": "powerful",
            "litellm_params": {
                "model": MODEL_ALIASES["powerful"],
                "api_key": os.environ.get("LITELLM_ANTHROPIC_KEY", ""),
            },
        },
    ]

    _router = Router(
        model_list=model_list,
        default_litellm_params={
            "timeout": 60,
            "max_retries": 2,
        },
        routing_strategy="latency-based-routing",
        fallbacks=[
            {"fast": ["balanced"]},
            {"balanced": ["powerful"]},
            {"powerful": ["balanced"]},
        ],
    )

    return _router


async def complete(
    prompt: str,
    model: str = "balanced",
    system: str | None = None,
    temperature: float = 0.7,
    max_tokens: int = 2048,
) -> str:
    """
    Convenience wrapper around LiteLLM Router completion.
    Resolves model aliases and returns the text content of the response.
    """
    router = get_llm_router()
    messages = []
    if system:
        messages.append({"role": "system", "content": system})
    messages.append({"role": "user", "content": prompt})

    response = await router.acompletion(
        model=model,
        messages=messages,
        temperature=temperature,
        max_tokens=max_tokens,
    )
    return str(response.choices[0].message.content)
