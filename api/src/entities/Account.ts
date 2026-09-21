import type { Account, AccountRoles, Role } from "../../prisma/generated/prisma/client.js";

export type AccountSummary = Pick<Account, "id" | "name" | "email" | "created_at" | "updated_at">;
export type AccountRoleDetails = AccountRoles & { account: Account; role: Role };
export type AccountListEntry = AccountRoles & {
  account: AccountSummary;
  role: Role;
};
