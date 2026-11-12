
import {
    OpenFeatureProvider
  } from "@openfeature/react-sdk";
  
  import {
    OpenFeature
  } from "@openfeature/web-sdk";
  
  import type { ReactNode } from "react";
  
  interface FeatureFlagProviderProps {
    children: ReactNode;
    domain?: string;
  }
  
  export function FeatureFlagProvider({
    children,
    domain = "company-feature-flags"
  }: FeatureFlagProviderProps) {
  
    const client = OpenFeature.getClient(domain);
  
    return (
      <OpenFeatureProvider client={client}>
        {children}
      </OpenFeatureProvider>
    );
  }
  