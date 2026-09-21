import { hash } from "bcryptjs";
import { randomInt } from "node:crypto";
import type { AccountContract } from "../../contracts/AccountContract.js";
import type { MailContract } from "../../contracts/MailContract.js";
import type { RoleContract } from "../../contracts/RoleContract.js";
import type { CreateAccountDTO } from "../../dtos/account/CreateAccountDTO.js";

import { ApiError } from "../../utils/ApiError.js";

export class CreateAccountService {
  constructor(
    private readonly accountRepository: AccountContract,

    private readonly roleRepository: RoleContract,
    private readonly sendEmailService: MailContract,
  ) {}

  public async execute(input: CreateAccountDTO) {
    const accountExists = await this.accountRepository.findByEmail({ email: input.email });

    if (accountExists) {
      throw new ApiError("Ja existe uma conta com esse e-mail cadastrado", 400);
    }

    const role = await this.roleRepository.findBySlug({ slug: input.role });

    if (!role) {
      throw new ApiError("Funcao nao encontrada", 404);
    }

    const password = await this.generatePassword();
    const account = await this.accountRepository.create({
      name: input.name,
      email: input.email,
      password: await hash(password, 12),
      role_id: role.id,
    });

    await this.sendEmailService.execute({
      template: "account-created",
      html: "",
      templateData: {
        account,
        password: password,
        portal_url: process.env.PORTAL_URL ?? "https://altrevizan.com.br",
      },
      from: process.env.MAIL_FROM!,
      to: input.email,
      replyTo: "",
      subject: "Bem-vindo ao CMS | Portfólio André Lucas Trevizan",
      attachments: [],
    });

    return account;
  }

  public async generatePassword() {
    const letters = process.env.PASS_CHARS!;
    const numbers = process.env.PASS_NUMBERS!;
    const specials = process.env.PASS_SPECIAL_CHARS!;

    const password: string[] = [];

    password.push(letters[randomInt(letters.length)]!);
    password.push(numbers[randomInt(numbers.length)]!);
    password.push(specials[randomInt(specials.length)]!);

    const all = letters + numbers + specials;

    while (password.length < 8) {
      password.push(all[randomInt(all.length)]!);
    }

    for (let i = password.length - 1; i > 0; i--) {
      const j = randomInt(i + 1);
      [password[i], password[j]] = [password[j]!, password[i]!];
    }

    return password.join("");
  }
}
