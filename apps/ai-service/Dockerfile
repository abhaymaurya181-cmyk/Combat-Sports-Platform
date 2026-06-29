# syntax=docker/dockerfile:1.7
# Combat Sports Intelligence — FastAPI AI Service

FROM python:3.11-slim AS base

# Set environment
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

WORKDIR /app

# ─── System dependencies ──────────────────────────────────────────────────────
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# ─── Python dependencies ──────────────────────────────────────────────────────
FROM base AS deps

COPY pyproject.toml ./
RUN pip install --upgrade pip && \
    pip install -e "." --no-cache-dir

# ─── Production image ─────────────────────────────────────────────────────────
FROM base AS runner

# Create non-root user
RUN groupadd --gid 1001 appgroup && \
    useradd --uid 1001 --gid appgroup --shell /bin/bash --create-home appuser

WORKDIR /app

# Copy installed packages from deps stage
COPY --from=deps /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=deps /usr/local/bin /usr/local/bin

# Copy application source
COPY --chown=appuser:appgroup . .

USER appuser

EXPOSE 8000

# Use multiple workers in production; override UVICORN_WORKERS env var as needed
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2", "--proxy-headers"]
