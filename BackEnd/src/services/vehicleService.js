const axios = require("axios");
const { getValidToken } = require("./tokenService");

const getLiveData = async () => {
  try {
    const token = await getValidToken(1);

    const response = await axios.post(
      `${process.env.IOT_BASE_URL}?token=getTokenBaseLiveData&ProjectId=${process.env.PROJECT_ID}`,
      {
        company_names: "",
        vehicle_nos: "",
        imei_nos: "",
        format: "json",
      },
      {
        headers: {
          "Content-Type": "application/json",
          "auth-code": token,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(error.response?.data || error.message);
    throw error;
  }
};

module.exports = {
  getLiveData,
};