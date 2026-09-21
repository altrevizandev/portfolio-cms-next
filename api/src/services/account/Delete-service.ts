import type { AccountContract } from "../../contracts/AccountContract.js";
import type { AccountDeleteDTO } from "../../dtos/account/AccountDeleteDTO.js";

import { ApiError } from "../../utils/ApiError.js";

export class AccountDeleteService {
  constructor(private readonly accountRepository: AccountContract) {}

  public async execute(input: AccountDeleteDTO) {
    const accountExists = await this.accountRepository.findById({ account_id: input.account_id });

    if (!accountExists) {
      throw new ApiError("Conta nao encontrada", 400);
    }

    await this.accountRepository.deleteById({ account_id: input.account_id });
  }
}
