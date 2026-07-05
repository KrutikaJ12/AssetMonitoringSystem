const axios = require("axios");
const { getValidToken } = require("./tokenService");
const { sql } = require("../config/db");
const {formatDate,parseUffizioDate}=require("../helpers/dateHelper")
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
   if (liveData.root?.error) {
  console.log("Uffizio API Error:", liveData.root.error);
  return;
}
    const vehicle = liveData.root?.VehicleData?.[0];
    console.log("vehicle", vehicle);
    const gpsActualTime = formatDate(vehicle?.GPSActualTime);
    const deviceTime = formatDate(vehicle?.Datetime);

   //What is the last time I inserted data for this vehicle?
    const result = await sql.query`
    SELECT
    DATEDIFF(
        SECOND,
        gps_actual_time,
        ${gpsActualTime}
    ) AS DifferenceInSeconds
     FROM (
    SELECT TOP 1 gps_actual_time
    FROM UffizioRawData
    WHERE imei_no = ${vehicle.Imeino}
    ORDER BY gps_actual_time DESC
    ) t;
`;
  //  console.log("resultkts",result)
  console.log("Scheduler Time:", new Date().toLocaleTimeString());
   console.log("Raw API GPSActualTime:", vehicle.GPSActualTime);
   let shouldInsert = false;
   const ONE_MINUTE = 60 * 1000;
    if (result.recordset.length === 0) {
          shouldInsert = true;
    } else {
  //   const lastGpsTime = result.recordset[0].gps_actual_time;
  //   const currentGpsTime = parseUffizioDate(vehicle.GPSActualTime);
  //   const difference = currentGpsTime.getTime() - lastGpsTime.getTime();
  //  console.log("DB Time:", lastGpsTime);
  //  console.log("API Time:", currentGpsTime);
  //  console.log("Difference (ms):", difference);
  //  console.log("Difference (seconds):", difference / 1000);
  //  console.log("Difference (minutes):", difference / 60000);
     const seconds = result.recordset[0].DifferenceInSeconds;

    console.log("Difference:", seconds);

    shouldInsert = seconds >= 60;
  //  shouldInsert = difference >= ONE_MINUTE;

    console.log("Should Insert:", shouldInsert);
    }
   if (shouldInsert) {
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
    console.log("Inserted new history record");
  } else {
    console.log("Skipped - Less than one minute");
    }

    return liveData;
    // return response.data;
  } catch (error) {
    console.error(error.response?.data || error.message, "error");
    throw error;
  }
};

module.exports = {
  getLiveData,
};
