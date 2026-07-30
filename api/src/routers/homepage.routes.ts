import type {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import { z } from "zod";
import { HomepageDetailsController } from "../controllers/homepage/Details-controller.js";
import { HomepageUpsertController } from "../controllers/homepage/Upsert-controller.js";
import { checkAdminAuth } from "../middleware/adminAuth.js";
import { checkAuth } from "../middleware/jwt.js";

const HomepageSchema = z.object({
  id: z.number(),
  headline: z.string(),
  subheadline: z.string().nullable(),
  biography: z.string(),
  primary_photo: z.string().nullable(),
  secondary_photo: z.string().nullable(),
  email: z.string().nullable(),
  github_url: z.string().nullable(),
  linkedin_url: z.string().nullable(),
  created_at: z.date(),
  updated_at: z.date(),
});

const ErrorResponseSchema = z.object({
  status: z.literal("ERROR"),
  message: z.string(),
});

export async function HomepageRoutes(fastify: FastifyInstance) {
  const homepageDetailsController = new HomepageDetailsController();
  const homepageUpsertController = new HomepageUpsertController();

  fastify.get(
    "/homepage",
    {
      schema: {
        tags: [ "Homepage" ],
        description: "Endpoint responsavel por retornar o conteudo da homepage",
        response: {
          200: z.object({ homepage: HomepageSchema }),
          404: ErrorResponseSchema,
          409: ErrorResponseSchema,
          500: ErrorResponseSchema,
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      return homepageDetailsController.handle(request, reply);
    },
  );

  fastify.put(
    "/homepage",
    {
      schema: {
        tags: [ "Homepage" ],
        description:
          "Endpoint responsavel por criar ou atualizar a homepage via multipart/form-data",
        security: [ { bearerAuth: [] } ],
        response: {
          200: z.object({ homepage: HomepageSchema }),
          400: ErrorResponseSchema,
          401: ErrorResponseSchema,
          409: ErrorResponseSchema,
          413: ErrorResponseSchema,
          415: ErrorResponseSchema,
          500: ErrorResponseSchema,
        },
      },
      preHandler: [ checkAuth, checkAdminAuth ],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      return homepageUpsertController.handle(request, reply);
    },
  );
}
