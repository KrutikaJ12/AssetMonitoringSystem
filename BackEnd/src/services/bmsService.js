const { sql, getPool } = require("../config/db");

const getBMSInsights = async (assetId, customerId) => {
  const pool = getPool();

  const result = await pool
    .request()
    .input("AssetID", sql.BigInt, assetId)
    .input("CustomerID", sql.BigInt, customerId)
    .execute("dbo.usp_BMS_GetInsights");

  const recordsets = result.recordsets;
  return {
    batteryInfo: recordsets[0]?.[0] || null,
    liveTelemetry: recordsets[1]?.[0] || null,
    cellReadings: recordsets[2] || [],
    alarms: recordsets[3] || [],
    historicalTelemetry: recordsets[4] || [],
  };
};

module.exports = {
  getBMSInsights,
};
