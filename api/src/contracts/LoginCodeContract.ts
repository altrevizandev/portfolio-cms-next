import type { LoginCode } from "../../prisma/generated/prisma/client.js";

export interface LoginCodeContract {
  create(input: { account_id: number; code_hash: string; expires_at: Date }): Promise<LoginCode>;
  invalidateAccountCodes(input: { account_id: number }): Promise<void>;
  findLastValidByAccountId(input: { account_id: number }): Promise<LoginCode | null>;
  markAsUsed(input: { login_code_id: number }): Promise<void>;
}
