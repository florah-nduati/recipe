import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

async function validateUserInformation(req, res, next) {
  const { name, email, password } = req.body;

  if (!name) {
    res.status(400).json({ message: "insert your name" });
    return;
  }
  if (!email) {
    res.status(400).json({ message: "insert your email" });
    return;
  }
  if (!password) {
    res.status(400).json({ message: "insert your password" });
    return;
  }
  const userEmail = await client.user.findFirst({
    where: { email: email },
  });
  if (userEmail) {
    res.status(400).json({ message: "emailAdress exists" });
    return;
  }
  next();
}
export default validateUserInformation;
