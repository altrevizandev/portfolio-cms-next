import { hash } from "bcryptjs";
import type { AccountContract } from "../../contracts/AccountContract.js";
import type { ChangePasswordDTO } from "../../dtos/auth/ChangePasswordDTO.js";

import { ApiError } from "../../utils/ApiError.js";

export class ChangePasswordService {
  constructor(private readonly accountRepository: AccountContract) {}

  public async execute(input: ChangePasswordDTO) {
    const account = await this.accountRepository.findById({ account_id: input.account_id });

    if (!account) {
      throw new ApiError("Conta não encontrada", 500);
    }

    await this.accountRepository.changePassword({
      password: await hash(input.password, 12),
      account_id: input.account_id,
    });
  }
}
