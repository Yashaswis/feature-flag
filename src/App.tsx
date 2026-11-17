import {
  FeatureFlag,
  useFeatureFlagApi,
} from "@lendistry/openfeature";

function App() {
  // Evaluate all flags
  const {
    data: allFlags,
    loading: allFlagsLoading,
    error: allFlagsError,
  } = useFeatureFlagApi({
    apiKey: "dev-api-key",
    environment: "dev",
    subjectId: "user-123",
  });

  // Evaluate a specific flag
  const {
    data: dashboardFlag,
    loading: dashboardLoading,
    error: dashboardError,
  } = useFeatureFlagApi({
    apiKey: "dev-api-key",
    environment: "dev",
    subjectId: "user-123",
    flagKey: "new-dashboard",
  });

  return (
    <div style={{ padding: "24px", fontFamily: "Arial" }}>
      <h2>Feature Flags Demo</h2>

      {/* FeatureFlag Example 1: With fallback */}
      <h3>1. FeatureFlag with Fallback</h3>

      <FeatureFlag
        flagKey="new-dashboard"
        defaultValue={false}
        fallback={<p>New dashboard is currently unavailable.</p>}
      >
        <h4>New Dashboard</h4>
        <p>This is the new dashboard content.</p>
      </FeatureFlag>

      <hr />

      {/* FeatureFlag Example 2: Without fallback */}
      <h3>2. FeatureFlag without Fallback</h3>

      <FeatureFlag
        flagKey="show-loan-products"
        defaultValue={false}
      >
        <h4>Loan Products</h4>
        <p>Explore our available loan products.</p>
      </FeatureFlag>

      <hr />

      {/* FeatureFlag Example 3: With explicit matchValue */}
      <h3>3. FeatureFlag with matchValue</h3>

      <FeatureFlag
        flagKey="enable-payment"
        defaultValue={false}
        matchValue={true}
        fallback={<p>Payment feature is disabled.</p>}
      >
        <button>Make Payment</button>
      </FeatureFlag>

      <hr />

      {/* Evaluate all flags */}
      <h3>4. Evaluate All Flags Using Hook</h3>

      {allFlagsLoading && <p>Loading all flags...</p>}
      {allFlagsError && <p>Error: {allFlagsError}</p>}

      {allFlags && (
        <pre>{JSON.stringify(allFlags, null, 2)}</pre>
      )}

      <hr />

      {/* API Hook Example 2: Evaluate one flag */}
      <h3>5. Evaluate Specific Flag Using Hook</h3>

      {dashboardLoading && <p>Loading dashboard flag...</p>}
      {dashboardError && <p>Error: {dashboardError}</p>}

      {dashboardFlag && (
        <pre>{JSON.stringify(dashboardFlag, null, 2)}</pre>
      )}
    </div>
  );
}

export default App;
