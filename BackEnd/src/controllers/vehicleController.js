const { getLiveData } = require("../services/vehicleService");

const fetchLiveData = async (req, res) => {
  try {
    const data = await getLiveData();

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch live data",
      error: error.message,
    });
  }
};

module.exports = {
  fetchLiveData,
};