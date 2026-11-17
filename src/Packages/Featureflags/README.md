# @lendistry/openfeature

A reusable feature flag library built on top of the OpenFeature React SDK. It provides a common way for React applications and microfrontends to initialize feature flags, control feature visibility, and evaluate flags through an API.

## Features

- Centralized feature flag initialization.
- OpenFeature React SDK integration.
- Reusable `FeatureFlag` component.
- Support for fallback values and `matchValue`.
- API hook to evaluate an individual flag or retrieve all flags.
- Mock data support for local development and testing.

## Installation

Install the package in your React application:

```bash
npm install @lendistry/openfeature
```

The consuming application should also have React and React DOM installed.

## 1. Initialize Feature Flags

Initialize feature flags before rendering your React application.

**main.tsx**

```tsx
import React from "react";
import ReactDOM from "react-dom/client";

import {
  initializeFeatureFlags,
  FeatureFlagProvider,
} from "@lendistry/openfeature";

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
```

### Initialization options

| Property | Description |
|---|---|
| `apiKey` | API key used for feature flag evaluation |
| `environment` | Environment such as dev, test, or prod |
| `subjectId` | Unique user or subject identifier |

`initializeFeatureFlags()` loads the flag values and registers the OpenFeature provider.

`FeatureFlagProvider` makes the registered OpenFeature client available to components.

## 2. FeatureFlag Component

Use the `FeatureFlag` component to conditionally render UI based on a feature flag.

### Example 1: With fallback

```tsx
import { FeatureFlag } from "@lendistry/openfeature";

function Dashboard() {
  return (
    <FeatureFlag
      flagKey="new-dashboard"
      defaultValue={false}
      fallback={<p>Dashboard is unavailable</p>}
    >
      <h2>New Dashboard</h2>
    </FeatureFlag>
  );
}

export default Dashboard;
```

If the flag is enabled, the new dashboard is displayed. Otherwise, the fallback content is displayed.

### Example 2: Without fallback

```tsx
import { FeatureFlag } from "@lendistry/openfeature";

function PaymentPage() {
  return (
    <FeatureFlag
      flagKey="enable-payment"
      defaultValue={false}
    >
      <button>Make Payment</button>
    </FeatureFlag>
  );
}

export default PaymentPage;
```

When the flag is enabled, the button is displayed. When disabled, nothing is rendered.

### Example 3: Using matchValue

```tsx
<FeatureFlag
  flagKey="user-role"
  defaultValue="user"
  matchValue="admin"
>
  <button>Admin Settings</button>
</FeatureFlag>
```

The child content is displayed when the evaluated flag value matches `"admin"`.

### Important properties

| Property | Description |
|---|---|
| `flagKey` | Feature flag key to evaluate |
| `defaultValue` | Required fallback value used when evaluation is unavailable |
| `fallback` | Optional content displayed when the flag does not match |
| `matchValue` | Optional value used to determine whether the child content should be displayed |

## 3. useFeatureFlagApi Hook

The library provides `useFeatureFlagApi` to evaluate feature flags directly through the API.

It supports two use cases:

- Retrieve all feature flags.
- Retrieve an individual feature flag.

### Example 1: Evaluate all flags

Do not pass `flagKey` when you want to retrieve all flags.

```tsx
import { useFeatureFlagApi } from "@lendistry/openfeature";

function Dashboard() {
  const { data, loading, error } = useFeatureFlagApi({
    apiKey: "YOUR_API_KEY",
    environment: "dev",
    subjectId: "user-123",
  });

  if (loading) return <p>Loading flags...</p>;

  if (error) return <p>{error}</p>;

  return (
    <pre>{JSON.stringify(data, null, 2)}</pre>
  );
}

export default Dashboard;
```

Expected response structure:

```json
{
  "values": {
    "new-dashboard": true,
    "show-loan-products": false,
    "enable-payment": true
  }
}
```

### Example 2: Evaluate an individual flag

Pass `flagKey` to retrieve a specific feature flag.

```tsx
import { useFeatureFlagApi } from "@lendistry/openfeature";

function PaymentPage() {
  const { data, loading, error } = useFeatureFlagApi({
    apiKey: "YOUR_API_KEY",
    environment: "dev",
    subjectId: "user-123",
    flagKey: "enable-payment",
  });

  if (loading) return <p>Loading...</p>;

  if (error) return <p>{error}</p>;

  const result = data as { value: boolean } | null;

  return (
    <div>
      {result?.value ? (
        <button>Make Payment</button>
      ) : (
        <p>Payment is currently unavailable</p>
      )}
    </div>
  );
}

export default PaymentPage;
```

Expected response structure:

```json
{
  "value": true
}
```

### Hook options

| Property | Description |
|---|---|
| `apiKey` | API authentication key |
| `environment` | Target environment |
| `subjectId` | User or subject identifier |
| `flagKey` | Optional flag key; omit to retrieve all flags |

### Hook return values

| Property | Description |
|---|---|
| `data` | API response data |
| `loading` | Indicates whether evaluation is in progress |
| `error` | Error message if evaluation fails |

## 4. API Endpoints

The hook is designed to use the following backend endpoints when real API mode is enabled.

| Operation | Method | Endpoint |
|---|---|---|
| Evaluate an individual flag | POST | `/v1/flags/:key/evaluate` |
| Evaluate all flags | POST | `/v1/flags/evaluate-all` |
| Health check | GET | `/health` |

### Evaluation request body

```json
{
  "subjectId": "user-123",
  "environment": "dev",
  "attributes": {}
}
```
The API key is passed using the `X-API-Key` request header.

## 6. Troubleshooting

**Feature flag is not working**

- Verify that `initializeFeatureFlags()` completes before rendering the application.
- Ensure the application is wrapped with `FeatureFlagProvider`.
- Check that the `flagKey` matches the configured flag key.
- Verify the `defaultValue` is provided.

**API evaluation fails**

- Verify the API endpoint and API key.
- Check the environment and subject ID.
- Inspect the browser network tab for API errors.

## 7. Package Exports

The library currently exposes:

```tsx
export {
  initializeFeatureFlags,
  DEFAULT_DOMAIN,
} from "./core/initialize";

export { FeatureFlag } from "./components/FeatureFlag";

export {
  FeatureFlagProvider,
} from "./components/FeatureFlagProvider";

export {
  useFeatureFlagApi,
} from "./hooks/useFeatureFlagApi";
```