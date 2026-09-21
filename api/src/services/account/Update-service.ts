import type { AccountContract } from "../../contracts/AccountContract.js";
import type { AccountRoleContract } from "../../contracts/AccountRoleContract.js";
import type { RoleContract } from "../../contracts/RoleContract.js";
import type { AccountUpdateDTO } from "../../dtos/account/AccountUpdateDTO.js";

import { ApiError } from "../../utils/ApiError.js";

export class AccountUpdateService {
  constructor(
    private readonly accountRepository: AccountContract,
    private readonly accountRoleRepository: AccountRoleContract,
    private readonly roleRepository: RoleContract,
  ) {}

  public async execute(input: AccountUpdateDTO) {
    const accountExists = await this.accountRepository.findById({ account_id: input.account_id });

    if (!accountExists) {
      throw new ApiError("Conta não encontrada", 400);
    }

    const role = await this.roleRepository.findBySlug({ slug: input.role });

    if (!role) {
      throw new ApiError("Função não encontrada", 404);
    }

    const account_role = await this.accountRoleRepository.findByAccountId({
      account_id: input.account_id,
    });

    if (!account_role) {
      throw new ApiError("Nenhuma função encontrada para essa conta", 400);
    }

    const account = await this.accountRepository.update({
      account_id: input.account_id,
      name: input.name,
      email: input.email,
      role_id: role.id,
    });

    return {
      id: account.id,
      name: account.name,
      email: account.email,
      role: role.slug,
      created_at: account.created_at,
      updated_at: account.updated_at,
    };
  }
}
