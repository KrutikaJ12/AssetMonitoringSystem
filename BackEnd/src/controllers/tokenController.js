const generateAccessToken = require("../services/tokenService");

const getToken = async (req, res) => {
  try {
    const data = await generateAccessToken();
    res.json(data);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getToken,
};