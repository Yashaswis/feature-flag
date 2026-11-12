
import {
    useBooleanFlagValue
  } from "@openfeature/react-sdk";
  
  export function useFeatureFlag(
    flagKey: string,
    defaultValue: boolean = false
  ): boolean {
  
    return useBooleanFlagValue(
      flagKey,
      defaultValue
    );
  }
  