
import type { Provider } from "@openfeature/web-sdk";

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
