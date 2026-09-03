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
      siteSummary,
      recentAlerts,
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
       FROM AssetDailyUsage
       WHERE UsageDate = '2026-07-07';`),

      sql.query(`
        SELECT Top 5
       am.AssetID AS AssetID,
       am.AssetName,
       SUM(ads.WorkingMinutes) AS TotalWorkingMinutes
       FROM AssetDailyUsage ads
       INNER JOIN AssetMaster am
       ON ads.AssetID = am.AssetID
      WHERE ads.UsageDate = '2026-07-07'
      GROUP BY 
          am.AssetID,
          am.AssetName 
      ORDER BY TotalWorkingMinutes Desc;`),

      sql.query(`SELECT
          sm.SiteID,
          sm.SiteName,
          COUNT(DISTINCT ais.AssetID) AS TotalAssets,
          COUNT(DISTINCT om.OperatorID) AS Operators,
          COUNT(DISTINCT CASE WHEN am.Status = 'RUNNING' THEN am.AssetID END) AS ActiveAssets,
          COUNT(DISTINCT CASE WHEN am.Status = 'IDLE' THEN am.AssetID END) AS IdleAssets,
          ISNULL(SUM(ads.FuelConsumedLitres), 0) AS TotalFuelConsumed,
          ISNULL(
          ROUND(
        SUM(ads.WorkingMinutes) * 100.0 /
        NULLIF(SUM(ads.EngineOnMinutes), 0),
        2
    ),
    0
)       AS UtilizationPercentage
      FROM SiteMaster sm
      LEFT JOIN AssetInSite ais
    ON sm.SiteID = ais.SiteID
      LEFT JOIN AssetMaster am
    ON ais.AssetID = am.AssetID
      LEFT JOIN OperatorMaster om
    ON sm.SiteID = om.SiteID
      LEFT JOIN AssetDailyUsage ads
    ON am.AssetID = ads.AssetID
      WHERE sm.CustomerID = 1
      AND ads.UsageDate = '2026-07-07'
      GROUP BY
    sm.SiteID,
    sm.SiteName
      ORDER BY
    sm.SiteID;`),

      sql.query(`
      SELECT TOP 3
    al.AlertID,
    am.AssetName,
    al.AlertType,
    al.AlertLevel,
    al.AlertMessage,
    al.AlertDateTime
FROM AssetAlertLog al
INNER JOIN AssetMaster am
    ON al.AssetID = am.AssetID
WHERE al.CustomerID = 1
ORDER BY al.AlertDateTime DESC;`),
    ]);
    // console.log(workingHours, topWorkingAssets);
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
      recentAlerts: recentAlerts.recordset.map((alert) => ({
        alertId: alert.AlertID,
        assetName: alert.AssetName,
        alertType: alert.AlertType,
        alertLevel: alert.AlertLevel,
        alertMessage: alert.AlertMessage,
        alertDateTime: alert.AlertDateTime,
      })),
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
          assetId: item.AssetID,
          assetName: item.AssetName,
          workingHours: Number((item.TotalWorkingMinutes / 60).toFixed(1)),
        })),
      },
      siteSummary: siteSummary.recordset.map((site) => ({
        siteId: site.SiteID,
        siteName: site.SiteName,
        totalAssets: site.TotalAssets,
        activeAssets: site.ActiveAssets,
        idleAssets: site.IdleAssets,
        maintenanceAssets: site.MaintenanceAssets,
        operators: site.Operators,
        totalFuelConsumed: Number(site.TotalFuelConsumed),
        utilizationPercentage: Number(site.UtilizationPercentage),
      })),
      fuelConsumption: {
        summary: {
          targetFuel: 12540,
          actualFuel: 10980,
          unit: "L",
        },

        analytics: {
          period: "monthly",

          data: [
            { label: "1 Jul", value: 520 },
            { label: "2 Jul", value: 610 },
            { label: "3 Jul", value: 480 },
            { label: "4 Jul", value: 700 },
            { label: "5 Jul", value: 640 },
            { label: "6 Jul", value: 590 },
            { label: "7 Jul", value: 760 },
          ],
        },
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
