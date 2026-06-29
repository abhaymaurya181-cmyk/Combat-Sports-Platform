# Combat Sports Intelligence Platform

> An AI-powered platform for MMA fans across all major organizations

A full-stack monorepo delivering real-time fighter analytics, AI-powered rankings, semantic search, fantasy matchmaking, and live debate rooms — covering UFC, PFL, ONE Championship, Bellator, RIZIN, KSW, and more.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS, Clerk Auth |
| API Gateway | Fastify (Node.js), TypeScript |
| AI Service | FastAPI (Python 3.11), LangChain, LiteLLM |
| Realtime | Node.js, Socket.io, TypeScript |
| Database | PostgreSQL 16 + pgvector |
| Cache | Redis 7 |
| Queue | RabbitMQ 3.13 |
| Shared Packages | @combat-sports/types, @combat-sports/ui, @combat-sports/db (Prisma), @combat-sports/config |
| Observability | Prometheus, Grafana, Loki |
| Infra | GCP GCE (k3s), ArgoCD, Helm, Terraform, Cloudflare DNS |
| CI/CD | GitHub Actions, Docker, GCR |

---

## Repository Structure

```
combat-sports/
├── apps/
│   ├── web/                  # Next.js 14 frontend
│   ├── api-gateway/          # Fastify REST gateway
│   ├── ai-service/           # FastAPI AI/ML microservice
│   └── realtime-service/     # Socket.io debate & live rooms
├── packages/
│   ├── types/                # Shared TypeScript interfaces
│   ├── ui/                   # Shared React component library
│   ├── db/                   # Prisma schema + client singleton
│   └── config/               # ESLint + tsconfig base configs
├── infra/
│   ├── terraform/            # GCP provisioning (GCE k3s nodes)
│   ├── k8s/                  # Kubernetes manifests + ArgoCD
│   └── helm/                 # Helm charts per app
├── .github/workflows/        # CI + Docker build pipelines
├── docker-compose.yml        # Local dev infrastructure
└── turbo.json                # Turborepo task pipeline
```

---

## Getting Started

### Prerequisites

- Node.js >= 20
- pnpm >= 9
- Python 3.11
- Docker & Docker Compose

### 1. Clone the repository

```bash
git clone https://github.com/your-org/combat-sports-intelligence.git
cd combat-sports-intelligence
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment

```bash
cp .env.example .env
# Edit .env and fill in your API keys and credentials
```

### 4. Start infrastructure services

```bash
docker-compose up -d
```

This starts PostgreSQL (pgvector), Redis, RabbitMQ (UI at http://localhost:15672), Prometheus, Loki, and Grafana (at http://localhost:3001).

### 5. Run database migrations

```bash
pnpm db:migrate
pnpm db:generate
```

### 6. Start all apps in development mode

```bash
pnpm dev
```

| Service | URL |
|---|---|
| Web (Next.js) | http://localhost:3000 |
| API Gateway (Fastify) | http://localhost:4000 |
| AI Service (FastAPI) | http://localhost:8000 |
| Realtime (Socket.io) | http://localhost:5000 |
| RabbitMQ UI | http://localhost:15672 |
| Grafana | http://localhost:3001 |
| Prometheus | http://localhost:9090 |

---

## AI Service (Python)

```bash
cd apps/ai-service
python -m venv .venv
source .venv/bin/activate
pip install -e ".[dev]"
uvicorn main:app --reload --port 8000
```

---

## Infrastructure

See [`infra/terraform/README.md`](infra/terraform/README.md) for GCP provisioning steps and [`infra/k8s/argocd/install-notes.md`](infra/k8s/argocd/install-notes.md) for ArgoCD setup.

---
