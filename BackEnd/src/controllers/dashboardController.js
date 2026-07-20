

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
const dashboardService = require("../services/dashboardService");

const getDashboard = async (req, res) => {
  try {
    const dashboardData = await dashboardService.getDashboardData();
    res.status(200).json(dashboardData);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
module.exports = {
  getDashboard,
};
