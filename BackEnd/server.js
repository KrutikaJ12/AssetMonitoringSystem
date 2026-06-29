require("dotenv").config();

const express = require("express");



const app = express();

app.use(express.json());

app.use("/api/token", require("./src/routes/tokenRoutes"));
app.use("/api", require("./src/routes/vehicleRoutes"));

const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {

  console.log(`Server Running On Port ${PORT}`);
});