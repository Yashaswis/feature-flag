
import {
  useFeatureFlag,
  useFeatureFlagDetails,
} from "@company/feature-flags";

function App() {
  const isNewDashboardEnabled = useFeatureFlag(
    "new-dashboard",
    false
  );

  const flagDetails = useFeatureFlagDetails(
    "new-dashboard",
    false
  );

  return (
    <div style={{ padding: "30px" }}>
      <h1>Feature Flag SDK Demo</h1>

      <h2>New Dashboard</h2>

      {isNewDashboardEnabled ? (
        <h3>New Dashboard is ENABLED</h3>
      ) : (
        <h3>New Dashboard is DISABLED</h3>
      )}

      <hr />

      <h3>Feature Flag Details</h3>

      <p>Flag Key: {flagDetails.flagKey}</p>
      <p>Value: {String(flagDetails.value)}</p>
      <p>Variant: {flagDetails.variant ?? "N/A"}</p>
      <p>Reason: {flagDetails.reason ?? "N/A"}</p>
    </div>
  );
}

export default App;
