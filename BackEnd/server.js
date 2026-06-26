require("dotenv").config();

const express = require("express");
const cors = require("cors");

const tokenRoutes = require("./src/routes/tokenRoutes");
const vehicleRoutes = require("./src/routes/vehicleRoutes");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", tokenRoutes);
app.use("/api", vehicleRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});