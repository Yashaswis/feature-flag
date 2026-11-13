import {
  useFlag,
} from "@openfeature/react-sdk";

import type {
  FlagValue,
  ConstrainedFlagKey,
} from "@openfeature/react-sdk";

export function useFeatureFlag<T extends FlagValue>(
  flagKey: ConstrainedFlagKey<T>,
  defaultValue: T
): T {
  const { value } = useFlag<T>(flagKey, defaultValue);

  return value as T;
}