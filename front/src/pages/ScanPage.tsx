import { useState } from "react";
import type { ReactElement } from "react";
import { Link, useNavigate } from "react-router-dom";
import { scanEmailRequest } from "../api/scanApi";
import type { ScanResult } from "../api/scanApi";

function formatEvidence(evidence: ScanResult["evidence"]): string {
  if (!Array.isArray(evidence) || evidence.length === 0) {
    return "No evidence available";
  }

  return evidence.map((item) => item.matchedText).join(", ");
}

function ScanPage() {
  const navigate = useNavigate();

  const [isScanning, setIsScanning] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);
  const [results, setResults] = useState<ScanResult[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [serverMessage, setServerMessage] = useState("");
  const [totalEmailsScanned, setTotalEmailsScanned] = useState(0);
  const [totalServicesFound, setTotalServicesFound] = useState(0);
  const [scanMode, setScanMode] = useState<"quick" | "deep" | "full">("quick");

  const handleScan = async (mode: "quick" | "deep" | "full") => {
    setErrorMessage("");
    setServerMessage("");
    setScanMode(mode);
    setIsScanning(true);
    setHasScanned(false);

    try {
      const data = await scanEmailRequest(mode);

      setResults(data.results || []);
      setServerMessage(data.message);
      setTotalEmailsScanned(data.totalEmailsScanned || 0);
      setTotalServicesFound(data.totalServicesFound || 0);
      setHasScanned(true);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";

      setErrorMessage(message);

      if (message.toLowerCase().includes("gmail is not connected")) {
        navigate("/dashboard");
      }
    } finally {
      setIsScanning(false);
    }
  };

  const getConfidenceClass = (confidence: string): string => {
    if (confidence === "High") return "confidence-badge confidence-badge--high";
    if (confidence === "Medium") {
      return "confidence-badge confidence-badge--medium";
    }
    return "confidence-badge confidence-badge--low";
  };

  return (
    <main className="scan-page">
      <section className="scan-card">
        <div className="scan-header">
          <div>
            <p className="dashboard-badge">Account Discovery</p>
            <h1>Scan my Gmail</h1>
            <p className="scan-subtitle">
              Quick scan is faster and more targeted. Deep scan checks a wider
              range of emails for better coverage.
            </p>
          </div>

          <Link className="scan-back-link" to="/dashboard">
            Back to dashboard
          </Link>
        </div>

        <div
          className="scan-form"
          style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}
        >
          <button
            className="auth-button scan-button"
            type="button"
            onClick={() => handleScan("quick")}
            disabled={isScanning}
          >
            {isScanning && scanMode === "quick"
              ? "Running quick scan..."
              : "Start Quick Scan"}
          </button>

          <button
            className="auth-button scan-button"
            type="button"
            onClick={() => handleScan("deep")}
            disabled={isScanning}
            style={{ opacity: isScanning ? 0.7 : 1 }}
          >
            {isScanning && scanMode === "deep"
              ? "Running deep scan..."
              : "Start Deep Scan"}
          </button>

          <button
            className="auth-button scan-button"
            type="button"
            onClick={() => handleScan("full")}
            disabled={isScanning}
            style={{ opacity: isScanning ? 0.7 : 1 }}
          >
            {isScanning && scanMode === "full"
              ? "Running full scan..."
              : "Start Full Scan"}
          </button>
        </div>

        {errorMessage && <p className="form-error">{errorMessage}</p>}

        {isScanning && (
          <div className="scan-loading-box">
            <div className="scan-spinner" aria-hidden="true"></div>
            <div>
             <h2>
              {scanMode === "quick"
                ? "Quick scan in progress"
                : scanMode === "deep"
                ? "Deep scan in progress"
                : "Full scan in progress"}
            </h2>
            <p>
              {scanMode === "quick"
                ? "Scanning a targeted set of Gmail messages..."
                : scanMode === "deep"
                ? "Scanning a wider set of Gmail messages... this can take longer."
                : "Scanning all available Gmail messages... this can take several minutes."}
            </p>
            </div>
          </div>
        )}

        {hasScanned && !isScanning && (
          <section className="scan-results-section">
            <div className="scan-results-header">
              <h2>Detected services</h2>
              <p>
                {totalServicesFound} services found from {totalEmailsScanned}{" "}
                scanned emails
              </p>
            </div>

            {serverMessage && (
              <div
                className="dashboard-success-box"
                style={{ marginBottom: "1rem" }}
              >
                <h2>Server response</h2>
                <p>{serverMessage}</p>
              </div>
            )}

            {results.length === 0 ? (
              <div className="dashboard-success-box">
                <h2>No services found</h2>
                <p>
                  The scan completed, but no messages matched the current
                  detection rules.
                </p>
              </div>
            ) : (
              <div className="scan-results-grid">
                {results.map((result): ReactElement => (
                  <article
                    className="scan-result-card"
                    key={`${result.serviceKey}-${result.type}`}
                  >
                    <div className="scan-result-top">
                      <h3>{result.serviceName}</h3>

                      <span className={getConfidenceClass(result.confidence)}>
                        {result.confidence}
                      </span>
                    </div>

                    <p className="scan-result-type">{result.type}</p>

                    <p style={{ fontSize: "0.9rem", opacity: 0.7 }}>
                      Domain: {result.domain}
                    </p>

                    <p style={{ fontSize: "0.9rem", opacity: 0.7 }}>
                      Score: {result.score}
                    </p>

                    <p style={{ fontSize: "0.9rem", opacity: 0.7 }}>
                      Emails: {result.relatedEmailIds.length}
                    </p>

                    <div className="scan-evidence-box">
                      <span className="scan-evidence-label">Evidence</span>
                      <p>{formatEvidence(result.evidence)}</p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}
      </section>
    </main>
  );
}

export default ScanPage;