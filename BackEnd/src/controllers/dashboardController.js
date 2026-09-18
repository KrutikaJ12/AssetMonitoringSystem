// const getDashboard = async (req, res) => {
//   try {
//     const [
//       totalAssets,
//       totalSites,
//       activeOperators,
//       assetTypes,
//     ] = await Promise.all([
//       sql.query(`
//         SELECT COUNT(*) AS TotalAssets
//         FROM AssetMaster
//       `),

//       sql.query(`
//         SELECT COUNT(*) AS TotalSites
//         FROM SiteMaster
//       `),

//       sql.query(`
//         SELECT COUNT(*) AS ActiveOperators
//         FROM OperatorMaster
//         WHERE IsActive = 1
//       `),

//       sql.query(`
//         SELECT
//           atm.AssetTypeName,
//           COUNT(*) AS Total
//         FROM AssetMaster am
//         INNER JOIN AssetTypeMaster atm
//           ON am.AssetTypeID = atm.AssetTypeID
//         GROUP BY atm.AssetTypeName
//       `),
//     ]);
//  console.log(assetTypes,"assettypes")
//     res.status(200).json({
//       totalAssets: totalAssets.recordset[0].TotalAssets,
//       totalSites: totalSites.recordset[0].TotalSites,
//       activeOperators: activeOperators.recordset[0].ActiveOperators,
//       assetTypes: assetTypes.recordset,
//       recentAlerts: [],
//     });
//   } catch (error) {
//     console.error(error);

//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };

// module.exports = {
//   getDashboard,
// };

//  Receive Request -> call service -> Return Response
// const dashboardService = require("../services/dashboardService");

// const getDashboard = async (req, res) => {
//   try {
//     const dashboardData = await dashboardService.getDashboardData();
//     res.status(200).json(dashboardData);
//   } catch (err) {
//     res.status(500).json({
//       message: err.message,
//     });
//   }
// };
// module.exports = {
//   getDashboard,
// };

const dashboardRepository = require("../repositories/dashboardRepository");

async function getSummary(req, res, next) {
  try {
    const summary = await dashboardRepository.getSummary(
      req.auth.userId,
      req.auth.customerId,
    );

    const assetTypes = await dashboardRepository.getAssetTypes(
      req.auth.userId,
      req.auth.customerId,
    );
    const recentAlerts = await dashboardRepository.getRecentAlerts(
      req.auth.userId,
      req.auth.customerId,
    );
    // const siteSummary = await dashboardRepository.getSiteSummary(
    //   req.auth.userId,
    //   req.auth.customerId,
    // );
    return res.status(200).json({
      success: true,

      data: {
        summary: {
          totalAssets: Number(summary?.TotalAssets || 0),
          runningAssets: Number(summary?.RunningAssets || 0),
          idleAssets: Number(summary?.IdleAssets || 0),
          stoppedAssets: Number(summary?.StoppedAssets || 0),
          offlineAssets: Number(summary?.OfflineAssets || 0),
          unknownAssets: Number(summary?.UnknownAssets || 0),
          totalSites: Number(summary?.TotalSites || 0),
          activeOperators: Number(summary?.ActiveOperators || 0),
        },

        assetStatus: [
          {
            status: "RUNNING",
            count: Number(summary?.RunningAssets || 0),
          },
          {
            status: "IDLE",
            count: Number(summary?.IdleAssets || 0),
          },
          {
            status: "STOPPED",
            count: Number(summary?.StoppedAssets || 0),
          },
          {
            status: "OFFLINE",
            count: Number(summary?.OfflineAssets || 0),
          },
        ],
        workingHours: {
          summary: {
            engineHours: Number(summary?.TodayEngineHours || 0),
            workingHours: Number(summary?.TodayWorkingHours || 0),
            idleHours: Number(summary?.TodayIdleHours || 0),
            stoppedHours: Number(summary?.TodayStoppedHours || 0),
          },
        },
        assetTypes: assetTypes.map((item) => ({
          assetType: item.AssetTypeName,
          count: Number(item.Total || 0),
        })),
        recentAlerts: recentAlerts.map((alert) => ({
          alertId: alert.AlertID,
          assetId: alert.AssetID,
          assetName: alert.AssetName,
          alertType: alert.AlertType,
          alertLevel: alert.AlertLevel,
          alertMessage: alert.AlertMessage,
          alertDateTime: alert.AlertDateTime,
        })),
        // siteSummary: siteSummary.map((site) => ({
        //   siteId: site.SiteID,
        //   siteName: site.SiteName,
        //   totalAssets: Number(site.TotalAssets || 0),
        //   activeAssets: Number(site.ActiveAssets || 0),
        //   idleAssets: Number(site.IdleAssets || 0),
        //   operators: Number(site.Operators || 0),
        //   maintenance: 0,
        //   fuelConsumption: 0,
        //   utilization: 0,
        // })),
      },
    });
  } catch (error) {
    next(error);
  }
}

async function getLiveAssets(req, res, next) {
  try {
    const pageNumber = Math.max(Number(req.query.page || 1), 1);

    const pageSize = Math.min(
      Math.max(Number(req.query.pageSize || 50), 1),
      200,
    );

    const result = await dashboardRepository.getLiveAssets({
      userId: req.auth.userId,
      customerId: req.auth.customerId,
      status: req.query.status || null,
      siteId: req.query.siteId ? Number(req.query.siteId) : null,
      searchText: req.query.search || null,
      pageNumber,
      pageSize,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getSummary,
  getLiveAssets,
};
