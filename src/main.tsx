
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import {
  TypedInMemoryProvider,
} from "@openfeature/react-sdk";

import { FeatureFlagProvider, initializeFeatureFlags } from
  "@company/feature-flags";

import App from "./App";
import "./index.css";

const localProvider = new TypedInMemoryProvider({
  "new-dashboard": {
    disabled: false,
    variants: {
      on: true,
      off: false,
    },
    defaultVariant: "on",
  },
  "show-loan-products":{
    disabled: false,
    variants: {
      on: false,
      off: true,
    },
    defaultVariant: "on",
  }
});

async function bootstrap() {
  await initializeFeatureFlags({
    provider: localProvider,
  });

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <FeatureFlagProvider>
        <App />
      </FeatureFlagProvider>
    </StrictMode>
  );
}

bootstrap();
