import type { ResetPasswordTokenContract } from "../contracts/ResetPasswordTokenContract.js";
import { prisma } from "../infra/prisma/index.js";
import type { PrismaTransactionClient } from "./index.js";

export class ResetPasswordTokenRepository implements ResetPasswordTokenContract {
  constructor(private readonly prismaClient: PrismaTransactionClient = prisma) {}

  public async create(input: { account_id: number; token_hash: string; expires_at: Date }) {
    const resetPasswordToken = await this.prismaClient.passwordResetToken.create({
      data: {
        account_id: input.account_id,
        token_hash: input.token_hash,
        expires_at: input.expires_at,
      },
    });

    return resetPasswordToken;
  }

  public async invalidateAccountResetPasswordTokens(input: { account_id: number }) {
    await this.prismaClient.passwordResetToken.updateMany({
      where: {
        account_id: input.account_id,
        used_at: null,
      },
      data: {
        used_at: new Date(),
      },
    });
  }

  public async findValidByTokenHash(input: { token_hash: string }) {
    return await this.prismaClient.passwordResetToken.findFirst({
      where: {
        token_hash: input.token_hash,
        used_at: null,
        expires_at: {
          gt: new Date(),
        },
      },
      include: {
        account: true,
      },
    });
  }

  public async markAsUsed(input: { password_reset_token_id: number }) {
    await this.prismaClient.passwordResetToken.update({
      where: {
        id: input.password_reset_token_id,
      },
      data: {
        used_at: new Date(),
      },
    });
  }
}
