import { AccountRepository } from "../../repositories/Account-repository.js";
import { ApiError } from "../../utils/ApiError.js";

export class AccountDeleteService {
  public account_id: number = 0;

  private readonly accountRepository: AccountRepository;

  constructor() {
    this.accountRepository = new AccountRepository();
  }

  public async execute() {
    this.accountRepository.account_id = this.account_id;

    const accountExists = await this.accountRepository.findById();

    if (!accountExists) {
      throw new ApiError("Conta nao encontrada", 400);
    }

    await this.accountRepository.deleteById();
  }
}
