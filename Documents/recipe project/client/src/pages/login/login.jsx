import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import apiBase from "../../utils/api";
import useUserStore from "../../store/userStore";
import "./login.css";

function Login() {
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState(null);
  const setUser = useUserStore((state) => state.setUser);
  const navigate = useNavigate();

  const { mutate, isLoading } = useMutation({
    mutationFn: async function (credentials) {
      const response = await fetch(`${apiBase}/auth/login`, {
        method: "POST",
        body: JSON.stringify(credentials),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      const data = await response.json();
      return data;
    },
    onSuccess: (data) => {
      setUser(data);
      localStorage.setItem("isAuthenticated", "true");
      setFormError("Login successful!");
      setTimeout(() => navigate("/explore"), 1000);
    },
    onError: () => setFormError("Invalid credentials, please try again."),
  });

  function handleSubmit(e) {
    e.preventDefault();
    setFormError(null);

    if (!emailAddress) {
      setFormError("Please enter your email address.");
      return;
    }
    if (!password) {
      setFormError("Please enter your password.");
      return;
    }

    const payload = {
      emailAddress,
      password,
    };

    mutate(payload);

    setEmailAddress("");
    setPassword("");
  }

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Log In to Your Account</h2>

        <label htmlFor="emailAddress" className="label">
          Email address
        </label>
        <input
          type="email"
          id="emailAddress"
          name="emailAddress"
          placeholder="Enter your email address"
          value={emailAddress}
          onChange={(e) => setEmailAddress(e.target.value)}
          required
        />

        <label htmlFor="password" className="label">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="button-submit" disabled={isLoading}>
          {isLoading ? "Loading..." : "Log In"}
        </button>

        {formError && (
          <p
            className="form-error"
            style={{
              color: formError.includes("Invalid") ? "red" : "green",
            }}
          >
            {formError}
          </p>
        )}

        <p className="login-prompt">
          Don't have an account? <a href="/sign-up">Create One</a>
        </p>
      </form>
    </div>
  );
}

export default Login;
