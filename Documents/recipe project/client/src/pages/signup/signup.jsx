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
  const [profileImage, setProfileImage] = useState("");
  const [formError, setFormError] = useState(null);

  const navigate = useNavigate();

  const { mutate, isLoading } = useMutation({
    mutationFn: async function (newUser) {
      const response = await fetch(`${apiBase}/users`, {
        method: "POST",
        body: JSON.stringify(newUser),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      const data = await response.json();
      return data;
    },
    onSuccess: () => {
      setFormError("Successfully signed up!");
      setTimeout(() => navigate("/login"), 2000);
    },
    onError: () => setFormError("Error signing up. Please try again."),
  });

  async function uploadImageToCloudinary(file) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("v5fhffpd", "your_unsigned_preset"); // Replace with your Cloudinary upload preset

    const response = await fetch(`https://api.cloudinary.com/v1_1/dbxiinf5v/image/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Image upload failed");
    }

    const data = await response.json();
    return data.secure_url; // Return the uploaded image URL
  }

  async function generateDefaultAvatar(firstName) {
    const initial = firstName[0]?.toUpperCase() || "A"; // Default to "A" if firstName is empty
    const avatarUrl = `https://via.placeholder.com/150/000000/FFFFFF/?text=${initial}`;
    return avatarUrl;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (password !== confirmPassword) {
      setFormError("Passwords do not match");
      return;
    }

    setFormError(null);

    try {
      let imageUrl;
      if (profileImage) {
        imageUrl = await uploadImageToCloudinary(profileImage); // Upload image if provided
      } else {
        imageUrl = await generateDefaultAvatar(firstName); // Generate default avatar
      }

      const newUser = {
        firstName,
        middleName,
        surName,
        emailAddress,
        password,
        profileImage: imageUrl, // Use either uploaded image or default avatar
      };

      mutate(newUser);
    } catch (err) {
      setFormError("Error uploading image. Please try again.");
      console.error(err);
    }

    setFirstName("");
    setMiddleName("");
    setSurName("");
    setEmailAddress("");
    setPassword("");
    setConfirmPassword("");
    setProfileImage("");
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

        <label htmlFor="profile-image" className="label">
          Profile Image
        </label>
        <input
          type="file"
          id="profile-image"
          name="profileImage"
          accept="image/*"
          onChange={(e) => setProfileImage(e.target.files[0])}
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

