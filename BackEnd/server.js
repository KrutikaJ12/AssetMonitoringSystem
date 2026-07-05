require("dotenv").config();

const express = require("express");
const cors = require("cors");

const tokenRoutes = require("./src/routes/tokenRoutes");
const vehicleRoutes = require("./src/routes/vehicleRoutes");
const startVehicleScheduler = require("./src/schedulers/vehicleScheduler");
const { connectDB } = require("./src/config/db")
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", tokenRoutes);
app.use("/api", vehicleRoutes);

const PORT = process.env.PORT;

async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);

    startVehicleScheduler();
  });
}

startServer();