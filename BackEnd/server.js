require("dotenv").config();

const express = require("express");


const tokenRoutes = require("./src/routes/tokenRoutes");
const vehicleRoutes = require("./src/routes/vehicleRoutes");
const { connectDB } = require("./src/config/db")
connectDB();

const app = express();

app.use(express.json());

app.use("/api/token", require("./src/routes/tokenRoutes"));
app.use("/api", require("./src/routes/vehicleRoutes"));

const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {

  console.log(`Server Running On Port ${PORT}`);
});