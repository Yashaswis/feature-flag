
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { TypedInMemoryProvider } from "@openfeature/web-sdk";
import {
  initializeFeatureFlags,
  FeatureFlagProvider,
} from "@company/feature-flags";

import App from "./App";
import "./index.css";

const localProvider = new TypedInMemoryProvider({
  "new-dashboard": {
    disabled: false,
    variants: {
      on: false,
      off: true,
    },
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
