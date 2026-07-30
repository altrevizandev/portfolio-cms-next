import { type FastifyInstance } from 'fastify';
import { AuthRoutes } from './routers/auth.routes.js';
import { AccountRoutes } from './routers/account.routes.js';
import { RolesRoutes } from './routers/role.routes.js';
import { HealthRoutes } from './routers/health.routes.js';
import { HomepageRoutes } from './routers/homepage.routes.js';
import { StackRoutes } from './routers/stack.routes.js';
import { ProjectRoutes } from './routers/project.routes.js';
import { CareerRoutes } from './routers/career.routes.js';
import { TestimonialRoutes } from './routers/testimonial.routes.js';
import { ContactRoutes } from './routers/contact.routes.js';

export async function router(fastify: FastifyInstance) {
  fastify.register(HealthRoutes);
  fastify.register(HomepageRoutes);
  fastify.register(StackRoutes);
  fastify.register(ProjectRoutes);
  fastify.register(CareerRoutes);
  fastify.register(TestimonialRoutes);
  fastify.register(ContactRoutes);
  fastify.register(AuthRoutes);
  fastify.register(AccountRoutes);
  fastify.register(RolesRoutes);
}
