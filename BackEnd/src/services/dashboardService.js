// The service is responsible for talking to SQL Server.
const { sql } = require("../config/db");

const getDashboardData = async () => {
  try {
    const [totalAssets, totalSites, activeOperators, assetStatus, assetTypes] =
      await Promise.all([
        sql.query(`
        SELECT COUNT(*) AS TotalAssets
        FROM AssetMaster
      `),

        sql.query(`
        SELECT COUNT(*) AS TotalSites
        FROM SiteMaster
      `),

        sql.query(`
        SELECT COUNT(*) AS ActiveOperators
        FROM OperatorMaster
        WHERE IsActive = 1
      `),

        sql.query(`
    SELECT
        Status,
        COUNT(*) AS Total
    FROM AssetMaster
    GROUP BY Status
   `),
        sql.query(`
            SELECT
              atm.AssetTypeName,
              COUNT(*) AS Total
            FROM AssetMaster am
            INNER JOIN AssetTypeMaster atm
              ON am.AssetTypeID = atm.AssetTypeID
            GROUP BY atm.AssetTypeName
          `),
      ]);
      console.log(assetStatus)
    const runningAssets =
      assetStatus.recordset.find((item) => item.Status === "RUNNING")?.Total ||
      0;
    const idleAssets =
      assetStatus.recordset.find((item) => item.Status === "IDLE")?.Total || 0;
    const dashboardData = {
      summary: {
        totalAssets: totalAssets.recordset[0].TotalAssets,
        activeAssets: runningAssets,
        idleAssets: idleAssets,
        totalSites: totalSites.recordset[0].TotalSites,
        activeOperators: activeOperators.recordset[0].ActiveOperators,
      },
      assetStatus: assetStatus.recordset.map((item) => ({
        status: item.Status,
        count: item.Total,
      })),
      assetTypes: assetTypes.recordset.map((item) => ({
        assetType: item.AssetTypeName,
        count: item.Total,
      })),
      recentAlerts: [],
      //   totalAssets: totalAssets.recordset[0].TotalAssets,
      //   totalSites: totalSites.recordset[0].TotalSites,
      //   activeOperators: activeOperators.recordset[0].ActiveOperators,
      //   assetTypes: assetTypes.recordset,
      //   recentAlerts: [],
    };
    return dashboardData;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

module.exports = {
  getDashboardData,
};

