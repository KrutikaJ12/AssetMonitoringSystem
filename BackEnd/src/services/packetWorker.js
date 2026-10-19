const sql = require("mssql");
const { getPool } = require("../config/db");
const { broadcastAssetUpdate } = require("./liveUpdateService");

// Latitude/Longitude conversion helper
function convertToDecimalDegrees(coordStr, direction) {
  if (!coordStr || !direction) return null;
  const num = parseFloat(coordStr);
  if (isNaN(num)) return null;
  
  const degrees = Math.floor(num / 100);
  const minutes = num % 100;
  let decimal = degrees + (minutes / 60);
  
  if (direction === 'S' || direction === 'W') {
    decimal = -decimal;
  }
  return decimal;
}

// Atlanta EL-400 Full Protocol Parser Function
function parseTelemetryPacket(packetString) {
  try {
    if (!packetString) return null;

    let deviceIdentifier = null;
    let eventDateTime = new Date();
    let speed = 0;
    let ignition = false;
    let odometer = null;
    let latitude = null;
    let longitude = null;

    // 1. CAN Data Format: H,ATLCAN,IMEI,TIME(HHMMSS),DATE(DDMMYY),...
    if (packetString.startsWith("H,")) {
      const parts = packetString.split(",");
      if (parts.length >= 5) {
        deviceIdentifier = parts[2];
        const timeStr = parts[3]; 
        const dateStr = parts[4]; 

        if (timeStr && timeStr.length >= 6 && dateStr && dateStr.length === 6) {
          const hours = timeStr.substring(0, 2);
          const minutes = timeStr.substring(2, 4);
          const seconds = timeStr.substring(4, 6);

          const day = dateStr.substring(0, 2);
          const month = dateStr.substring(2, 4);
          const year = "20" + dateStr.substring(4, 6);

          const parsedDate = new Date(`${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`);
          if (!isNaN(parsedDate.getTime())) {
            eventDateTime = parsedDate; 
          }
        }
        speed = 40; 
        ignition = true;
      }
    } 
    // 2. GPS Data Format: ATL<IMEI>,$GPRMC,...
    else if (packetString.includes("$GPRMC")) {
      const matchDevice = packetString.match(/ATL(\d{15}),/);
      if (matchDevice) {
        deviceIdentifier = matchDevice[1];
      }

      const gprmcMatch = packetString.match(/\$GPRMC,([^\,]*),([^\,]*),([^\,]*),([^\,]*),([^\,]*),([^\,]*),([^\,]*),([^\,]*),([^\,]*)/);
      if (gprmcMatch) {
        const timeStr = gprmcMatch[1]; 
        const latStr = gprmcMatch[3];
        const latDir = gprmcMatch[4];
        const lonStr = gprmcMatch[5];
        const lonDir = gprmcMatch[6];
        const speedKnots = parseFloat(gprmcMatch[7]) || 0; 
        const dateStr = gprmcMatch[9]; 
        
        speed = Math.round(speedKnots * 1.852);
        latitude = convertToDecimalDegrees(latStr, latDir);
        longitude = convertToDecimalDegrees(lonStr, lonDir);

        if (timeStr && timeStr.length >= 6 && dateStr && dateStr.length === 6) {
          const hours = timeStr.substring(0, 2);
          const minutes = timeStr.substring(2, 4);
          const seconds = timeStr.substring(4, 6);

          const day = dateStr.substring(0, 2);
          const month = dateStr.substring(2, 4);
          const year = "20" + dateStr.substring(4, 6);

          const parsedDate = new Date(`${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`);
          if (!isNaN(parsedDate.getTime())) {
            eventDateTime = parsedDate; 
          }
        }
      }

      const hashSplit = packetString.split("#");
      if (hashSplit.length > 1) {
        const ioAndData = hashSplit[1];
        const subParts = ioAndData.split(",");

        if (subParts.length > 0) {
          const ioStatusBinary = subParts[0]; 
          if (ioStatusBinary.length > 0) {
            ignition = ioStatusBinary.charAt(0) === '1';
          }
        }

        for (let i = 3; i < subParts.length; i++) {
          const val = subParts[i];
          if (!odometer && val && val.includes(".") && val.length > 5) {
            odometer = parseFloat(val);
          }
        }
      }
    }

    if (!deviceIdentifier) return null;

    const status = (speed > 0 || ignition) ? "WORKING" : "STOPPED";

    return {
      deviceIdentifier,
      speed,
      status,
      eventDateTime,
      odometer,
      latitude,
      longitude
    };
  } catch (err) {
    console.error("Packet parsing error:", err.message);
    return null;
  }
}

