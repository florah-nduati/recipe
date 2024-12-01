import React, { useState } from "react";
import { useMutation } from "react-query";
import useUserStore from "../../store/userStore";
import apiBase from "../../utils/api";
import "./passwordUpdate.css";

function PasswordUpdateForm() {
  const [previousPassword, setPreviousPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const user = useUserStore((state) => state.user);

  const { mutate, isLoading } = useMutation({
    mutationFn: async (passwords) => {
      const response = await fetch(`${apiBase}/auth/password`, {
        method: "PATCH",
        body: JSON.stringify(passwords),
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

    onSuccess: () => {
      setMessage("Your password has been successfully updated!");
      setMessageType("success");
      setPreviousPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },

    onError: (err) => {
      setMessage(`Error: ${err.message}`);
      setMessageType("error");
    },
  });

  function handlePasswordUpdate(e) {
    e.preventDefault();
    setMessage("");

    if (!previousPassword) {
      setMessage("Previous password is required.");
      setMessageType("error");
      return;
    }
    if (!newPassword) {
      setMessage("New password is required.");
      setMessageType("error");
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage("New password and confirmation do not match.");
      setMessageType("error");
      return;
    }

    mutate({
      userId: user.id,
      previousPassword,
      newPassword,
    });
  }

  return (
    <div className="password-section">
      <div className="password-update-form">
        <h2 className="form-title">Update Password</h2>

        {message && (
          <div
            className={`message ${messageType === "success" ? "success" : "error"}`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handlePasswordUpdate} className="form">
          <div className="form-group">
            <label htmlFor="previous-password" className="form-label">
              Previous Password:
            </label>
            <input
              type="password"
              id="previous-password"
              className="form-input"
              value={previousPassword}
              onChange={(e) => setPreviousPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="new-password" className="form-label">
              New Password:
            </label>
            <input
              type="password"
              id="new-password"
              className="form-input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirm-password" className="form-label">
              Confirm New Password:
            </label>
            <input
              type="password"
              id="confirm-password"
              className="form-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PasswordUpdateForm;
