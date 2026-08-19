require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");

const tokenRoutes = require("./src/routes/tokenRoutes");
const vehicleRoutes = require("./src/routes/vehicleRoutes");
const dashboardRoutes = require("./src/routes/dashboardRoutes");
const authRoutes = require("./src/routes/authRoutes");
const siteRoutes = require("./src/routes/siteRoutes")
const opratorRoutes = require("./src/routes/operatorRoutes");
const assetRoutes = require("./src/routes/assetRoutes");
const userRoutes = require("./src/routes/userRoutes");
const { connectDB } = require("./src/config/db")
// connectDB();

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api", tokenRoutes);
app.use("/api", vehicleRoutes);
app.use("/api", dashboardRoutes);
app.use("/api/auth", authRoutes);
app.use("/api",siteRoutes)
app.use("/api",opratorRoutes)
app.use("/api",assetRoutes);
app.use("/api",userRoutes)
const PORT = process.env.PORT;

const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Server running on ${PORT}`);
    });
};

startServer();