import type { LoginCodeContract } from "../contracts/LoginCodeContract.js";
import { prisma } from "../infra/prisma/index.js";
import type { PrismaTransactionClient } from "./index.js";

export class LoginCodeRepository implements LoginCodeContract {
  constructor(private readonly prismaClient: PrismaTransactionClient = prisma) {}

  public async create(input: { account_id: number; code_hash: string; expires_at: Date }) {
    const loginCode = await this.prismaClient.loginCode.create({
      data: {
        account_id: input.account_id,
        code_hash: input.code_hash,
        expires_at: input.expires_at,
      },
    });

    return loginCode;
  }

  public async invalidateAccountCodes(input: { account_id: number }) {
    await this.prismaClient.loginCode.updateMany({
      where: {
        account_id: input.account_id,
        used_at: null,
      },
      data: {
        used_at: new Date(),
      },
    });
  }

  public async findLastValidByAccountId(input: { account_id: number }) {
    const loginCode = await this.prismaClient.loginCode.findFirst({
      where: {
        account_id: input.account_id,
        used_at: null,
        expires_at: {
          gt: new Date(),
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return loginCode;
  }

  public async markAsUsed(input: { login_code_id: number }) {
    await this.prismaClient.loginCode.update({
      where: {
        id: input.login_code_id,
      },
      data: {
        used_at: new Date(),
      },
    });
  }
}
