"use client";

import { useEffect } from "react";

export function RecaptchaCleanup() {
  useEffect(() => {
    const hideRecaptchaBadge = () => {
      document.querySelectorAll(".grecaptcha-badge").forEach((element) => {
        const badge = element as HTMLElement;

        badge.style.visibility = "hidden";
      });
    };

    hideRecaptchaBadge();

    const timeout = window.setTimeout(hideRecaptchaBadge, 500);

    return () => window.clearTimeout(timeout);
  }, []);

  return null;
}

export function RecaptchaBadgeVisible() {
  useEffect(() => {
    const showRecaptchaBadge = () => {
      document.querySelectorAll(".grecaptcha-badge").forEach((element) => {
        const badge = element as HTMLElement;

        badge.style.visibility = "visible";
      });
    };

    showRecaptchaBadge();

    const timeout = window.setTimeout(showRecaptchaBadge, 500);

    return () => window.clearTimeout(timeout);
  }, []);

  return null;
}
