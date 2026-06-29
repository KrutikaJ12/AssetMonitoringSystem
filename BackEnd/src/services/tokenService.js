const axios = require("axios");
const https = require("https");

const generateAccessToken = async () => {
  const response = await axios.post(
    "https://13.127.228.11/webservice?token=generateAccessToken",
    {
      username: process.env.IOT_USERNAME,
      password: process.env.IOT_PASSWORD,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    }
  );

  return response.data;
};

module.exports = generateAccessToken;