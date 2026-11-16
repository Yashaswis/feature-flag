
import {
  OpenFeature,
  TypedInMemoryProvider,
} from "@openfeature/react-sdk";

import type { JsonValue } from "@openfeature/react-sdk";
import { mockFlags } from "../mock/mockFlags";

export const DEFAULT_DOMAIN = "company-feature-flags";

const BASE_URL = "YOUR_EXISTING_BACKEND_BASE_URL";

export interface FeatureFlagOptions {
  apiKey: string;
  environment: string;
  subjectId: string;
}

interface EvaluateAllResponse {
  values: Record<string, boolean | JsonValue>;
}

type FlagConfig = Record<
  string,
  {
    variants: Record<string, boolean | JsonValue>;
    defaultVariant: string;
    disabled: boolean;
  }
>;

const USE_MOCK_API = true;

export async function initializeFeatureFlags(
  options: FeatureFlagOptions
) {

  if (USE_MOCK_API) {
    console.log("Using mock feature flag response");

    return mockFlags.values as Record<string, JsonValue>;
  }

  const response = await fetch(
    `${BASE_URL}/v1/flags/evaluate-all`,
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

  const flagConfiguration = Object.fromEntries(
    Object.entries(result.values).map(([key, value]) => [
      key,
      {
        variants: {
          default: value,
        },
        defaultVariant: "default",
        disabled: false,
      },
    ])
  ) as FlagConfig;

  const provider = new TypedInMemoryProvider(
    flagConfiguration as never
  );

  await OpenFeature.setProviderAndWait(
    DEFAULT_DOMAIN,
    provider
  );

  return OpenFeature.getClient(DEFAULT_DOMAIN);
}
