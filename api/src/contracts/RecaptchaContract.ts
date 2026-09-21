export type VerifyRecaptchaDTO = {
  token: string;
  expected_action: string;
};

export interface RecaptchaContract {
  execute(input: VerifyRecaptchaDTO): Promise<number>;
}
