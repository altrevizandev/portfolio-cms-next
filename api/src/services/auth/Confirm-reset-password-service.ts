import { hash } from "bcryptjs";
import { createHash } from "node:crypto";
import type { AccountContract } from "../../contracts/AccountContract.js";
import type { ResetPasswordTokenContract } from "../../contracts/ResetPasswordTokenContract.js";
import type { ConfirmResetPasswordDTO } from "../../dtos/auth/ConfirmResetPasswordDTO.js";

import { ApiError } from "../../utils/ApiError.js";

export class ConfirmResetPasswordService {
  constructor(
    private readonly accountRepository: AccountContract,
    private readonly resetPasswordTokenRepository: ResetPasswordTokenContract,
  ) {}

  public async execute(input: ConfirmResetPasswordDTO) {
    const tokenHash = createHash("sha256").update(input.token).digest("hex");

    const resetPasswordToken = await this.resetPasswordTokenRepository.findValidByTokenHash({
      token_hash: tokenHash,
    });

    if (!resetPasswordToken) {
      throw new ApiError("Token invalido ou expirado", 400);
    }

    await this.accountRepository.changePassword({
      password: await hash(input.password, 12),
      account_id: resetPasswordToken.account.id,
    });

    await this.resetPasswordTokenRepository.markAsUsed({
      password_reset_token_id: resetPasswordToken.id,
    });
  }
}
