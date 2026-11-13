import { OpenFeature } from "@openfeature/react-sdk";
import type {
  Provider,
  Client,
} from "@openfeature/react-sdk";

export const DEFAULT_DOMAIN = "company-feature-flags";

export interface FeatureFlagOptions {
  provider: Provider;
  domain?: string;
}

export async function initializeFeatureFlags(
  options: FeatureFlagOptions
): Promise<Client> {
  const domain = options.domain ?? DEFAULT_DOMAIN;

  await OpenFeature.setProviderAndWait(
    domain,
    options.provider
  );

  return OpenFeature.getClient(domain);
}