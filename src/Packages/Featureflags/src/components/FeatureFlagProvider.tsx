import {
  OpenFeature,
  OpenFeatureProvider,
} from "@openfeature/react-sdk";

import type { ReactNode } from "react";

import { DEFAULT_DOMAIN } from "../core/initialize";

interface FeatureFlagProviderProps {
  children: ReactNode;
  domain?: string;
}

export function FeatureFlagProvider({
  children,
  domain = DEFAULT_DOMAIN,
}: FeatureFlagProviderProps) {
  const client = OpenFeature.getClient(domain);

  return (
    <OpenFeatureProvider client={client}>
      {children}
    </OpenFeatureProvider>
  );
}