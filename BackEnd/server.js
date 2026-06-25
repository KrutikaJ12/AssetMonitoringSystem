require("dotenv").config();

const express = require("express");
const cors = require("cors");

const tokenRoutes = require("./src/routes/tokenRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", tokenRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});