export type MailAttachment = {
  filename: string;
  content: Buffer;
  contentType: string;
};

export type SendMailDTO = {
  from?: string;
  to: string;
  subject: string;
  html?: string;
  replyTo?: string;
  attachments?: MailAttachment[];
  template?: string;
  templateData?: Record<string, unknown>;
};

export interface MailContract {
  execute(input: SendMailDTO): Promise<void>;
}
