
import { useEffect, useState } from "react";
import { mockFlags } from "../mock/mockFlags";

const USE_MOCK_API = true;

interface FeatureFlagApiOptions {
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
        
          // Real API integration
          const url = flagKey
            ? `http://localhost:9099/v1/flags/${encodeURIComponent(flagKey)}/evaluate`
            : `http://localhost:9099/v1/flags/evaluate-all`;

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
  }, [apiKey, environment, subjectId, flagKey]);

  return { data, loading, error };
}
