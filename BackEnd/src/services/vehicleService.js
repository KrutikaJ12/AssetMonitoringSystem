const axios = require("axios");
const { getValidToken } = require("./tokenService");
const { sql } = require("../config/db");
function formatDate(dateStr) {
  if (!dateStr) return null;

  const [date, time] = dateStr.split(" ");
  const [day, month, year] = date.split("-");

  return `${year}-${month}-${day} ${time}`;
}

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
      },
    );
    const liveData = response.data;
   console.log("liveData",liveData)
    const vehicle = liveData.root?.VehicleData?.[0];
    console.log("vehicle", vehicle);
    const gpsActualTime = formatDate(vehicle?.GPSActualTime);
    const deviceTime = formatDate(vehicle?.Datetime);

    const result = await sql.query`
    SELECT id
    FROM UffizioRawData
    WHERE imei_no = ${vehicle.Imeino}
`;

    if (result.recordset.length > 0) {
      await sql.query`
    UPDATE UffizioRawData
    SET
    vehicle_name = ${vehicle.Vehicle_Name},
    company = ${vehicle.Company},
    vehicle_no = ${vehicle.Vehicle_No},
    branch = ${vehicle.Branch},
    vehicle_type = ${vehicle.Vehicletype},
    vin = ${vehicle.Vin},
    device_model = ${vehicle.DeviceModel},
    username = ${vehicle.username},
    status = ${vehicle.Status},
    speed = ${parseInt(vehicle.Speed) || 0},
    ign = ${vehicle.IGN},
    power = ${vehicle.Power},
    gps = ${vehicle.GPS},
    heartbeat = ${vehicle.heartbeat},
    latitude = ${parseFloat(vehicle.Latitude) || 0},
    longitude = ${parseFloat(vehicle.Longitude) || 0},
    altitude = ${parseFloat(vehicle.Altitude) || 0},
    angle = ${parseFloat(vehicle.Angle) || 0},
    gps_actual_time = ${gpsActualTime},
    device_time = ${deviceTime},
    location = ${vehicle.Location},
    odometer = ${parseInt(vehicle.Odometer) || 0},
    can_odometer = ${parseInt(vehicle.can_odometer) || 0},
    fuel_level = ${vehicle.Fuel?.[0]?.value || 0},
    external_voltage = ${parseFloat(vehicle.ExternalVolt) || 0},
    battery_percentage = ${parseInt(vehicle.battery_percentage) || 0},
    temperature = ${vehicle.Temperature},
    ac = ${vehicle.AC},
    door1 = ${vehicle.Door1},
    door2 = ${vehicle.Door2},
    door3 = ${vehicle.Door3},
    door4 = ${vehicle.Door4},
    elock = ${vehicle.elock},
    immobilize_state = ${vehicle.Immobilize_State},
    ibutton_rfid = ${vehicle["Ibutton/RFID"]},
    sos = ${vehicle.SOS},
    driver_first_name = ${vehicle.Driver_First_Name},
    driver_middle_name = ${vehicle.Driver_Middle_Name},
    driver_last_name = ${vehicle.Driver_Last_Name},
    poi = ${vehicle.POI},
    mcc = ${vehicle.mcc},
    mnc = ${vehicle.mnc},
    lac = ${vehicle.lac},
    cellid = ${vehicle.cellid},
    gps_hdop = ${vehicle.gps_hdop},
    satellite_count = ${vehicle.satellite_count},
    course = ${vehicle.course},
    updated_at = GETDATE()
    WHERE imei_no = ${vehicle?.Imeino}
`;
    } else {
      await sql.query`
INSERT INTO UffizioRawData
(
    vehicle_name,
    company,
    vehicle_no,
    branch,
    vehicle_type,
    imei_no,
    vin,
    device_model,
    username,
    status,
    speed,
    ign,
    power,
    gps,
    heartbeat,
    latitude,
    longitude,
    altitude,
    angle,
    gps_actual_time,
    device_time,
    location,
    odometer,
    can_odometer,
    fuel_level,
    external_voltage,
    battery_percentage,
    temperature,
    ac,
    door1,
    door2,
    door3,
    door4,
    elock,
    immobilize_state,
    ibutton_rfid,
    sos,
    driver_first_name,
    driver_middle_name,
    driver_last_name,
    poi,
    mcc,
    mnc,
    lac,
    cellid,
    gps_hdop,
    satellite_count,
    course
)
VALUES
(
    ${vehicle.Vehicle_Name},
    ${vehicle.Company},
    ${vehicle.Vehicle_No},
    ${vehicle.Branch},
    ${vehicle.Vehicletype},
    ${vehicle.Imeino},
    ${vehicle.Vin},
    ${vehicle.DeviceModel},
    ${vehicle.username},
    ${vehicle.Status},
    ${parseInt(vehicle.Speed) || 0},
    ${vehicle.IGN},
    ${vehicle.Power},
    ${vehicle.GPS},
    ${vehicle.heartbeat},
    ${parseFloat(vehicle.Latitude) || 0},
    ${parseFloat(vehicle.Longitude) || 0},
    ${parseFloat(vehicle.Altitude) || 0},
    ${parseFloat(vehicle.Angle) || 0},
    ${gpsActualTime},
    ${deviceTime},
    ${vehicle.Location},
    ${parseInt(vehicle.Odometer) || 0},
    ${parseInt(vehicle.can_odometer) || 0},
    ${vehicle.Fuel?.[0]?.value || 0},
    ${parseFloat(vehicle.ExternalVolt) || 0},
    ${parseInt(vehicle.battery_percentage) || 0},
    ${vehicle.Temperature},
    ${vehicle.AC},
    ${vehicle.Door1},
    ${vehicle.Door2},
    ${vehicle.Door3},
    ${vehicle.Door4},
    ${vehicle.elock},
    ${vehicle.Immobilize_State},
    ${vehicle["Ibutton/RFID"]},
    ${vehicle.SOS},
    ${vehicle.Driver_First_Name},
    ${vehicle.Driver_Middle_Name},
    ${vehicle.Driver_Last_Name},
    ${vehicle.POI},
    ${vehicle.mcc},
    ${vehicle.mnc},
    ${vehicle.lac},
    ${vehicle.cellid},
    ${vehicle.gps_hdop},
    ${vehicle.satellite_count},
    ${vehicle.course}
)
`;
    }

    return liveData;
    // return response.data;
  } catch (error) {
    console.log(error.response?.status);
    console.log(error.response?.data);
    console.log(error.message);
    console.error(error.response?.data || error.message, "error");
    throw error;
  }
};

module.exports = {
  getLiveData,
};
