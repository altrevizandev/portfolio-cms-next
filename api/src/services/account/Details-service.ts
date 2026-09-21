import type { AccountRoleContract } from "../../contracts/AccountRoleContract.js";
import type { AccountDetailsDTO } from "../../dtos/account/AccountDetailsDTO.js";

import { ApiError } from "../../utils/ApiError.js";

export class AccountDetailsService {
  constructor(private readonly accountRoleRepository: AccountRoleContract) {}

  public async execute(input: AccountDetailsDTO) {
    const dbData = await this.accountRoleRepository.findByAccountId({
      account_id: input.account_id,
    });

    if (!dbData) {
      throw new ApiError("Conta não encontrada", 400);
    }

    const { account, role } = dbData;

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
