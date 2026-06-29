const axios = require("axios");
const https = require("https");
const getToken = require("../utils/tokenManager");

const getVehicleData = async () => {
  const token = await getToken();

  const response = await axios.post(
    "https://13.127.228.11/webservice?token=getTokenBaseLiveData&ProjectId=37",
    {
      company_names: "",
      vehicle_nos: "",
      imei_nos: "",
      format: "json"
    },
    {
      headers: {
        "Content-Type": "application/json",
        "auth-code": token
      },
      httpsAgent: new https.Agent({
        rejectUnauthorized: false
      })
    }
  );

  return response.data;
};

module.exports = getVehicleData;