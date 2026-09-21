import type { Account } from "../../prisma/generated/prisma/client.js";
import type { AccountListEntry, AccountRoleDetails, AccountSummary } from "../entities/Account.js";

export interface AccountContract {
  create(input: {
    password: string;
    name: string;
    email: string;
    role_id: number;
  }): Promise<AccountSummary>;
  findById(input: { account_id: number }): Promise<Account | null>;
  findByEmail(input: { email: string }): Promise<Account | null>;
  getAccountDetails(input: { account_id: number }): Promise<AccountRoleDetails | null>;
  deleteById(input: { account_id: number }): Promise<void>;
  changePassword(input: { password: string; account_id: number }): Promise<Account>;
  list(): Promise<AccountListEntry[]>;
  update(input: {
    account_id: number;
    name: string;
    email: string;
    role_id: number;
  }): Promise<Account>;
}
