import { AccountRepository } from "../../repositories/Account-repository.js";
import { AccountRoleRepository } from "../../repositories/AccountRoles-repository.js";
import { RoleRepository } from "../../repositories/Role-repository.js";
import { CreateAccountService } from "../../services/account/Create-service.js";
import { AccountDeleteService } from "../../services/account/Delete-service.js";
import { AccountDetailsService } from "../../services/account/Details-service.js";
import { ListAccountsService } from "../../services/account/List-service.js";
import { AccountUpdateService } from "../../services/account/Update-service.js";
import { SendEmailService } from "../../services/email/send-email-service.js";

export function makeCreateAccountService() {
  return new CreateAccountService(
    new AccountRepository(),
    new RoleRepository(),
    new SendEmailService(),
  );
}

export function makeAccountDeleteService() {
  return new AccountDeleteService(new AccountRepository());
}

export function makeAccountDetailsService() {
  return new AccountDetailsService(new AccountRoleRepository());
}

export function makeListAccountsService() {
  return new ListAccountsService(new AccountRepository());
}

export function makeAccountUpdateService() {
  return new AccountUpdateService(
    new AccountRepository(),
    new AccountRoleRepository(),
    new RoleRepository(),
  );
}
