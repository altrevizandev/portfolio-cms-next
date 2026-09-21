import type { FastifyReply, FastifyRequest } from "fastify";
import { makeSignInService } from "../../factories/auth/make-services.js";
import { SignInService } from "../../services/auth/Sign-in-service.js";
import { VerifyRecaptchaService } from "../../services/security/Verify-recaptcha-service.js";

type SignInData = {
  email: string;
  password: string;
  recaptcha_token: string;
};

export type SignInRequest = {
  Body: SignInData;
};

export class SignInController {
  private readonly signInService: SignInService;
  private readonly verifyRecaptchaService: VerifyRecaptchaService;

  constructor() {
    this.signInService = makeSignInService();
    this.verifyRecaptchaService = new VerifyRecaptchaService();
  }

  public async handle(request: FastifyRequest<SignInRequest>, reply: FastifyReply) {
    const { email, password, recaptcha_token } = request.body;

    await this.verifyRecaptchaService.execute({
      token: recaptcha_token,
      expected_action: "sign_in",
    });

    const result = await this.signInService.execute({ email: email, password: password });

    return reply.code(200).send(result);
  }
}
