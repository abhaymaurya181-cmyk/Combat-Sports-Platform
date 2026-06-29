import type { FastifyInstance, FastifyPluginOptions } from "fastify";

export async function rankingsRoutes(
  fastify: FastifyInstance,
  _opts: FastifyPluginOptions
) {
  // GET /rankings — get current AI-generated rankings
  fastify.get(
    "/",
    {
      schema: {
        querystring: {
          type: "object",
          properties: {
            organization: { type: "string" },
            weightClass: { type: "string" },
            type: {
              type: "string",
              enum: ["official", "ai", "pound-for-pound"],
              default: "ai",
            },
          },
        },
      },
    },
    async (_request, reply) => {
      // TODO: proxy to AI service or return cached rankings from DB
      return reply.code(200).send({
        rankings: [],
        generatedAt: new Date().toISOString(),
        type: "ai",
      });
    }
  );

  // POST /rankings/refresh — trigger a rankings refresh via AI service
  fastify.post(
    "/refresh",
    {
      schema: {
        body: {
          type: "object",
          properties: {
            weightClass: { type: "string" },
            organization: { type: "string" },
          },
        },
      },
    },
    async (_request, reply) => {
      // TODO: publish message to RabbitMQ to trigger AI ranking job
      return reply.code(202).send({
        message: "Ranking refresh job queued",
        jobId: crypto.randomUUID(),
      });
    }
  );
}
