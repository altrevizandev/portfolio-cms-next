import { AccountRepository } from "../../repositories/Account-repository.js";
import { ApiError } from "../../utils/ApiError.js";

export class ChangePasswordService {
  public password: string = "";
  public account_id: number = 0;
  private readonly accountRepository: AccountRepository;

  constructor() {
    this.accountRepository = new AccountRepository();
  }

  public async execute() {
    this.accountRepository.account_id = this.account_id;

    const account = await this.accountRepository.findById();

    if (!account) {
      throw new ApiError("Conta não encontrada", 500);
    }

    this.accountRepository.password = this.password;

    await this.accountRepository.changePassword();
  }
}
