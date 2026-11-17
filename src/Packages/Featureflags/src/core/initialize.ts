
import {
  OpenFeature,
  TypedInMemoryProvider,
} from "@openfeature/react-sdk";

import type { JsonValue } from "@openfeature/react-sdk";
import { mockFlags } from "../mock/mockFlags";

export const DEFAULT_DOMAIN = "company-feature-flags";

const BASE_URL = "http://localhost:9099";

export interface FeatureFlagOptions {
  apiKey: string;
  environment: string;
  subjectId: string;
}

interface EvaluateAllResponse {
  values: Record<string, JsonValue>;
}

type FlagConfig = Record<
  string,
  {
    variants: Record<string, JsonValue>;
    defaultVariant: string;
    disabled: boolean;
  }
>;

export async function initializeFeatureFlags(
  options: FeatureFlagOptions
) {
  let values: Record<string, JsonValue>;
    const response = await fetch(
      'http://localhost:9099/v1/flags/evaluate-all',
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": options.apiKey,
        },
        body: JSON.stringify({
          subjectId: options.subjectId,
          environment: options.environment,
          attributes: {},
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to load feature flags: ${response.status}`
      );
    }

    const result: EvaluateAllResponse = await response.json();

    values = result.values;

  // Convert values into provider configuration.
  const flagConfiguration: FlagConfig = Object.fromEntries(
    Object.entries(values).map(([key, value]) => [
      key,
      {
        variants: {
          default: value,
        },
        defaultVariant: "default",
        disabled: false,
      },
    ])
  );
  const provider = new TypedInMemoryProvider(
    flagConfiguration
  );

  // Register provider.
  await OpenFeature.setProviderAndWait(
    DEFAULT_DOMAIN,
    provider
  );

  console.log("Registered feature flags:", values);

  // Return initialized client.
  return OpenFeature.getClient(DEFAULT_DOMAIN);
}
