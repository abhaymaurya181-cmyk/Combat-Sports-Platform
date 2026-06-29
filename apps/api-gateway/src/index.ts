import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import { fightersRoutes } from "./routes/fighters";
import { rankingsRoutes } from "./routes/rankings";
import { searchRoutes } from "./routes/search";

const PORT = parseInt(process.env.PORT ?? "4000", 10);
const HOST = process.env.HOST ?? "0.0.0.0";
const IS_PROD = process.env.NODE_ENV === "production";

const server = Fastify({
  logger: {
    level: IS_PROD ? "info" : "debug",
    transport: IS_PROD
      ? undefined
      : {
          target: "pino-pretty",
          options: { colorize: true, translateTime: "HH:MM:ss Z" },
        },
  },
});

async function bootstrap() {
  // ─── Security ──────────────────────────────────────────────────────────────
  await server.register(helmet, {
    contentSecurityPolicy: false,
  });

  await server.register(cors, {
    origin: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    credentials: true,
  });

  await server.register(rateLimit, {
    max: 100,
    timeWindow: "1 minute",
  });

  // ─── Health check ─────────────────────────────────────────────────────────
  server.get("/health", async (_request, reply) => {
    return reply.code(200).send({
      status: "ok",
      service: "api-gateway",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  // ─── Routes ───────────────────────────────────────────────────────────────
  await server.register(fightersRoutes, { prefix: "/fighters" });
  await server.register(rankingsRoutes, { prefix: "/rankings" });
  await server.register(searchRoutes, { prefix: "/search" });

  // ─── Start ────────────────────────────────────────────────────────────────
  try {
    await server.listen({ port: PORT, host: HOST });
    server.log.info(`API Gateway listening on http://${HOST}:${PORT}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

bootstrap();
