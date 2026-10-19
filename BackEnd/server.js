require("dotenv").config();
const http = require("http"); // <-- Yeh add karo
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
const reportRoutes = require("./src/routes/reportRoutes");

// Socket aur Worker imports
const { initSocket } = require("./src/sockets/socketServer");
const { startPacketWorker } = require("./src/services/packetWorker");

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
app.use("/api/reports", reportRoutes);

// HTTP server create karo taaki Socket.io attach ho sake
const server = http.createServer(app);

// Socket.io initialize karo
initSocket(server);

const PORT = process.env.PORT;

const startServer = async () => {
    await connectDB();

    server.listen(PORT, () => {
        console.log(`Server running on ${PORT}`);

        // Background packet processing worker start karo
        startPacketWorker();
    });
};

startServer();