import { useMemo, useState } from "react";
import type { FormEvent, ReactElement } from "react";
import { Link, useNavigate } from "react-router-dom";
import { scanEmailRequest } from "../api/scanApi";
import type { ScanResult } from "../api/scanApi";

function ScanPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);
  const [results, setResults] = useState<ScanResult[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [serverMessage, setServerMessage] = useState("");

  const emailLooksValid = useMemo(() => {
    return /\S+@\S+\.\S+/.test(email);
  }, [email]);

  const handleScan = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setServerMessage("");

    if (!email.trim()) {
      setErrorMessage("Please enter an email address.");
      return;
    }

    if (!emailLooksValid) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    setIsScanning(true);
    setHasScanned(false);

    try {
      const data = await scanEmailRequest(email, token);
      setResults(data.results);
      setServerMessage(data.message);
      setHasScanned(true);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setIsScanning(false);
    }
  };

  const getConfidenceClass = (confidence: string): string => {
    if (confidence === "High") return "confidence-badge confidence-badge--high";
    if (confidence === "Medium") return "confidence-badge confidence-badge--medium";
    return "confidence-badge confidence-badge--low";
  };

  return (
    <main className="scan-page">
      <section className="scan-card">
        <div className="scan-header">
          <div>
            <p className="dashboard-badge">Account Discovery</p>
            <h1>Scan an email</h1>
            <p className="scan-subtitle">
              This page now sends a real request to your backend and returns
              scan results from the API.
            </p>
          </div>

          <Link className="scan-back-link" to="/dashboard">
            Back to dashboard
          </Link>
        </div>

        <form className="scan-form" onSubmit={handleScan}>
          <div className="form-group">
            <label htmlFor="scan-email">Email address</label>
            <input
              id="scan-email"
              type="email"
              placeholder="Enter an email to scan"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          {errorMessage && <p className="form-error">{errorMessage}</p>}

          <button className="auth-button scan-button" type="submit" disabled={isScanning}>
            {isScanning ? "Scanning..." : "Start scan"}
          </button>
        </form>

        {isScanning && (
          <div className="scan-loading-box">
            <div className="scan-spinner" aria-hidden="true"></div>
            <div>
              <h2>Scanning in progress</h2>
              <p>Contacting backend API and building discovery results...</p>
            </div>
          </div>
        )}

        {hasScanned && !isScanning && (
          <section className="scan-results-section">
            <div className="scan-results-header">
              <h2>Detected services</h2>
              <p>{results.length} findings for {email}</p>
            </div>

            {serverMessage && (
              <div className="dashboard-success-box" style={{ marginBottom: "1rem" }}>
                <h2>Server response</h2>
                <p>{serverMessage}</p>
              </div>
            )}

            <div className="scan-results-grid">
              {results.map((result): ReactElement => (
                <article className="scan-result-card" key={`${result.serviceName}-${result.type}`}>
                  <div className="scan-result-top">
                    <h3>{result.serviceName}</h3>
                    <span className={getConfidenceClass(result.confidence)}>
                      {result.confidence}
                    </span>
                  </div>

                  <p className="scan-result-type">{result.type}</p>

                  <div className="scan-evidence-box">
                    <span className="scan-evidence-label">Evidence</span>
                    <p>{result.evidence}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </section>
    </main>
  );
}

export default ScanPage;