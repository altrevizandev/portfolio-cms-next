import type { FastifyReply, FastifyRequest } from "fastify";

export class SignOutController {
  public async handle(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    const isProduction = process.env.NODE_ENV === "production";

    reply.clearCookie('auth_token', {
      path: '/',
      ...(isProduction && {
        domain: ".altrevizan.com.br",
      }),
    });

    return reply.code(204).send({
      message: "Sessão encerrada com sucesso"
    });
  }
}
