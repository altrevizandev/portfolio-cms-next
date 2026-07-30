import { redirect } from "next/navigation";
import { getAuthenticatedAccount } from "../../lib/auth";
import { Metadata } from "next";
import Script from "next/script";
import { RecaptchaBadgeVisible } from "@/components/security/RecaptchaCleanup";

export const metadata: Metadata = {
  title: {
    default: "André Lucas Trevizan — Software Developer",
    template: `%s — André Lucas Trevizan`,
  },
  description: "Portfólio de André Lucas Trevizan, desenvolvedor de software.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const signedAccount = await getAuthenticatedAccount();

  if (signedAccount) {
    return redirect('/');
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center p-3">
      {children}
      <RecaptchaBadgeVisible />
      <Script
        src={`https://www.google.com/recaptcha/enterprise.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
        strategy="afterInteractive"
      />
    </div>
  );
}
