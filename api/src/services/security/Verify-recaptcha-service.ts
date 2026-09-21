import { RecaptchaEnterpriseServiceClient } from "@google-cloud/recaptcha-enterprise";
import type { RecaptchaContract, VerifyRecaptchaDTO } from "../../contracts/RecaptchaContract.js";
import { ApiError } from "../../utils/ApiError.js";

export class VerifyRecaptchaService implements RecaptchaContract {
  private readonly client: RecaptchaEnterpriseServiceClient;

  constructor() {
    this.client = new RecaptchaEnterpriseServiceClient();
  }

  public async execute(input: VerifyRecaptchaDTO) {
    const projectPath = this.client.projectPath(process.env.RECAPTCHA_PROJECT_ID!);

    const request = {
      assessment: {
        event: {
          token: input.token,
          siteKey: process.env.RECAPTCHA_SITE_KEY!,
          expectedAction: input.expected_action,
        },
      },
      parent: projectPath,
    };

    const [response] = await this.client.createAssessment(request).catch((error) => {
      console.log("Erro ao criar assessment reCAPTCHA");
      console.log(error);

      throw new ApiError("Falha na comunicacao com o reCAPTCHA", 500);
    });

    if (!response.tokenProperties?.valid) {
      throw new ApiError("Falha na validacao do reCAPTCHA", 400);
    }

    if (response.tokenProperties.action === input.expected_action) {
      const minScore = Number(process.env.RECAPTCHA_MIN_SCORE) || 0.5;

      const score = response.riskAnalysis?.score;

      if (score == null || score < minScore) {
        throw new ApiError("Falha na validacao do reCAPTCHA", 400);
      }

      return score;
    } else {
      throw new ApiError("Falha na validacao do reCAPTCHA", 400);
    }
  }
}
