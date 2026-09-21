import { createHash, randomBytes } from "node:crypto";
import type { AccountContract } from "../../contracts/AccountContract.js";
import type { MailContract } from "../../contracts/MailContract.js";
import type { ResetPasswordTokenContract } from "../../contracts/ResetPasswordTokenContract.js";
import type { SendResetPasswordLinkDTO } from "../../dtos/auth/SendResetPasswordLinkDTO.js";

export class SendResetPasswordLinkService {
  constructor(
    private readonly accountRepository: AccountContract,
    private readonly resetPasswordTokenRepository: ResetPasswordTokenContract,
    private readonly sendEmailService: MailContract,
  ) {}

  public async execute(input: SendResetPasswordLinkDTO) {
    const account = await this.accountRepository.findByEmail({ email: input.email });

    if (!account) {
      return;
    }

    const token = this.generateToken();
    const expiresInMinutes = 5;
    const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);

    await this.resetPasswordTokenRepository.invalidateAccountResetPasswordTokens({
      account_id: account.id,
    });

    await this.resetPasswordTokenRepository.create({
      account_id: account.id,
      token_hash: createHash("sha256").update(token).digest("hex"),
      expires_at: expiresAt,
    });

    await this.sendEmailService.execute({
      template: "reset-password",
      html: "",
      templateData: {
        account,
        token,
        portal_url: process.env.PORTAL_URL ?? "https://altrevizan.com.br",
        expires_in_minutes: expiresInMinutes,
      },
      from: process.env.MAIL_FROM!,
      to: input.email,
      replyTo: "",
      subject: "Redefinição de senha | Portfólio André Lucas Trevizan",
      attachments: [],
    });
  }

  private generateToken() {
    return randomBytes(32).toString("base64url");
  }
}
