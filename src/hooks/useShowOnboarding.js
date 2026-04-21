import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export function useShowOnboarding() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Check if user just completed signup (URL param or localStorage)
    const success = searchParams.get("success");
    const product = searchParams.get("product");

    if (success === "true" && product) {
      // Mark that onboarding was shown
      const onboardingKey = `onboarding_shown_${product}`;
      const hasShown = localStorage.getItem(onboardingKey);

      if (!hasShown) {
        setShowOnboarding(true);
        localStorage.setItem(onboardingKey, "true");
      }
    }
  }, [searchParams]);

  const dismissOnboarding = () => {
    setShowOnboarding(false);
  };

  return { showOnboarding, dismissOnboarding };
}