
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { TypedInMemoryProvider } from "@openfeature/react-sdk";
import {
  initializeFeatureFlags,
  FeatureFlagProvider,
} from "@company/feature-flags";

import App from "./App";
import "./index.css";

const localProvider = new TypedInMemoryProvider({
  "new-dashboard": {
    disabled: false,
    variants: { on: true, off: false },
    defaultVariant: "on",
  },
  "enable-payment": {
    disabled: false,
    variants: { on: true, off: false },
    defaultVariant: "off",
  },
  "show-reports": {
    disabled: false,
    variants: { on: true, off: false },
    defaultVariant: "on",
  },
});

async function bootstrap() {
  try {
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
  } catch (error) {
    console.error("Feature flag initialization failed:", error);
  }
}

bootstrap();
