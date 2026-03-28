import { useMemo, useState } from "react";
import type { FormEvent, ReactElement } from "react";
import { Link } from "react-router-dom";

interface MockScanResult {
  serviceName: string;
  type: string;
  confidence: string;
  evidence: string;
}

function ScanPage() {
  const [email, setEmail] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);
  const [results, setResults] = useState<MockScanResult[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  const emailLooksValid = useMemo(() => {
    return /\S+@\S+\.\S+/.test(email);
  }, [email]);

  const handleScan = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    if (!email.trim()) {
      setErrorMessage("Please enter an email address.");
      return;
    }

    if (!emailLooksValid) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setIsScanning(true);
    setHasScanned(false);

    await new Promise((resolve) => setTimeout(resolve, 1400));

    const mockResults: MockScanResult[] = [
      {
        serviceName: "Spotify",
        type: "Likely account",
        confidence: "High",
        evidence: "Welcome email + password reset pattern",
      },
      {
        serviceName: "Amazon",
        type: "Purchase relationship",
        confidence: "High",
        evidence: "Order confirmation and receipt activity",
      },
      {
        serviceName: "LinkedIn",
        type: "Likely account",
        confidence: "Medium",
        evidence: "Security alert and sign-in emails",
      },
      {
        serviceName: "Adidas",
        type: "Newsletter only",
        confidence: "Low",
        evidence: "Marketing emails with unsubscribe header",
      },
    ];

    setResults(mockResults);
    setHasScanned(true);
    setIsScanning(false);
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
              This is the first UI step of the discovery engine. For now it
              shows mock detection results so we can build the full flow cleanly.
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
              <p>Analyzing mailbox evidence and building initial results...</p>
            </div>
          </div>
        )}

        {hasScanned && !isScanning && (
          <section className="scan-results-section">
            <div className="scan-results-header">
              <h2>Detected services</h2>
              <p>{results.length} findings for {email}</p>
            </div>

            <div className="scan-results-grid">
              {results.map((result): ReactElement => (
                <article className="scan-result-card" key={result.serviceName}>
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