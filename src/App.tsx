
import { useState } from "react";
import {
  FeatureFlag,
  useFeatureFlagApi,
} from "@lendistry/openfeature";

import "./App.css";

const financialDocuments = [
  {
    title: "Bank statements",
    description: "Last 3 months of business accounts",
  },
  {
    title: "Business tax returns",
    description: "Most recent 2 years of filed returns",
  },
];

const legalDocuments = [
  {
    title: "Business license",
    description: "Government authorization to operate",
  },
];

// Document item component
function DocumentItem({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <article className="document-item">
      <span className="document-icon">▤</span>

      <div>
        <strong>{title}</strong>
        <p>{description}</p>
      </div>
    </article>
  );
}

// OrigenLink AI Chat
function AssistantPanel() {
  const [chatStarted, setChatStarted] = useState(false);

  return (
    <aside className="assistant-panel">
      <header className="assistant-header">
        <div className="brand">
          <strong>
            Origen<span>Link</span><b>››</b>
          </strong>
          <small>by Lendistry</small>
        </div>

        <span className="assistant-heading">
          AI Loan
          <br />
          Assistant
        </span>

        <button
          className="history-button"
          type="button"
          aria-label="Chat history"
        >
          ↶
        </button>
      </header>

      <div className="assistant-welcome">
        I'm here to assist you with your loan application.
        If you have questions or need help getting prepared,
        feel free to ask.
      </div>

      <div className="chat-intro">
        <div className="chat-title">
          <span className="bot-avatar">✦</span>
          <strong>
            {chatStarted ? "Chat is ready" : "Before we chat"}
          </strong>
        </div>

        {chatStarted ? (
          <>
            <p>
              The OrigenLink assistant can help with general
              questions about loan products and the application
              process.
            </p>

            <button
              className="chat-link"
              onClick={() => setChatStarted(false)}
              type="button"
            >
              Back
            </button>
          </>
        ) : (
          <>
            <p>
              Hi, I'm the OrigenLink AI Loan Assistant.
              I can answer general questions about our loan
              products and how to apply. My answers may contain
              errors. Nothing I say is a loan offer, approval,
              or rate quote. A Lendistry team member can confirm
              anything important at (855) 476-5870.
            </p>

            <p className="privacy-note">
              This chat is recorded and stored to help us
              serve you better.
            </p>

            <button
              className="start-chat"
              type="button"
              onClick={() => setChatStarted(true)}
            >
              Start chat <span>→</span>
            </button>

            <button className="learn-more" type="button">
              Learn more
            </button>
          </>
        )}
      </div>

      <p className="assistant-footnote">
        The AI Loan Assistant is an AI tool, not a person.
        Responses may contain errors.
      </p>
    </aside>
  );
}

// Fetch portal JSON configuration using API hook
function PortalConfiguration() {
  const { data, loading, error } = useFeatureFlagApi({
    apiKey: "dev-api-key",
    environment: "dev",
    subjectId: "user-123",
    flagKey: "new-portal-config",
  });

  if (loading) {
    return (
      <div className="config-card">
        <h3>Portal Configuration</h3>
        <p>Loading configuration...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="config-card">
        <h3>Portal Configuration</h3>
        <p className="config-error">
          Unable to load configuration: {error}
        </p>
      </div>
    );
  }

  return (
    <div className="config-card">
      <h3>Portal Configuration</h3>
      <p>Configuration fetched successfully from the API.</p>

      <pre>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}

// Main application
function App() {
  const [briefcaseStarted, setBriefcaseStarted] = useState(false);
  const [continueMessage, setContinueMessage] = useState("");

  return (
    <main className="page-shell">
      {/* Page heading */}
      <header className="page-header">
        <div>
          <span className="eyebrow">LOAN APPLICATION</span>

          <h1>Getting Prepared</h1>

          <p>
            Gather these documents to speed up your application
          </p>
        </div>

        <div className="progress">
          <span className="progress-step current">1</span>
          <i />
          <span className="progress-step">2</span>
          <i />
          <span className="progress-step">3</span>
        </div>
      </header>

      {/* Main layout */}
      <div className="page-grid">

        {/* OrigenLink Chat: visible only when flag is true */}
        <FeatureFlag
          flagKey="new-portal-access"
          defaultValue={false}
          matchValue={true}
          fallback={null}
        >
          <AssistantPanel />
        </FeatureFlag>

        {/* Documents section */}
        <section className="main-column">
          <div className="documents-card">

            <div className="card-header">
              <div>
                <span className="eyebrow">YOUR CHECKLIST</span>
                <h2>Documents You'll Need</h2>
              </div>

              <span className="ready-pill">
                GET READY
              </span>
            </div>

            {/* Financial documents */}
            <section className="document-section">
              <h3>Financial documents</h3>

              <div className="document-grid">
                {financialDocuments.map((doc) => (
                  <DocumentItem
                    key={doc.title}
                    {...doc}
                  />
                ))}
              </div>
            </section>

            {/* Business and legal documents */}
            <section className="document-section">
              <h3>Business &amp; legal</h3>

              <div className="document-grid">
                {legalDocuments.map((doc) => (
                  <DocumentItem
                    key={doc.title}
                    {...doc}
                  />
                ))}
              </div>
            </section>

            {/* Document Briefcase: visible only when flag is true */}
            <FeatureFlag
              flagKey="loan-application-flow-v2"
              defaultValue={false}
              matchValue={true}
              fallback={null}
            >
              <section className="briefcase-section">
                <div className="briefcase-copy">
                  <div>
                    <h3>Document Briefcase</h3>

                    <p>
                      Connecting Document Briefcase is required
                      to continue. Uploading documents now is
                      optional — you can share them later.
                    </p>
                  </div>

                  <span className="optional-pill">
                    OPTIONAL UPLOAD
                  </span>
                </div>

                <button
                  className={`upload-action ${
                    briefcaseStarted ? "started" : ""
                  }`}
                  type="button"
                  onClick={() => setBriefcaseStarted(true)}
                >
                  <span className="upload-symbol">↑</span>

                  <strong>
                    {briefcaseStarted
                      ? "Document Briefcase setup started"
                      : "Finish Setting Up Document Briefcase"}
                  </strong>

                  <span className="upload-arrow">→</span>
                </button>

                <p className="file-note">
                  PDF, JPG, PNG or DOCX · Max 50 MB per file
                </p>
              </section>
            </FeatureFlag>
          </div>

          {/* API configuration demo */}
          <PortalConfiguration />

          {/* Continue button */}
          <div className="continue-wrap">
            <button
              className="continue-button"
              type="button"
              onClick={() =>
                setContinueMessage(
                  "Your preparation checklist is ready for the next step."
                )
              }
            >
              Continue <span>→</span>
            </button>

            {continueMessage && (
              <p className="continue-message" role="status">
                {continueMessage}
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default App;
