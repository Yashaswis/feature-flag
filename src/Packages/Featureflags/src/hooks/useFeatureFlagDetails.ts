import { useBooleanFlagDetails } from "@openfeature/react-sdk";

export function useFeatureFlagDetails(
  flagKey: string,
  defaultValue = false
) {
  const details = useBooleanFlagDetails(
    flagKey,
    defaultValue
  );

  return {
    flagKey,
    value: details.value,
    variant: details.variant,
    reason: details.reason,
    errorCode: details.errorCode,
    flagMetadata: details.flagMetadata,
  };
}