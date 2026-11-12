
import {
    useBooleanFlagDetails
  } from "@openfeature/react-sdk";
  
  export function useFeatureFlagDetails(
    flagKey: string,
    defaultValue: boolean = false
  ) {
    const details = useBooleanFlagDetails(
      flagKey,
      defaultValue
    );
  
    return {
      value: details.value,
      variant: details.variant,
      reason: details.reason,
      flagMetadata: details.flagMetadata
    };
  }
  