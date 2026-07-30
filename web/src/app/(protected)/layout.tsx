import { Metadata } from "next";
import { Navbar } from "../../components/ui/navbar";
import { getAuthenticatedAccount } from "../../lib/auth";
import { redirect } from "next/navigation";
import { RecaptchaCleanup } from "@/components/security/RecaptchaCleanup";

export const metadata: Metadata = {
  title: {
    default: "Área administrativa — André Lucas Trevizan",
    template: `%s — André Lucas Trevizan`,
  },
  description: "Gerenciamento de conteúdo do portfólio de André Lucas Trevizan.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const signedAccount = await getAuthenticatedAccount();

  if (!signedAccount) {
    return redirect('/sign-in');
  }

  return (
    <div className="flex flex-col">
      <RecaptchaCleanup />
      <div className="p-3">
        {children}
      </div>
    </div>
  )
}
