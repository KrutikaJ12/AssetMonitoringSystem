const axios = require("axios");

const generateAccessToken = async () => {
  try {
    const response = await axios.post(
      `${process.env.IOT_BASE_URL}?token=generateAccessToken`,
      {
        username: process.env.IOT_USERNAME,
        password: process.env.IOT_PASSWORD,
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error while generating token:", error.message);
    throw error;
  }
};

module.exports = {
  generateAccessToken,
};