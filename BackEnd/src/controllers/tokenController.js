const {
  generateAccessToken,
} = require("../services/tokenService");

const getAccessToken = async (req, res) => {
  try {
    const token = await generateAccessToken();

    res.status(200).json(token);
  } catch (error) {
    res.status(500).json({
      message: "Failed to generate token",
      error: error.message,
    });
  }
};

module.exports = {
  getAccessToken,
};