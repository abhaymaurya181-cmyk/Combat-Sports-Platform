import type { FastifyInstance, FastifyPluginOptions } from "fastify";

export async function searchRoutes(
  fastify: FastifyInstance,
  _opts: FastifyPluginOptions
) {
  // GET /search — semantic search across fighters, events, fights
  fastify.get(
    "/",
    {
      schema: {
        querystring: {
          type: "object",
          required: ["q"],
          properties: {
            q: { type: "string", minLength: 1 },
            type: {
              type: "string",
              enum: ["all", "fighters", "events", "fights"],
              default: "all",
            },
            limit: { type: "integer", default: 10, maximum: 50 },
          },
        },
      },
    },
    async (request, reply) => {
      const { q, type, limit } = request.query as {
        q: string;
        type: string;
        limit: number;
      };

      // TODO: proxy query to AI service /search endpoint for vector similarity
      return reply.code(200).send({
        query: q,
        type,
        results: [],
        total: 0,
        limit,
      });
    }
  );

  // POST /search/semantic — vector similarity search
  fastify.post(
    "/semantic",
    {
      schema: {
        body: {
          type: "object",
          required: ["query"],
          properties: {
            query: { type: "string" },
            topK: { type: "integer", default: 5 },
            filter: {
              type: "object",
              properties: {
                organization: { type: "string" },
                weightClass: { type: "string" },
              },
            },
          },
        },
      },
    },
    async (_request, reply) => {
      // TODO: call AI service /search/semantic
      return reply.code(200).send({ results: [] });
    }
  );
}
