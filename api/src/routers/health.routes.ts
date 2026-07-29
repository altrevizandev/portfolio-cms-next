import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../infra/prisma/index.js";

const HealthResponseSchema = z.object({
  status: z.enum([ "ok", "error" ]),
  uptime: z.object({
    seconds: z.number(),
    formatted: z.string(),
  }),
  database: z.object({
    status: z.enum([ "connected", "disconnected" ]),
    response_time_ms: z.number(),
  }),
});

function formatUptime(totalSeconds: number) {
  const days = Math.floor(totalSeconds / 86_400);
  const hours = Math.floor((totalSeconds % 86_400) / 3_600);
  const minutes = Math.floor((totalSeconds % 3_600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

export async function HealthRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/health",
    {
      schema: {
        tags: [ "Health" ],
        description: "Endpoint responsavel por verificar a saude da API e do banco de dados",
        response: {
          200: HealthResponseSchema,
          503: HealthResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const uptime = process.uptime();
      const databaseCheckStartedAt = performance.now();

      try {
        await prisma.$queryRaw`SELECT 1`;

        return reply.code(200).send({
          status: "ok",
          uptime: {
            seconds: Math.floor(uptime),
            formatted: formatUptime(uptime),
          },
          database: {
            status: "connected",
            response_time_ms: Math.round(performance.now() - databaseCheckStartedAt),
          },
        });
      } catch (error) {
        request.log.error({ err: error }, "Database health check failed");

        return reply.code(503).send({
          status: "error",
          uptime: {
            seconds: Math.floor(uptime),
            formatted: formatUptime(uptime),
          },
          database: {
            status: "disconnected",
            response_time_ms: Math.round(performance.now() - databaseCheckStartedAt),
          },
        });
      }
    },
  );
}
