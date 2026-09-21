import type { AccountContract } from "../../contracts/AccountContract.js";

export class ListAccountsService {
  constructor(private readonly accountRepository: AccountContract) {}

  public async execute() {
    const accounts = await this.accountRepository.list();

    return accounts.map((data) => ({
      id: data.account.id,
      name: data.account.name,
      email: data.account.email,
      role: data.role.slug,
      created_at: data.account.created_at,
      updated_at: data.account.updated_at,
    }));
  }
}
