
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import {
  OpenFeature,
  TypedInMemoryProvider,
} from "@openfeature/react-sdk";

import { FeatureFlagProvider } from
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
});

async function bootstrap() {
  await OpenFeature.setProviderAndWait(localProvider);

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <FeatureFlagProvider>
        <App />
      </FeatureFlagProvider>
    </StrictMode>
  );
}

bootstrap();
