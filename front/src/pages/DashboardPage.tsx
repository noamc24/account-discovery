import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getMeRequest } from "../api/authApi";
import type { User } from "../types/auth.types";


function DashboardPage() {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [serverMessage, setServerMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/");
        return;
      }

      try {
        const data = await getMeRequest(token);
        setUser(data.user);
        setServerMessage(data.message);
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setErrorMessage(
          error instanceof Error ? error.message : "Failed to load dashboard"
        );

        setTimeout(() => {
          navigate("/");
        }, 1200);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  if (isLoading) {
    return (
      <main className="dashboard-page">
        <section className="dashboard-card">
          <p className="dashboard-loading">Loading your dashboard...</p>
        </section>
      </main>
    );
  }

  return (
    <main className="dashboard-page">
      <section className="dashboard-card">
        <div className="dashboard-top">
          <div>
            <p className="dashboard-badge">Protected Area</p>
            <h1>Dashboard</h1>
            <p className="dashboard-subtitle">
              This page proves your token and auth middleware are working.
            </p>
          </div>

          <div className="dashboard-actions">
            <Link className="scan-link-button" to="/scan">
              Open scan page
            </Link>

            <button className="logout-button" onClick={handleLogout}>
              Log out
            </button>
          </div>
        </div>

        {errorMessage ? (
          <div className="dashboard-error-box">
            <p>{errorMessage}</p>
          </div>
        ) : (
          <>
            <div className="dashboard-success-box">
              <h2>Server response</h2>
              <p>{serverMessage}</p>
            </div>

            <div className="user-grid">
              <div className="user-card">
                <span className="user-card__label">Full name</span>
                <strong>{user?.fullName}</strong>
              </div>

              <div className="user-card">
                <span className="user-card__label">Email</span>
                <strong>{user?.email}</strong>
              </div>

              <div className="user-card">
                <span className="user-card__label">User ID</span>
                <strong className="user-id">{user?.id}</strong>
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
}

export default DashboardPage;