"use client";

import { useEffect } from "react";
import { useSignedAccount } from "../../../../../store/signedAccount";
import { SendResetPasswordLinkEmailForm } from "@/components/forms/SendResetPasswordLinkEmailForm";

export default function SendResetPasswordEmailLinkPage() {
  const {
    logout
  } = useSignedAccount();

  useEffect(() => {
    logout();
  }, [logout]);

  return (
    <div className="flex w-screen justify-center p-3">
      <SendResetPasswordLinkEmailForm />
    </div>
  );
}
