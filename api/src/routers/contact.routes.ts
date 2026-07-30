import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { SendContactController } from "../controllers/contact/Send-contact-controller.js";

export async function ContactRoutes(fastify: FastifyInstance) {
  const controller = new SendContactController();
  const ErrorSchema = z.object({ status: z.literal("ERROR"), message: z.string() });

  fastify.post("/contact", {
    schema: {
      tags: [ "Contato" ],
      consumes: [ "multipart/form-data" ],
      response: {
        202: z.object({ message: z.string() }),
        400: ErrorSchema,
        413: ErrorSchema,
        415: ErrorSchema,
        500: ErrorSchema,
      },
    },
    config: { rateLimit: { max: 3, timeWindow: "1 hour" } },
  }, (request, reply) => controller.handle(request, reply));
}
