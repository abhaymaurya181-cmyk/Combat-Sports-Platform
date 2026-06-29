import type { FastifyInstance, FastifyPluginOptions } from "fastify";

export async function fightersRoutes(
  fastify: FastifyInstance,
  _opts: FastifyPluginOptions
) {
  // GET /fighters — list all fighters (paginated)
  fastify.get(
    "/",
    {
      schema: {
        querystring: {
          type: "object",
          properties: {
            page: { type: "integer", default: 1 },
            limit: { type: "integer", default: 20 },
            organization: { type: "string" },
            weightClass: { type: "string" },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              data: { type: "array" },
              total: { type: "integer" },
              page: { type: "integer" },
              limit: { type: "integer" },
            },
          },
        },
      },
    },
    async (request, reply) => {
      // TODO: query @combat-sports/db and return fighters
      return reply.code(200).send({
        data: [],
        total: 0,
        page: 1,
        limit: 20,
      });
    }
  );

  // GET /fighters/:id — get a single fighter by ID
  fastify.get<{ Params: { id: string } }>(
    "/:id",
    {
      schema: {
        params: {
          type: "object",
          properties: {
            id: { type: "string" },
          },
          required: ["id"],
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      // TODO: fetch fighter by id from DB
      return reply.code(200).send({ id, placeholder: true });
    }
  );
}
