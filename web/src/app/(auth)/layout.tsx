
import { getAuthenticatedAccount } from "@/lib/auth";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: {
    default: "Área administrativa — André Lucas Trevizan",
    template: `%s — André Lucas Trevizan`,
  },
  description: "Área administrativa do portfólio de André Lucas Trevizan.",
  icons: {
    icon: "../../../public/favicon.ico",
  },
};

export default async function ProtectedAuthLayout({ children }: { children: React.ReactNode }) {
  const signedAccount = await getAuthenticatedAccount();

  if (!signedAccount) {
    return redirect('/sign-in');
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div>
        {children}
      </div>
    </div>
  );
}
