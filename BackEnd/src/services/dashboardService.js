// The service is responsible for talking to SQL Server.
const { sql } = require("../config/db");

const getDashboardData = async () => {
  try {
    const [
      totalAssets,
      totalSites,
      activeOperators,
      assetStatus,
      assetTypes,
      workingHours,
      topWorkingAssets,
    ] = await Promise.all([
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

      sql.query(`SELECT
    SUM(WorkingMinutes) AS TotalWorkingMinutes,
    SUM(IdleMinutes) AS TotalIdleMinutes,
    SUM(StoppedMinutes) AS TotalStoppedMinutes,
    SUM(OfflineMinutes) AS TotalOfflineMinutes
       FROM AssetDailyUsageSummary
       WHERE UsageDate = '2026-07-07';`),

      sql.query(`SELECT Top 5
       am.AssetID AS AssetID,
       am.AssetName,
       SUM(ads.WorkingMinutes) AS TotalWorkingMinutes
       FROM AssetDailyUsageSummary ads
       INNER JOIN AssetMaster am
       ON ads.AssetID = am.AssetID
      WHERE ads.UsageDate = '2026-07-07'
      GROUP BY 
          am.AssetID,
          am.AssetName 
      ORDER BY TotalWorkingMinutes Desc;`),
    ]);
    console.log(workingHours, topWorkingAssets);
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
      workingHours: {
        summary: {
          workingHours: Number(
            (workingHours.recordset[0].TotalWorkingMinutes / 60).toFixed(1),
          ),
          idleHours: Number(
            (workingHours.recordset[0].TotalIdleMinutes / 60).toFixed(1),
          ),
          stoppedHours: Number(
            (workingHours.recordset[0].TotalStoppedMinutes / 60).toFixed(1),
          ),
          offlineHours: Number(
            (workingHours.recordset[0].TotalOfflineMinutes / 60).toFixed(1),
          ),
        },
        topAssets: topWorkingAssets.recordset.map((item) => ({
          assetId:item.AssetID,
          assetName: item.AssetName,
          workingHours: Number((item.TotalWorkingMinutes / 60).toFixed(1)),
        })),
      },
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
