import type { AccountRoleContract } from "../contracts/AccountRoleContract.js";
import { prisma } from "../infra/prisma/index.js";
import type { PrismaTransactionClient } from "./index.js";

export class AccountRoleRepository implements AccountRoleContract {
  constructor(private readonly prismaClient: PrismaTransactionClient = prisma) {}

  public async createAccountRole(input: { account_id: number; role_id: number }) {
    const account = this.prismaClient.accountRoles.create({
      data: {
        account_id: input.account_id,
        role_id: input.role_id,
      },
    });

    return account;
  }

  public async findByAccountId(input: { account_id: number }) {
    return await this.prismaClient.accountRoles.findFirst({
      where: { account_id: input.account_id },
      include: {
        role: true,
        account: true,
      },
    });
  }

  public async update(input: { account_role_id: number; role_id: number }) {
    return await this.prismaClient.accountRoles.update({
      where: {
        id: input.account_role_id,
      },
      data: {
        role_id: input.role_id,
      },
      include: {
        role: true,
        account: true,
      },
    });
  }
}
