
import { useEffect, useState } from "react";
import { mockFlags } from "../mock/mockFlags";

const USE_MOCK_API = true;

interface FeatureFlagApiOptions {
  endpoint: string;
  apiKey: string;
  environment: string;
  subjectId: string;
  flagKey?: string;
}

interface FeatureFlagApiResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useFeatureFlagApi<T = unknown>({
  endpoint,
  apiKey,
  environment,
  subjectId,
  flagKey,
}: FeatureFlagApiOptions): FeatureFlagApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const evaluateFlag = async () => {
      try {
        setLoading(true);
        setError(null);

        let response: T;

        if (USE_MOCK_API) {
          // Mock API response
          await new Promise((resolve) => setTimeout(resolve, 500));

          if (flagKey) {
            const value =
              mockFlags.values[
                flagKey as keyof typeof mockFlags.values
              ];

            if (value === undefined) {
              throw new Error(`Flag '${flagKey}' not found`);
            }

            response = { value } as T;
          } else {
            response = { values: mockFlags.values } as T;
          }
        } else {
          // Real API integration
          const url = flagKey
            ? `${endpoint}/v1/flags/${encodeURIComponent(flagKey)}/evaluate`
            : `${endpoint}/v1/flags/evaluate-all`;

          const apiResponse = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-API-Key": apiKey,
            },
            body: JSON.stringify({
              subjectId,
              environment,
              attributes: {},
            }),
          });

          if (!apiResponse.ok) {
            throw new Error(
              `Feature flag API error: ${apiResponse.status}`
            );
          }

          response = await apiResponse.json();
        }

        setData(response);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    };

    evaluateFlag();
  }, [endpoint, apiKey, environment, subjectId, flagKey]);

  return { data, loading, error };
}
