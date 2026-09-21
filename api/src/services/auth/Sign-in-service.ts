import { compare, hash } from "bcryptjs";
import { randomInt } from "node:crypto";
import type { AccountContract } from "../../contracts/AccountContract.js";
import type { AccountRoleContract } from "../../contracts/AccountRoleContract.js";
import type { LoginCodeContract } from "../../contracts/LoginCodeContract.js";
import type { MailContract } from "../../contracts/MailContract.js";
import type { SignInDTO } from "../../dtos/auth/SignInDTO.js";

import { ApiError } from "../../utils/ApiError.js";

export class SignInService {
  constructor(
    private readonly accountRepository: AccountContract,
    private readonly accountRoleRepository: AccountRoleContract,
    private readonly loginCodeRepository: LoginCodeContract,
    private readonly sendEmailService: MailContract,
  ) {}

  public async execute(input: SignInDTO) {
    const account = await this.accountRepository.findByEmail({ email: input.email });

    if (!account) {
      throw new ApiError("E-mail ou senha invalidos", 404);
    }

    let hashed_password = await compare(input.password, account.password);

    if (!hashed_password) {
      throw new ApiError("E-mail ou senha invalidos", 404);
    }

    const accountRole = await this.accountRoleRepository.findByAccountId({
      account_id: account.id,
    });

    if (!accountRole) {
      throw new ApiError("Nenhuma função foi encontrada para essa conta", 404);
    }

    const code = this.generateCode();
    const expiresInMinutes = 5;
    const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);

    await this.loginCodeRepository.invalidateAccountCodes({ account_id: account.id });

    await this.loginCodeRepository.create({
      account_id: account.id,
      code_hash: await hash(code, 12),
      expires_at: expiresAt,
    });

    await this.sendEmailService.execute({
      template: "login-code",
      html: "",
      templateData: {
        account,
        code,
        expires_in_minutes: expiresInMinutes,
        portal_url: process.env.PORTAL_URL ?? "https://altrevizan.com.br",
      },
      from: process.env.MAIL_FROM!,
      to: account.email,
      replyTo: "",
      subject: "Seu código de acesso | Portfólio André Lucas Trevizan",
      attachments: [],
    });

    return {
      two_factor_required: true,
      email: account.email,
      expires_in_minutes: expiresInMinutes,
    };
  }

  private generateCode() {
    return String(randomInt(100000, 1000000));
  }
}
