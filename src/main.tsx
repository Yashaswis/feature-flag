
import React from "react";
import ReactDOM from "react-dom/client";
import {
  initializeFeatureFlags,
  FeatureFlagProvider,
} from "@your-org/openfeatures";
import App from "./App";

async function bootstrap() {
  await initializeFeatureFlags({
    apiKey: "YOUR_API_KEY",
    environment: "dev",
    subjectId: "user-123",
  });

  ReactDOM.createRoot(
    document.getElementById("root")!
  ).render(
    <React.StrictMode>
      <FeatureFlagProvider>
        <App />
      </FeatureFlagProvider>
    </React.StrictMode>
  );
}

bootstrap();
