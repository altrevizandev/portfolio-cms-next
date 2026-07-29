export async function executeRecaptcha(action: string) {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  if (!siteKey || !window.grecaptcha?.enterprise) {
    throw new Error("reCAPTCHA nao carregado");
  }

  const token = await Promise.race([
    new Promise<string>((resolve, reject) => {
      window.grecaptcha.enterprise.ready(() => {
        window.grecaptcha.enterprise
          .execute(siteKey, { action })
          .then(resolve)
          .catch(reject);
      });
    }),
    new Promise<string>((resolve, reject) => {
      window.setTimeout(() => reject(new Error("Tempo limite ao validar reCAPTCHA")), 10000);
    }),
  ]);

  return token;
}
