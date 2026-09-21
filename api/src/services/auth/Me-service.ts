import type { AccountContract } from "../../contracts/AccountContract.js";
import type { AccountRoleContract } from "../../contracts/AccountRoleContract.js";
import type { MeDTO } from "../../dtos/auth/MeDTO.js";

import { ApiError } from "../../utils/ApiError.js";

export class MeService {
  constructor(
    private readonly accountRepository: AccountContract,
    private readonly accountRoleRepository: AccountRoleContract,
  ) {}

  public async execute(input: MeDTO) {
    const account = await this.accountRepository.findById({ account_id: input.account_id });

    if (!account) {
      throw new ApiError("Nenhuma conta foi encontrada", 500);
    }

    const accountRole = await this.accountRoleRepository.findByAccountId({
      account_id: input.account_id,
    });

    if (!accountRole) {
      throw new ApiError("Nenhuma função foi encontrada para essa conta", 404);
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
