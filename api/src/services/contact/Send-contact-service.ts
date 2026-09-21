import type { MailContract } from "../../contracts/MailContract.js";
import type { RecaptchaContract } from "../../contracts/RecaptchaContract.js";
import type { SendContactDTO } from "../../dtos/contact/SendContactDTO.js";

export class SendContactService {
  constructor(
    private readonly recaptcha: RecaptchaContract,
    private readonly mail: MailContract,
  ) {}

  async execute({ data, attachment }: SendContactDTO) {
    await this.recaptcha.execute({ token: data.recaptcha_token, expected_action: "send_contact" });
    await this.mail.execute({
      to: process.env.MAIL_CONTACT_TO || process.env.MAIL_AUTH!,
      replyTo: data.email,
      subject: `[Portfólio] ${data.subject}`,
      template: "contact-message",
      templateData: data,
      attachments: attachment ? [attachment] : [],
    });
  }
}
