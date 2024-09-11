import dotenv from "dotenv";
import app from "./src/app.js";

// Load environment variables
dotenv.config();

// Specify the .env file path if running outside of Docker
if (!process.env.DOCKER) {
  dotenv.config({ path: "../.env" });
}

// Start the server
app.listen(process.env.BACKEND_PORT, () => {
  console.log(`Server is running on port ${process.env.BACKEND_PORT}`);
});
