import type { MailAttachment } from "../../contracts/MailContract.js";

export type SendContactDTO = {
  data: {
    name: string;
    email: string;
    phone?: string | undefined;
    subject: string;
    message: string;
    recaptcha_token: string;
  };
  attachment: MailAttachment | null;
};
