import { useFeatureFlag } from "@company/feature-flags";

function App() {
  const isEnabled = useFeatureFlag("new-dashboard", false);

  const buttonColor = useFeatureFlag("button-color", "blue");

  const pageSize = useFeatureFlag("page-size", 20);

  const dashboardConfig = useFeatureFlag("dashboard-config", {
    theme: "dark",
    showReports: true,
    permissions: {
      canEdit: true,
      canDelete: false,
    },
  });

  return (
    <div>
      <h2>Boolean Flag</h2>
      <p>{String(isEnabled)}</p>

      <h2>String Flag</h2>
      <p>{buttonColor}</p>

      <h2>Number Flag</h2>
      <p>{pageSize}</p>

      <h2>JSON Flag</h2>
      <pre>{JSON.stringify(dashboardConfig, null, 2)}</pre>
    </div>
  );
}

export default App;