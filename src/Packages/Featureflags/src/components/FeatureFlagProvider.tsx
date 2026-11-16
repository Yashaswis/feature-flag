
import {
  OpenFeature,
  OpenFeatureProvider,
} from "@openfeature/react-sdk";

import type { ReactNode } from "react";
import { DEFAULT_DOMAIN } from "../core/initialize";

interface FeatureFlagProviderProps {
  children: ReactNode;
}

export function FeatureFlagProvider({
  children,
}: FeatureFlagProviderProps) {
  const client = OpenFeature.getClient(DEFAULT_DOMAIN);

  return (
    <OpenFeatureProvider client={client}>
      {children}
    </OpenFeatureProvider>
  );
}
