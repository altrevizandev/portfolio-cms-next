import type { AccountContract } from "../contracts/AccountContract.js";

import { prisma } from "../infra/prisma/index.js";
import type { PrismaTransactionClient } from "./index.js";

export class AccountRepository implements AccountContract {
  constructor(private readonly prismaClient: PrismaTransactionClient = prisma) {}

  public async create(input: { password: string; name: string; email: string; role_id: number }) {
    const account = this.prismaClient.account.create({
      data: {
        name: input.name,
        email: input.email,
        password: input.password,
        account_roles: { create: { role_id: input.role_id } },
      },
      select: {
        id: true,
        name: true,
        email: true,
        created_at: true,
        updated_at: true,
      },
    });

    return account;
  }

  public async findById(input: { account_id: number }) {
    const account = await this.prismaClient.account.findUnique({
      where: { id: input.account_id },
    });

    return account;
  }

  public async findByEmail(input: { email: string }) {
    const account = await this.prismaClient.account.findFirst({
      where: { email: input.email },
    });

    return account;
  }

  public async getAccountDetails(input: { account_id: number }) {
    const details = await this.prismaClient.accountRoles.findFirst({
      where: { account_id: input.account_id },
      include: {
        account: true,
        role: true,
      },
    });

    return details;
  }

  public async deleteById(input: { account_id: number }) {
    await this.prismaClient.account.delete({
      where: { id: input.account_id },
    });
  }

  public async changePassword(input: { password: string; account_id: number }) {
    const account = await this.prismaClient.account.update({
      where: { id: input.account_id },
      data: {
        password: input.password,
      },
    });

    return account;
  }

  public async list() {
    const accounts = await this.prismaClient.accountRoles.findMany({
      include: {
        account: {
          select: {
            id: true,
            name: true,
            email: true,
            created_at: true,
            updated_at: true,
          },
        },
        role: true,
      },
      orderBy: {
        account: {
          name: "asc",
        },
      },
    });

    return accounts;
  }

  public async update(input: { account_id: number; name: string; email: string; role_id: number }) {
    return await this.prismaClient.account.update({
      where: { id: input.account_id },
      data: {
        name: input.name,
        email: input.email,
        updated_at: new Date(),
        account_roles: {
          updateMany: { where: { account_id: input.account_id }, data: { role_id: input.role_id } },
        },
      },
    });
  }
}
