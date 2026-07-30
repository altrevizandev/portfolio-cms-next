import type {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import { z } from "zod";
import {
  StackCreateController,
  type StackCreateRequest,
} from "../controllers/stack/Create-controller.js";
import {
  StackDeleteController,
  type StackDeleteRequest,
} from "../controllers/stack/Delete-controller.js";
import {
  StackDetailsController,
  type StackDetailsRequest,
} from "../controllers/stack/Details-controller.js";
import { StackListController } from "../controllers/stack/List-controller.js";
import {
  StackUpdateController,
  type StackUpdateRequest,
} from "../controllers/stack/Update-controller.js";
import { checkAdminAuth } from "../middleware/adminAuth.js";
import { checkAuth } from "../middleware/jwt.js";

const StackSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  slug: z.string(),
  icon_slug: z.string().nullable(),
  color: z.string().nullable(),
  website: z.string().nullable(),
  created_at: z.date(),
  updated_at: z.date(),
});

const StackBodySchema = z.object({
  name: z.string().trim().min(1).max(80),
  slug: z.string().trim().min(1).max(100).optional(),
  icon_slug: z.string().trim().max(100).nullable().optional(),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "A cor deve estar no formato hexadecimal #RRGGBB")
    .nullable()
    .optional(),
  website: z.url().max(500).nullable().optional(),
});

const StackParamsSchema = z.object({
  stack_id: z.uuid(),
});

const ErrorResponseSchema = z.object({
  status: z.literal("ERROR"),
  message: z.string(),
});

export async function StackRoutes(fastify: FastifyInstance) {
  const listController = new StackListController();
  const detailsController = new StackDetailsController();
  const createController = new StackCreateController();
  const updateController = new StackUpdateController();
  const deleteController = new StackDeleteController();

  fastify.get(
    "/stacks",
    {
      schema: {
        tags: [ "Stacks" ],
        description: "Lista as stacks cadastradas",
        response: {
          200: z.object({ stacks: z.array(StackSchema) }),
          500: ErrorResponseSchema,
        },
      },
    },
    async (request, reply) => listController.handle(request, reply),
  );

  fastify.get(
    "/stacks/:stack_id",
    {
      schema: {
        tags: [ "Stacks" ],
        description: "Retorna os detalhes de uma stack",
        params: StackParamsSchema,
        response: {
          200: z.object({ stack: StackSchema }),
          404: ErrorResponseSchema,
          500: ErrorResponseSchema,
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) =>
      detailsController.handle(
        request as FastifyRequest<StackDetailsRequest>,
        reply,
      ),
  );

  fastify.post(
    "/stacks",
    {
      schema: {
        tags: [ "Stacks" ],
        description: "Cadastra uma stack",
        security: [ { bearerAuth: [] } ],
        body: StackBodySchema,
        response: {
          201: z.object({ stack: StackSchema }),
          400: ErrorResponseSchema,
          401: ErrorResponseSchema,
          409: ErrorResponseSchema,
          500: ErrorResponseSchema,
        },
      },
      preHandler: [ checkAuth, checkAdminAuth ],
    },
    async (request: FastifyRequest, reply: FastifyReply) =>
      createController.handle(
        request as FastifyRequest<StackCreateRequest>,
        reply,
      ),
  );

  fastify.put(
    "/stacks/:stack_id",
    {
      schema: {
        tags: [ "Stacks" ],
        description: "Atualiza uma stack",
        security: [ { bearerAuth: [] } ],
        params: StackParamsSchema,
        body: StackBodySchema,
        response: {
          200: z.object({ stack: StackSchema }),
          400: ErrorResponseSchema,
          401: ErrorResponseSchema,
          404: ErrorResponseSchema,
          409: ErrorResponseSchema,
          500: ErrorResponseSchema,
        },
      },
      preHandler: [ checkAuth, checkAdminAuth ],
    },
    async (request: FastifyRequest, reply: FastifyReply) =>
      updateController.handle(
        request as FastifyRequest<StackUpdateRequest>,
        reply,
      ),
  );

  fastify.delete(
    "/stacks/:stack_id",
    {
      schema: {
        tags: [ "Stacks" ],
        description: "Remove uma stack sem projetos vinculados",
        security: [ { bearerAuth: [] } ],
        params: StackParamsSchema,
        response: {
          204: z.void(),
          401: ErrorResponseSchema,
          404: ErrorResponseSchema,
          409: ErrorResponseSchema,
          500: ErrorResponseSchema,
        },
      },
      preHandler: [ checkAuth, checkAdminAuth ],
    },
    async (request: FastifyRequest, reply: FastifyReply) =>
      deleteController.handle(
        request as FastifyRequest<StackDeleteRequest>,
        reply,
      ),
  );
}
