import type { FastifyReply, FastifyRequest } from "fastify";
import { VerifyCodeService } from "../../services/auth/Verify-code-service.js";

type VerifyCodeData = {
  email: string
  code: string
}

export type VerifyCodeRequest = {
  Body: VerifyCodeData
}

export class VerifyCodeController {
  private readonly verifyCodeService: VerifyCodeService;

  constructor() {
    this.verifyCodeService = new VerifyCodeService();
  }

  public async handle(request: FastifyRequest<VerifyCodeRequest>, reply: FastifyReply) {
    const {
      email,
      code
    } = request.body;

    this.verifyCodeService.email = email;
    this.verifyCodeService.code = code;

    const account = await this.verifyCodeService.execute();

    const token = request.server.jwt.sign({
      sub: account.id,
      role: account.role
    }, {
      expiresIn: '1h'
    });

    const isProduction = process.env.NODE_ENV === "production";

    return reply.code(200).cookie('auth_token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 60 * 60,
      path: '/',
      ...(isProduction && {
        domain: ".altrevizan.com.br",
      }),
    }).send({
      account,
    });
  }
}
