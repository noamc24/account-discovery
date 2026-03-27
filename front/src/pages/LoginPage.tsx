import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { loginRequest } from "../api/authApi";

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const data = await loginRequest({ email, password });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/dashboard");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-card__content">
          <div className="auth-header">
            <p className="auth-badge">Account Discovery</p>
            <h1>Welcome back</h1>
            <p className="auth-subtitle">
              Sign in to continue to your dashboard and protected routes test.
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
              />
            </div>

            {errorMessage && <p className="form-error">{errorMessage}</p>}

            <button className="auth-button" type="submit" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              First time here? Register through Thunder Client for now, and then
              sign in here.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default LoginPage;