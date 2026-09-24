const { sql, getPool } = require("../config/db");

async function getSummary(userId, customerId) {
    const pool = await getPool();

    const result = await pool
        .request()
        .input("UserID", sql.BigInt, userId)
        .input("CustomerID", sql.BigInt, customerId)
        .execute("dbo.usp_Dashboard_GetSummary");

    return result.recordset[0];
}

async function getLiveAssets({
    userId,
    customerId,
    status,
    siteId,
    searchText,
    pageNumber,
    pageSize
}) {
    const pool = await getPool();

    const result = await pool
        .request()
        .input("UserID", sql.BigInt, userId)
        .input("CustomerID", sql.BigInt, customerId)
        .input("Status", sql.NVarChar(30), status || null)
        .input("SiteID", sql.BigInt, siteId || null)
        .input("SearchText", sql.NVarChar(100), searchText || null)
        .input("PageNumber", sql.Int, pageNumber)
        .input("PageSize", sql.Int, pageSize)
        .execute("dbo.usp_Dashboard_GetLiveAssets");

    const rows = result.recordset || [];

    return {
        totalRecords: rows.length > 0 ? rows[0].TotalRecords : 0,
        pageNumber,
        pageSize,
        assets: rows.map(row => {
            const { TotalRecords, ...asset } = row;
            return asset;
        })
    };
}

async function getAssetTypes(userId, customerId) {
    const pool = await getPool();

    const result = await pool
        .request()
        .input("UserID", sql.BigInt, userId)
        .input("CustomerID", sql.BigInt, customerId)
        .execute("dbo.usp_Dashboard_GetAssetTypes");

    return result.recordset || [];
}

async function getRecentAlerts(userId, customerId) {
    const pool = await getPool();

    const result = await pool
        .request()
        .input("CustomerID", sql.BigInt, customerId)
        .query(`
            SELECT TOP 3
                aal.AlertID,
                aal.AssetID,
                am.AssetName,
                aal.AlertType,
                aal.AlertLevel,
                aal.AlertMessage,
                aal.AlertDateTime
            FROM dbo.AssetAlertLog aal
            INNER JOIN dbo.AssetMaster am
                ON aal.AssetID = am.AssetID
            WHERE
                aal.CustomerID = @CustomerID
                AND am.Status = 'Active'
            ORDER BY aal.AlertDateTime DESC;
        `);

    return result.recordset || [];
}

async function getSiteSummary(userId, customerId) {
    const pool = await getPool();

    const result = await pool
        .request()
        .input("UserID", sql.BigInt, userId)
        .input("CustomerID", sql.BigInt, customerId)
        .query(`
            SELECT Top 4
                sm.SiteID,
                sm.SiteName,

                COUNT(DISTINCT ais.AssetID) AS TotalAssets,

                COUNT(
                    DISTINCT CASE
                        WHEN als.CurrentStatus IN ('RUNNING', 'WORKING')
                        THEN ais.AssetID
                    END
                ) AS ActiveAssets,

                COUNT(
                    DISTINCT CASE
                        WHEN als.CurrentStatus = 'IDLE'
                        THEN ais.AssetID
                    END
                ) AS IdleAssets,

                COUNT(DISTINCT om.OperatorID) AS Operators

            FROM dbo.SiteMaster sm

            LEFT JOIN dbo.AssetInSite ais
                ON sm.SiteID = ais.SiteID

            LEFT JOIN dbo.AssetMaster am
                ON ais.AssetID = am.AssetID
                AND am.Status = 'Active'
                AND am.CustomerID = @CustomerID

            LEFT JOIN dbo.AssetLiveStatus als
                ON am.AssetID = als.AssetID

            LEFT JOIN dbo.OperatorMaster om
                ON sm.SiteID = om.SiteID
                AND om.IsActive = 1

            WHERE
                sm.CustomerID = @CustomerID
                AND sm.IsActive = 1

            GROUP BY
                sm.SiteID,
                sm.SiteName

            ORDER BY
                sm.SiteName;
        `);

    return result.recordset || [];
}
module.exports = {
    getSummary,
    getLiveAssets,
    getAssetTypes,
    getRecentAlerts,
    getSiteSummary
    
};