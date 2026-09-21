import type { Account, PasswordResetToken } from "../../prisma/generated/prisma/client.js";

export interface ResetPasswordTokenContract {
  create(input: {
    account_id: number;
    token_hash: string;
    expires_at: Date;
  }): Promise<PasswordResetToken>;
  invalidateAccountResetPasswordTokens(input: { account_id: number }): Promise<void>;
  findValidByTokenHash(input: {
    token_hash: string;
  }): Promise<(PasswordResetToken & { account: Account }) | null>;
  markAsUsed(input: { password_reset_token_id: number }): Promise<void>;
}
