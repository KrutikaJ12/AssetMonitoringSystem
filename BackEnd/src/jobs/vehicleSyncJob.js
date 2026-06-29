const getVehicleData = require("../services/trakzeeService");
const { poolPromise } = require("../config/db");

const syncVehicles = async () => {
  try {
    const data = await getVehicleData();

    const vehicles = data.root.VehicleData;

    const pool = await poolPromise;

    for (const vehicle of vehicles) {
      await pool
        .request()
        .input("VehicleNo", vehicle.Vehicle_No)
        .input("VehicleName", vehicle.Vehicle_Name)
        .input("Company", vehicle.Company)
        .input("Latitude", vehicle.Latitude)
        .input("Longitude", vehicle.Longitude)
        .input("Speed", vehicle.Speed)
        .input("Status", vehicle.Status)
        .input("ImeiNo", vehicle.Imeino)
        .input("Location", vehicle.Location)
        .query(`
          INSERT INTO VehicleLiveData
          (
            VehicleNo,
            VehicleName,
            Company,
            Latitude,
            Longitude,
            Speed,
            Status,
            ImeiNo,
            Location
          )
          VALUES
          (
            @VehicleNo,
            @VehicleName,
            @Company,
            @Latitude,
            @Longitude,
            @Speed,
            @Status,
            @ImeiNo,
            @Location
          )
        `);
    }

    console.log("Vehicle Data Saved");
  } catch (error) {
    console.log(error);
  }
};

module.exports = syncVehicles;