import { AccountRepository } from "../../repositories/Account-repository.js";
import { AccountRoleRepository } from "../../repositories/AccountRoles-repository.js";
import { LoginCodeRepository } from "../../repositories/LoginCode-repository.js";
import { ResetPasswordTokenRepository } from "../../repositories/ResetPasswordToken-repository.js";
import { ChangePasswordService } from "../../services/auth/Change-password-service.js";
import { ConfirmResetPasswordService } from "../../services/auth/Confirm-reset-password-service.js";
import { MeService } from "../../services/auth/Me-service.js";
import { SendResetPasswordLinkService } from "../../services/auth/Send-reset-password-link-service.js";
import { SignInService } from "../../services/auth/Sign-in-service.js";
import { VerifyCodeService } from "../../services/auth/Verify-code-service.js";
import { SendEmailService } from "../../services/email/send-email-service.js";

export function makeChangePasswordService() {
  return new ChangePasswordService(new AccountRepository());
}

export function makeConfirmResetPasswordService() {
  return new ConfirmResetPasswordService(
    new AccountRepository(),
    new ResetPasswordTokenRepository(),
  );
}

export function makeMeService() {
  return new MeService(new AccountRepository(), new AccountRoleRepository());
}

export function makeSendResetPasswordLinkService() {
  return new SendResetPasswordLinkService(
    new AccountRepository(),
    new ResetPasswordTokenRepository(),
    new SendEmailService(),
  );
}

export function makeSignInService() {
  return new SignInService(
    new AccountRepository(),
    new AccountRoleRepository(),
    new LoginCodeRepository(),
    new SendEmailService(),
  );
}

export function makeVerifyCodeService() {
  return new VerifyCodeService(
    new AccountRepository(),
    new AccountRoleRepository(),
    new LoginCodeRepository(),
  );
}
