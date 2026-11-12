
import { OpenFeature } from "@openfeature/web-sdk";
import type { Provider, Client } from "@openfeature/web-sdk";

export interface FeatureFlagOptions {
  provider: Provider;
  domain?: string;
}

const DEFAULT_DOMAIN = "company-feature-flags";

let initialized = false;

export async function initializeFeatureFlags(
  options: FeatureFlagOptions
): Promise<Client> {
  const domain = options.domain ?? DEFAULT_DOMAIN;

  if (!initialized) {
    await OpenFeature.setProviderAndWait(
      options.provider,
      domain
    );

    initialized = true;
  }

  return OpenFeature.getClient(domain);
}

export function getFeatureFlagClient(): Client {
  return OpenFeature.getClient(DEFAULT_DOMAIN);
}
