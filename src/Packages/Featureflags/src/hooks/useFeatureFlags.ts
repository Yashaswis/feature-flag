
import { useFeatureFlag } from "./useFeatureFlag";

export function useFeatureFlags() {
  const isDashboardEnabled = useFeatureFlag("new-dashboard", false);
  const isPaymentEnabled = useFeatureFlag("enable-payment", false);
  const isReportsEnabled = useFeatureFlag("show-reports", false);

  return {
    "new-dashboard": isDashboardEnabled,
    "enable-payment": isPaymentEnabled,
    "show-reports": isReportsEnabled,
  };
}
