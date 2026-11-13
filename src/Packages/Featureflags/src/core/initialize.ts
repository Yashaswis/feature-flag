
import {
  OpenFeature,
} from "@openfeature/react-sdk";

import type {
  Provider,
  Client,
} from "@openfeature/react-sdk";

export interface FeatureFlagOptions {
  provider: Provider;
  domain?: string;
}

const DEFAULT_DOMAIN = "company-feature-flags";

const initializationPromises = new Map<string, Promise<void>>();

export async function initializeFeatureFlags(
  options: FeatureFlagOptions
): Promise<Client> {
  const domain = options.domain ?? DEFAULT_DOMAIN;

  let initialization = initializationPromises.get(domain);

  if (!initialization) {
    initialization = OpenFeature.setProviderAndWait(
      domain,
      options.provider
    );

    initializationPromises.set(domain, initialization);

    try {
      await initialization;
    } catch (error) {
      initializationPromises.delete(domain);
      throw error;
    }
  } else {
    await initialization;
  }

  return OpenFeature.getClient(domain);
}

export function getFeatureFlagClient(
  domain: string = DEFAULT_DOMAIN
): Client {
  return OpenFeature.getClient(domain);
}
