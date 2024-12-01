import React, { useState } from "react";
import { useMutation } from "react-query";
import "./signup.css";
import apiBase from "../../utils/api";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [surName, setSurName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState(null);

  const navigate = useNavigate();

  const { mutate, isLoading } = useMutation({
    mutationFn: async function (newUser) {
      try {
        const response = await fetch(`${apiBase}/users`, {
          method: "POST",
          body: JSON.stringify(newUser),
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          const error = await response.json();
          console.error("API error response:", error);
          throw new Error(error.message || "Error occurred during sign up.");
        }
        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Error during mutation:", error); 
        throw error; 
      }
    },
    onSuccess: () => {
      setFormError("Successfully signed up!");
      setTimeout(() => navigate("/login"), 2000);
    },
    onError: (error) => {
      console.error("Error signing up:", error);
      setFormError(`Error signing up: ${error.message || "Please try again."}`);
    },
  });

  async function handleSubmit(e) {
    e.preventDefault();

    if (password !== confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    setFormError(null);

    try {
      const newUser = {
        firstName,
        middleName,
        surName,
        emailAddress,
        password,
      };
      mutate(newUser);
    } catch (err) {
      setFormError("Error submitting form. Please try again.");
      console.error("Error during form submission:", err);
    }

    setFirstName("");
    setMiddleName("");
    setSurName("");
    setEmailAddress("");
    setPassword("");
    setConfirmPassword("");
  }

  return (
    <div className="sign-up">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>New here? Sign up to create a new account</h2>

        <label htmlFor="first-name" className="label">
          First name
        </label>
        <input
          type="text"
          id="first-name"
          name="firstName"
          placeholder="First name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />

        <label htmlFor="middle-name" className="label">
          Middle Name
        </label>
        <input
          type="text"
          id="middle-name"
          name="middleName"
          placeholder="Middle Name"
          value={middleName}
          onChange={(e) => setMiddleName(e.target.value)}
          required
        />

        <label htmlFor="surname" className="label">
          Surname
        </label>
        <input
          type="text"
          id="surname"
          name="surname"
          placeholder="Surname"
          value={surName}
          onChange={(e) => setSurName(e.target.value)}
          required
        />

        <label htmlFor="email" className="label">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
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

        <label htmlFor="confirm-password" className="label">
          Confirm Password
        </label>
        <input
          type="password"
          id="confirm-password"
          name="confirmPassword"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button type="submit" id="signUpBtn" disabled={isLoading}>
          {isLoading ? "Loading..." : "Sign Up"}
        </button>

        <p
          className="message"
          id="message"
          style={{
            color: formError && formError.includes("Error") ? "red" : "green",
          }}
        >
          {formError}
        </p>

        <p className="signup-prompt">
          Already have an account? <a href="/login">Log in</a>
        </p>
      </form>
    </div>
  );
}

export default SignUp;
