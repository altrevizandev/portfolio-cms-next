import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import {
  ExperienceAdminListController,
  ExperienceCreateController,
  ExperienceDeleteController,
  ExperiencePublicListController,
  ExperienceUpdateController,
  type ExperienceMutationRequest,
} from "../controllers/experience/Experience-controllers.js";
import {
  EducationAdminListController,
  EducationCreateController,
  EducationDeleteController,
  EducationPublicListController,
  EducationUpdateController,
  type EducationMutationRequest,
} from "../controllers/education/Education-controllers.js";
import { checkAdminAuth } from "../middleware/adminAuth.js";
import { checkAuth } from "../middleware/jwt.js";

const ErrorSchema = z.object({
  status: z.literal("ERROR"),
  message: z.string(),
});

const commonFields = {
  start_date: z.iso.date(),
  end_date: z.iso.date().nullable().optional(),
  current: z.boolean(),
  sort_order: z.number().int().min(0),
  published: z.boolean(),
};

const ExperienceBodySchema = z.object({
  company: z.string().trim().min(1).max(120),
  role: z.string().trim().min(1).max(120),
  description: z.string().trim().min(1),
  ...commonFields,
});

const EducationBodySchema = z.object({
  institution: z.string().trim().min(1).max(160),
  course: z.string().trim().min(1).max(160),
  degree: z.string().trim().max(120).nullable().optional(),
  description: z.string().trim().nullable().optional(),
  ...commonFields,
});

const ExperienceSchema = z.object({
  id: z.uuid(),
  company: z.string(),
  role: z.string(),
  description: z.string(),
  start_date: z.date(),
  end_date: z.date().nullable(),
  current: z.boolean(),
  sort_order: z.number(),
  published: z.boolean(),
  created_at: z.date(),
  updated_at: z.date(),
});

const EducationSchema = z.object({
  id: z.uuid(),
  institution: z.string(),
  course: z.string(),
  degree: z.string().nullable(),
  description: z.string().nullable(),
  start_date: z.date(),
  end_date: z.date().nullable(),
  current: z.boolean(),
  sort_order: z.number(),
  published: z.boolean(),
  created_at: z.date(),
  updated_at: z.date(),
});

export async function CareerRoutes(fastify: FastifyInstance) {
  const experiencePublic = new ExperiencePublicListController();
  const experienceAdmin = new ExperienceAdminListController();
  const experienceCreate = new ExperienceCreateController();
  const experienceUpdate = new ExperienceUpdateController();
  const experienceDelete = new ExperienceDeleteController();
  const educationPublic = new EducationPublicListController();
  const educationAdmin = new EducationAdminListController();
  const educationCreate = new EducationCreateController();
  const educationUpdate = new EducationUpdateController();
  const educationDelete = new EducationDeleteController();
  const protectedRoute = { preHandler: [ checkAuth, checkAdminAuth ] };

  fastify.get("/experiences", {
    schema: {
      tags: [ "Carreira" ],
      response: { 200: z.object({ experiences: z.array(ExperienceSchema) }), 500: ErrorSchema },
    },
  }, (request, reply) => experiencePublic.handle(request, reply));

  fastify.get("/admin/experiences", {
    ...protectedRoute,
    schema: {
      tags: [ "Carreira" ],
      security: [ { bearerAuth: [] } ],
      response: { 200: z.object({ experiences: z.array(ExperienceSchema) }), 401: ErrorSchema, 500: ErrorSchema },
    },
  }, (request, reply) => experienceAdmin.handle(request, reply));

  fastify.post("/experiences", {
    ...protectedRoute,
    schema: {
      tags: [ "Carreira" ],
      security: [ { bearerAuth: [] } ],
      body: ExperienceBodySchema,
      response: { 201: z.object({ experience: ExperienceSchema }), 400: ErrorSchema, 401: ErrorSchema, 500: ErrorSchema },
    },
  }, (request: FastifyRequest, reply: FastifyReply) =>
    experienceCreate.handle(request as FastifyRequest<ExperienceMutationRequest>, reply));

  fastify.put("/experiences/:experience_id", {
    ...protectedRoute,
    schema: {
      tags: [ "Carreira" ],
      security: [ { bearerAuth: [] } ],
      params: z.object({ experience_id: z.uuid() }),
      body: ExperienceBodySchema,
      response: { 200: z.object({ experience: ExperienceSchema }), 400: ErrorSchema, 401: ErrorSchema, 404: ErrorSchema, 500: ErrorSchema },
    },
  }, (request: FastifyRequest, reply: FastifyReply) =>
    experienceUpdate.handle(request as FastifyRequest<ExperienceMutationRequest>, reply));

  fastify.delete("/experiences/:experience_id", {
    ...protectedRoute,
    schema: {
      tags: [ "Carreira" ],
      security: [ { bearerAuth: [] } ],
      params: z.object({ experience_id: z.uuid() }),
      response: { 204: z.void(), 401: ErrorSchema, 404: ErrorSchema, 500: ErrorSchema },
    },
  }, (request: FastifyRequest, reply: FastifyReply) =>
    experienceDelete.handle(request as FastifyRequest<ExperienceMutationRequest>, reply));

  fastify.get("/education", {
    schema: {
      tags: [ "Carreira" ],
      response: { 200: z.object({ education: z.array(EducationSchema) }), 500: ErrorSchema },
    },
  }, (request, reply) => educationPublic.handle(request, reply));

  fastify.get("/admin/education", {
    ...protectedRoute,
    schema: {
      tags: [ "Carreira" ],
      security: [ { bearerAuth: [] } ],
      response: { 200: z.object({ education: z.array(EducationSchema) }), 401: ErrorSchema, 500: ErrorSchema },
    },
  }, (request, reply) => educationAdmin.handle(request, reply));

  fastify.post("/education", {
    ...protectedRoute,
    schema: {
      tags: [ "Carreira" ],
      security: [ { bearerAuth: [] } ],
      body: EducationBodySchema,
      response: { 201: z.object({ education: EducationSchema }), 400: ErrorSchema, 401: ErrorSchema, 500: ErrorSchema },
    },
  }, (request: FastifyRequest, reply: FastifyReply) =>
    educationCreate.handle(request as FastifyRequest<EducationMutationRequest>, reply));

  fastify.put("/education/:education_id", {
    ...protectedRoute,
    schema: {
      tags: [ "Carreira" ],
      security: [ { bearerAuth: [] } ],
      params: z.object({ education_id: z.uuid() }),
      body: EducationBodySchema,
      response: { 200: z.object({ education: EducationSchema }), 400: ErrorSchema, 401: ErrorSchema, 404: ErrorSchema, 500: ErrorSchema },
    },
  }, (request: FastifyRequest, reply: FastifyReply) =>
    educationUpdate.handle(request as FastifyRequest<EducationMutationRequest>, reply));

  fastify.delete("/education/:education_id", {
    ...protectedRoute,
    schema: {
      tags: [ "Carreira" ],
      security: [ { bearerAuth: [] } ],
      params: z.object({ education_id: z.uuid() }),
      response: { 204: z.void(), 401: ErrorSchema, 404: ErrorSchema, 500: ErrorSchema },
    },
  }, (request: FastifyRequest, reply: FastifyReply) =>
    educationDelete.handle(request as FastifyRequest<EducationMutationRequest>, reply));
}
