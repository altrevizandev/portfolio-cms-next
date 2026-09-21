import { compare } from "bcryptjs";
import type { AccountContract } from "../../contracts/AccountContract.js";
import type { AccountRoleContract } from "../../contracts/AccountRoleContract.js";
import type { LoginCodeContract } from "../../contracts/LoginCodeContract.js";
import type { VerifyCodeDTO } from "../../dtos/auth/VerifyCodeDTO.js";

import { ApiError } from "../../utils/ApiError.js";

export class VerifyCodeService {
  constructor(
    private readonly accountRepository: AccountContract,
    private readonly accountRoleRepository: AccountRoleContract,
    private readonly loginCodeRepository: LoginCodeContract,
  ) {}

  public async execute(input: VerifyCodeDTO) {
    const account = await this.accountRepository.findByEmail({ email: input.email });

    if (!account) {
      throw new ApiError("Codigo invalido ou expirado", 400);
    }

    const loginCode = await this.loginCodeRepository.findLastValidByAccountId({
      account_id: account.id,
    });

    if (!loginCode) {
      throw new ApiError("Codigo invalido ou expirado", 400);
    }

    const isValidCode = await compare(input.code, loginCode.code_hash);

    if (!isValidCode) {
      throw new ApiError("Codigo invalido ou expirado", 400);
    }

    await this.loginCodeRepository.markAsUsed({ login_code_id: loginCode.id });

    const accountRole = await this.accountRoleRepository.findByAccountId({
      account_id: account.id,
    });

    if (!accountRole) {
      throw new ApiError("Nenhuma funcao foi encontrada para essa conta", 404);
    }

    return {
      id: account.id,
      name: account.name,
      email: account.email,
      role: accountRole.role.slug,
      created_at: account.created_at,
      updated_at: account.updated_at,
    };
  }
}
