import { type FastifyInstance } from 'fastify';
import { AuthRoutes } from './routers/auth.routes.js';
import { AccountRoutes } from './routers/account.routes.js';
import { RolesRoutes } from './routers/role.routes.js';
import { HealthRoutes } from './routers/health.routes.js';

export async function router(fastify: FastifyInstance) {
  fastify.register(HealthRoutes);
  fastify.register(AuthRoutes);
  fastify.register(AccountRoutes);
  fastify.register(RolesRoutes);
}
