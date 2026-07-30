import type {
  FastifyInstance,
  FastifyReply,
  FastifyRequest
} from "fastify";
import { z } from 'zod';
import { CreateAccountController, type CreateAccountRequest } from "../controllers/account/Create-controller.js";
import { checkAuth } from "../middleware/jwt.js";
import { checkAdminAuth } from "../middleware/adminAuth.js";
import { ListAccountsController } from "../controllers/account/List-controller.js";
import { AccountDetailsController, type AccountDetailsControllerRequest } from "../controllers/account/Details-controller.js";
import { AccountUpdateController, type AccountUpdateRequest } from "../controllers/account/Update-controller.js";
import { AccountDeleteController, type AccountDeleteRequest } from "../controllers/account/Delete-controller.js";

export async function AccountRoutes(
  fastify: FastifyInstance
) {
  const createAccountController = new CreateAccountController();
  const listAccountsController = new ListAccountsController();
  const accountDetailsController = new AccountDetailsController();
  const accountUpdateController = new AccountUpdateController();
  const accountDeleteController = new AccountDeleteController();

  const ErrorResponseSchema = z.object({
    status: z.literal("ERROR"),
    message: z.string()
  });

  fastify.post(
    "/account",
    {
      schema: {
        tags: ["Contas de Acesso"],
        description: "Endpoint responsável por criar uma conta",
        body: z.object({
          name: z.string(),
          email: z.string(),
          role: z.enum(["admin"]),
        }),
        response: {
          201: z.object({
            account: z.object({
              id: z.number(),
              name: z.string(),
              email: z.string(),
              cnpj_root: z.string(),
              created_at: z.date(),
              updated_at: z.date(),
            })
          }),

          400: ErrorResponseSchema,

          500: ErrorResponseSchema
        }
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      return createAccountController.handle(request as FastifyRequest<CreateAccountRequest>, reply);
    }
  );
  
  fastify.put(
    "/account",
    {
      schema: {
        tags: ["Contas de Acesso"],
        description: "Endpoint responsável por atualizar uma conta",
        security: [
          {
            bearerAuth: []
          }
        ],
        body: z.object({
          account_id: z.number(),
          name: z.string(),
          email: z.string(),
          role: z.enum(["admin"])
        }),
        response: {
          200: z.object({
            account: z.object({
              id: z.number(),
              name: z.string(),
              email: z.string(),
              role: z.string(),
              created_at: z.date(),
              updated_at: z.date(),
            }),
          }),

          400: ErrorResponseSchema,

          500: ErrorResponseSchema
        }
      },
      preHandler: [ checkAuth, checkAdminAuth ],  
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      return accountUpdateController.handle(request as FastifyRequest<AccountUpdateRequest>, reply);
    }
  );
  
  fastify.get(
    "/account",
    {
      schema: {
        tags: ["Contas de Acesso"],
        description: "Endpoint responsável por buscar as contas de usuário",
        security: [
          {
            bearerAuth: []
          }
        ],
        response: {
          200: z.array(
            z.object({
              id: z.number(),
              name: z.string(),
              email: z.string(),
              role: z.string(),
              created_at: z.date(),
              updated_at: z.date(),
            })
          ),

          400: ErrorResponseSchema,

          500: ErrorResponseSchema
        }
      },
      preHandler: [ checkAuth, checkAdminAuth ],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      return listAccountsController.handle(request, reply);
    }
  );
  
  fastify.get(
    "/account/:account_id/details",
    {
      schema: {
        tags: ["Contas de Acesso"],
        description: "Endpoint responsável por retornar os detalhes de uma conta",
        security: [
          {
            bearerAuth: []
          }
        ],
        response: {
          200: z.object({
            account: z.object({
              id: z.number(),
              name: z.string(),
              email: z.string(),
              role: z.string(),
              created_at: z.date(),
              updated_at: z.date(),
            }),
          }),

          400: ErrorResponseSchema,

          500: ErrorResponseSchema
        }
      },
      preHandler: [ checkAuth, checkAdminAuth ],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      return accountDetailsController.handle(request as FastifyRequest<AccountDetailsControllerRequest>, reply);
    }
  );
  
  fastify.delete(
    "/account/:account_id",
    {
      schema: {
        tags: ["Contas de Acesso"],
        description: "Endpoint responsável por deletar uma conta",
        security: [
          {
            bearerAuth: []
          }
        ],
        params: z.object({
          account_id: z.coerce.number()
        }),
        response: {
          204: z.void(),

          400: ErrorResponseSchema,

          500: ErrorResponseSchema
        }
      },
      preHandler: [ checkAuth, checkAdminAuth ],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      return accountDeleteController.handle(request as FastifyRequest<AccountDeleteRequest>, reply);
    }
  );
}
