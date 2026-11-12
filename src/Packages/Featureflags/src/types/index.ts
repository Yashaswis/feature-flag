
import type { Provider } from "@openfeature/react-sdk";

export interface FeatureFlagConfig {
  provider: Provider;
}

export interface FeatureFlagDetails {
  flagKey: string;
  value: boolean;
  variant?: string;
  reason?: string;
  errorCode?: string;
}
