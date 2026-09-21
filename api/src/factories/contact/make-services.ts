import { SendContactService } from "../../services/contact/Send-contact-service.js";
import { SendEmailService } from "../../services/email/send-email-service.js";
import { VerifyRecaptchaService } from "../../services/security/Verify-recaptcha-service.js";

export function makeSendContactService() {
  return new SendContactService(new VerifyRecaptchaService(), new SendEmailService());
}
