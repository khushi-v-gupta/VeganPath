import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const endpoint = isRegister
        ? "http://localhost:5000/api/auth/register"
        : "http://localhost:5000/api/auth/login";

      const body = isRegister
        ? { name, email, password }
        : { email, password };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      if (isRegister) {
        setSuccess("Registration successful! You can now login.");

        setName("");
        setEmail("");
        setPassword("");

        setIsRegister(false);
      } else {
        // Save authentication information
        login(data.user, data.token);

        setSuccess("Login successful!");

        // Go to dashboard
        setTimeout(() => {
          navigate("/dashboard");
        }, 500);
      }

    } catch (err) {
      console.error("Authentication error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-header">

          <span>🌱 VEGAN PATH</span>

          <h1>
            {isRegister
              ? "Create Your Account"
              : "Welcome Back"}
          </h1>

          <p>
            {isRegister
              ? "Start your healthy vegan journey."
              : "Continue your healthy vegan journey."}
          </p>

        </div>


        <form onSubmit={handleSubmit}>

          {isRegister && (
            <div className="form-group">

              <label>
                Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
              />

            </div>
          )}


          <div className="form-group">

            <label>
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />

          </div>


          <div className="form-group">

            <label>
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />

          </div>


          {error && (
            <p className="auth-error">
              ⚠️ {error}
            </p>
          )}


          {success && (
            <p className="auth-success">
              ✅ {success}
            </p>
          )}


          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : isRegister
                ? "Create Account"
                : "Login"}
          </button>

        </form>


        <div className="auth-switch">

          <p>
            {isRegister
              ? "Already have an account?"
              : "Don't have an account?"}
          </p>

          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
              setSuccess("");
            }}
          >
            {isRegister
              ? "Login"
              : "Create an account"}
          </button>

        </div>

      </div>

    </div>
  );
}

export default Login;