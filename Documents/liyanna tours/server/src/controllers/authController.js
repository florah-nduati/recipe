import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const client = new PrismaClient();

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if email and password are provided
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Find the user by email
    const user = await client.user.findFirst({
      where: { email: email },
    });

    // Check if user exists
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Compare the password with the hashed password in the database
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create a JWT token with an expiration time
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h", // Set expiration time (e.g., 1 hour)
    });

    // Send the token as a cookie and return user data
    res
      .status(200)
      .cookie("authToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      })
      .json({ message: "Login successful", user });
  } catch (e) {
    // Log and handle errors
    console.error("Error logging in:", e);
    res.status(500).json({ message: "Something went wrong", error: e.message });
  }
};
