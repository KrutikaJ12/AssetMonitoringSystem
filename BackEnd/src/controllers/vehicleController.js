const getVehicleData = require("../services/trakzeeService");

const fetchVehicles = async (req, res) => {
  try {
    const data = await getVehicleData();

    res.json(data);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  fetchVehicles
};