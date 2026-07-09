require("dotenv").config();

const express = require("express");


const tokenRoutes = require("./src/routes/tokenRoutes");
const vehicleRoutes = require("./src/routes/vehicleRoutes");
const dashboardRoutes = require("./src/routes/dashboardRoutes");
const { connectDB } = require("./src/config/db")
connectDB();

const app = express();

app.use(express.json());

app.use("/api", tokenRoutes);
app.use("/api", vehicleRoutes);
app.use("/api", dashboardRoutes);
const PORT = process.env.PORT;

app.listen(PORT, () => {

  console.log(`Server Running On Port ${PORT}`);
});