function startPacketWorker() {
  console.log("Packet processing background worker started...");

  setInterval(async () => {
    try {
      const pool = getPool();
      if (!pool) return;

      const result = await pool.request()
        .query(`
          SELECT TOP 50 RawID, DeviceIdentifier, 
                 COALESCE(CustomerID, 1) AS CustomerID, 
                 COALESCE(AssetID, 1) AS AssetID, 
                 ReceivedDateTimeUtc, RawPacket 
          FROM AssetRawData 
          WHERE ProcessingStatus = 'PENDING'
        `);

      const pendingPackets = result.recordset;
      if (pendingPackets.length === 0) return;

      for (let packet of pendingPackets) {
        const { RawID, CustomerID, AssetID, ReceivedDateTimeUtc, RawPacket } = packet;

        const parsed = parseTelemetryPacket(RawPacket);
        if (!parsed) {
          await pool.request()
            .input("rawId", sql.Int, RawID)
            .input("err", sql.VarChar, "Invalid packet format")
            .query(`UPDATE AssetRawData SET ProcessingStatus = 'FAILED', ErrorMessage = @err WHERE RawID = @rawId`);
          continue;
        }

        const { 
          deviceIdentifier: DeviceIdentifier, 
          speed, 
          status, 
          eventDateTime,
          odometer,
          latitude,
          longitude
        } = parsed;

        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        try {
          // 1. Insert history event data with RawID, Latitude, and Longitude
          await transaction.request()
            .input("rawId", sql.Int, RawID)
            .input("device", sql.VarChar, DeviceIdentifier)
            .input("customerId", sql.Int, CustomerID)
            .input("assetId", sql.BigInt, AssetID)
            .input("speed", sql.Int, speed)
            .input("lat", sql.Float, latitude)
            .input("lon", sql.Float, longitude)
            .input("eventTime", sql.DateTime2, eventDateTime)
            .input("receivedTime", sql.DateTime2, ReceivedDateTimeUtc || new Date())
            .query(`
              INSERT INTO AssetEventData 
              (RawID, DeviceIdentifier, CustomerID, AssetID, SpeedKph, Latitude, Longitude, EventDateTimeUtc, ReceivedDateTimeUtc, CreatedDateTimeUtc) 
              VALUES (@rawId, @device, @customerId, @assetId, @speed, @lat, @lon, @eventTime, @receivedTime, GETDATE())
            `);

          // 2. Upsert live status table
          await transaction.request()
            .input("device", sql.VarChar, DeviceIdentifier)
            .input("assetId", sql.BigInt, AssetID)
            .input("customerId", sql.Int, CustomerID)
            .input("status", sql.VarChar, status)
            .input("speed", sql.Int, speed)
            .input("lat", sql.Float, latitude)
            .input("lon", sql.Float, longitude)
            .input("eventTime", sql.DateTime2, eventDateTime)
            .query(`
              IF EXISTS (SELECT 1 FROM AssetLiveStatus WHERE AssetID = @assetId)
              BEGIN
                UPDATE AssetLiveStatus 
                SET DeviceIdentifier = @device, CustomerID = @customerId, CurrentStatus = @status, SpeedKph = @speed, Latitude = @lat, Longitude = @lon, UpdatedDateTimeUtc = @eventTime 
                WHERE AssetID = @assetId
              END
              ELSE
              BEGIN
                INSERT INTO AssetLiveStatus (AssetID, DeviceIdentifier, CustomerID, CurrentStatus, SpeedKph, Latitude, Longitude, UpdatedDateTimeUtc)
                VALUES (@assetId, @device, @customerId, @status, @speed, @lat, @lon, @eventTime)
              END
            `);

          // 3. Mark raw packet as processed
          await transaction.request()
            .input("rawId", sql.Int, RawID)
            .query(`UPDATE AssetRawData SET ProcessingStatus = 'PROCESSED' WHERE RawID = @rawId`);

          await transaction.commit();
          console.log(`Successfully processed RawID: ${RawID} with Lat/Long`);

          // 4. Broadcast via Socket.IO
          broadcastAssetUpdate({
            deviceIdentifier: DeviceIdentifier,
            status: status,
            speed: speed,
            latitude: latitude,
            longitude: longitude,
            odometer: odometer,
            updatedAt: eventDateTime
          });

        } catch (innerErr) {
          await transaction.rollback();
          console.error(`Error processing RawID ${RawID}:`, innerErr.message);

          await pool.request()
            .input("rawId", sql.Int, RawID)
            .input("err", sql.VarChar, innerErr.message)
            .query(`UPDATE AssetRawData SET ProcessingStatus = 'FAILED', ErrorMessage = @err WHERE RawID = @rawId`);
        }
      }

    } catch (err) {
      console.error("Worker loop error:", err.message);
    }
  }, 3000);
}

module.exports = { startPacketWorker };