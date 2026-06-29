const generateAccessToken = require("../services/tokenService");

const getToken = async () => {
  const response = await generateAccessToken();

  if (!response?.data?.token) {
    throw new Error("Token not found");
  }

  return response.data.token;
};

module.exports = getToken;