import { PrismaClient } from "@prisma/client";
import mailjet from "node-mailjet";

const prisma = new PrismaClient();

// Initialize Mailjet with your API keys
const mailjetClient = mailjet.apiConnect(
  "ca68b96e9f67feb2145247aced609b8e", // Your Mailjet API Key
  "a510e551c1c62961d0ba1db5b002356e", // Your Mailjet Secret Key
);
export const createBooking = async (req, res) => {
  try {
    console.log("Booking request received:", req.body);

    const {
      name,
      email,
      date,
      people,
      packageType,
      tourType,
      paymentOption,
      message,
    } = req.body;

    // Use req.userId directly from the decoded token
    const userId = req.userId;

    // Check if user exists by userId
    let user = await prisma.user.findUnique({
      where: { id: userId },
    });

    // If user doesn't exist, create a new user (optional, based on your logic)
    if (!user) {
      user = await prisma.user.create({
        data: { name, email },
      });
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        userId: user.id,
        date: new Date(date),
        people,
        packageType,
        tourType,
        paymentOption,
        message,
      },
    });

    console.log("Booking created successfully:", booking);

    res.status(201).json({ success: true, booking });
  } catch (error) {
    console.error("Error creating booking:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};
