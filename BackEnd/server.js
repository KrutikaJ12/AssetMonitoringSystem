require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");

const tokenRoutes = require("./src/routes/tokenRoutes");
const vehicleRoutes = require("./src/routes/vehicleRoutes");
const dashboardRoutes = require("./src/routes/dashboardRoutes");
const authRoutes = require("./src/routes/authRoutes");
const siteRoutes = require("./src/routes/siteRoutes");
const opratorRoutes = require("./src/routes/operatorRoutes");
const userRoutes = require("./src/routes/userRoutes");

const { connectDB } = require("./src/config/db");

const app = express();

// CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(helmet());
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api", tokenRoutes);
app.use("/api", vehicleRoutes);
app.use("/api", dashboardRoutes);
app.use("/api/auth", authRoutes);
app.use("/api",siteRoutes)
app.use("/api",opratorRoutes)
const PORT = process.env.PORT;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on ${PORT}`);
    });
  } catch (error) {
    console.error("Server failed to start:", error);
  }
};

startServer();