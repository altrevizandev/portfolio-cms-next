import type { AccountRoles } from "../../prisma/generated/prisma/client.js";
import type { AccountRoleDetails } from "../entities/Account.js";

export interface AccountRoleContract {
  createAccountRole(input: { account_id: number; role_id: number }): Promise<AccountRoles>;
  findByAccountId(input: { account_id: number }): Promise<AccountRoleDetails | null>;
  update(input: { account_role_id: number; role_id: number }): Promise<AccountRoleDetails>;
}
