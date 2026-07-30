import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import {
  TestimonialAdminListController,
  TestimonialCreateController,
  TestimonialDeleteController,
  TestimonialPublicListController,
  TestimonialStatusController,
  type TestimonialMutationRequest,
} from "../controllers/testimonial/Testimonial-controllers.js";
import { checkAdminAuth } from "../middleware/adminAuth.js";
import { checkAuth } from "../middleware/jwt.js";

const ErrorSchema = z.object({ status: z.literal("ERROR"), message: z.string() });
const StatusSchema = z.enum([ "PENDING", "APPROVED", "REJECTED" ]);
const TestimonialSchema = z.object({
  id: z.uuid(),
  author_name: z.string(),
  author_role: z.string().nullable(),
  company: z.string().nullable(),
  avatar: z.string().nullable(),
  content: z.string(),
  status: StatusSchema,
  approved_at: z.date().nullable(),
  created_at: z.date(),
  updated_at: z.date(),
});

export async function TestimonialRoutes(fastify: FastifyInstance) {
  const publicList = new TestimonialPublicListController();
  const adminList = new TestimonialAdminListController();
  const create = new TestimonialCreateController();
  const updateStatus = new TestimonialStatusController();
  const remove = new TestimonialDeleteController();
  const protectedRoute = { preHandler: [ checkAuth, checkAdminAuth ] };

  fastify.get("/testimonials", {
    schema: {
      tags: [ "Depoimentos" ],
      response: { 200: z.object({ testimonials: z.array(TestimonialSchema) }), 500: ErrorSchema },
    },
  }, (request, reply) => publicList.handle(request, reply));

  fastify.post("/testimonials", {
    schema: {
      tags: [ "Depoimentos" ],
      consumes: [ "multipart/form-data" ],
      response: {
        201: z.object({ message: z.string() }),
        400: ErrorSchema,
        500: ErrorSchema,
      },
    },
    config: { rateLimit: { max: 3, timeWindow: "1 hour" } },
  }, (request: FastifyRequest, reply: FastifyReply) =>
    create.handle(request, reply));

  fastify.get("/admin/testimonials", {
    ...protectedRoute,
    schema: {
      tags: [ "Depoimentos" ],
      security: [ { bearerAuth: [] } ],
      response: { 200: z.object({ testimonials: z.array(TestimonialSchema) }), 401: ErrorSchema, 500: ErrorSchema },
    },
  }, (request, reply) => adminList.handle(request, reply));

  fastify.patch("/testimonials/:testimonial_id/status", {
    ...protectedRoute,
    schema: {
      tags: [ "Depoimentos" ],
      security: [ { bearerAuth: [] } ],
      params: z.object({ testimonial_id: z.uuid() }),
      body: z.object({ status: StatusSchema }),
      response: { 200: z.object({ testimonial: TestimonialSchema }), 401: ErrorSchema, 404: ErrorSchema, 500: ErrorSchema },
    },
  }, (request: FastifyRequest, reply: FastifyReply) =>
    updateStatus.handle(request as FastifyRequest<TestimonialMutationRequest>, reply));

  fastify.delete("/testimonials/:testimonial_id", {
    ...protectedRoute,
    schema: {
      tags: [ "Depoimentos" ],
      security: [ { bearerAuth: [] } ],
      params: z.object({ testimonial_id: z.uuid() }),
      response: { 204: z.void(), 401: ErrorSchema, 404: ErrorSchema, 500: ErrorSchema },
    },
  }, (request: FastifyRequest, reply: FastifyReply) =>
    remove.handle(request as FastifyRequest<TestimonialMutationRequest>, reply));
}
