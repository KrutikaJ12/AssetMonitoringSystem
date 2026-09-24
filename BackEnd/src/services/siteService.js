const { sql, getPool } = require("../config/db");
const { createAuditLog } = require("../services/auditLogService");
async function getSites(customerId) {
  const pool = await getPool();

  const result = await pool.request().input("CustomerID", sql.Int, customerId)
    .query(`
    SELECT 
        sm.SiteID, 
        sm.SiteName, 
        sm.LocationName, 
        sm.Latitude, 
        sm.Longitude, 
        sm.IsActive, 

        COUNT(DISTINCT am.AssetID) AS AssetCount, 

        manager.UserID AS SiteManagerID, 
        manager.FullName AS SiteManagerName 

    FROM SiteMaster sm 

    LEFT JOIN AssetInSite ais 
        ON sm.SiteID = ais.SiteID 

    LEFT JOIN AssetMaster am
        ON ais.AssetID = am.AssetID
        AND am.CustomerID = sm.CustomerID

    OUTER APPLY ( 
        SELECT TOP 1 
            u.UserID, 
            u.FullName 
        FROM UserSiteAccess usa 

        INNER JOIN AppUser u 
            ON usa.UserID = u.UserID 
            AND u.IsActive = 1 

        INNER JOIN UserRoleMapping urm 
            ON u.UserID = urm.UserID 
            AND urm.IsActive = 1 

        INNER JOIN RoleMaster r 
            ON urm.RoleID = r.RoleID 
            AND r.IsActive = 1 

        WHERE usa.SiteID = sm.SiteID 
          AND usa.IsActive = 1 
          AND r.RoleCode = 'SITE_MANAGER' 
          AND r.CustomerID = sm.CustomerID 

        ORDER BY usa.CreatedDate DESC 
    ) manager 

    WHERE sm.CustomerID = @CustomerID 

    GROUP BY 
        sm.SiteID, 
        sm.SiteName, 
        sm.LocationName, 
        sm.Latitude, 
        sm.Longitude, 
        sm.IsActive, 
        manager.UserID, 
        manager.FullName 

    ORDER BY sm.SiteID;
  `);

  return result.recordset;
}
async function createSite(siteData, customerId, userId, ipAddress) {
  // validate
  // INSERT into SiteMaster
  const pool = await getPool();
  const { siteName, locationName, latitude, longitude, isActive } = siteData;
  // Validation
  if (!siteName || !siteName.trim()) {
    throw new Error("Site name is required.");
  }

  if (!locationName || !locationName.trim()) {
    throw new Error("Location is required.");
  }

  if (latitude === undefined || latitude === null) {
    throw new Error("Latitude is required.");
  }

  if (longitude === undefined || longitude === null) {
    throw new Error("Longitude is required.");
  }

  if (typeof isActive !== "boolean") {
    throw new Error("Status is required.");
  }

  const result = await pool
    .request()
    .input("CustomerID", sql.Int, customerId)
    .input("SiteName", sql.NVarChar(300), siteName.trim())
    .input("LocationName", sql.NVarChar(400), locationName.trim())
    .input("Latitude", sql.Decimal(18, 8), latitude)
    .input("Longitude", sql.Decimal(18, 8), longitude)
    .input("IsActive", sql.Bit, isActive).query(`
            INSERT INTO SiteMaster
            (
                CustomerID,
                SiteName,
                LocationName,
                Latitude,
                Longitude,
                IsActive
            )
            VALUES
            (@CustomerID,
                @SiteName,
                @LocationName,
                @Latitude,
                @Longitude,
                @IsActive
            );

            SELECT
                SiteID,
                SiteName,
                LocationName,
                Latitude,
                Longitude,
                IsActive
            FROM SiteMaster
            WHERE SiteID = SCOPE_IDENTITY();
        `);

  const siteId = result.recordset[0].SiteID;
  await createAuditLog({
    customerId,
    userId,
    action: "CREATE",
    module: "SITE",
    recordId: siteId,
    description: `Site ${siteName.trim()} was created`,
    oldValues: null,
    newValues: {
      SiteID: siteId,
      SiteName: siteName.trim(),
      LocationName: locationName.trim(),
      Latitude: latitude,
      Longitude: longitude,
      IsActive: isActive,
    },
    ipAddress,
  });

  return result.recordset[0];
}
async function updateSite(siteId, siteData, customerId, userId, ipAddress) {
  const pool = await getPool();
  const { siteName, locationName, latitude, longitude, isActive } = siteData;

  if (!siteName || !siteName.trim()) {
    throw new Error("Site name is required.");
  }

  if (!locationName || !locationName.trim()) {
    throw new Error("Location is required.");
  }

  if (latitude === undefined || latitude === null) {
    throw new Error("Latitude is required.");
  }

  if (longitude === undefined || longitude === null) {
    throw new Error("Longitude is required.");
  }

  if (typeof isActive !== "boolean") {
    throw new Error("Status is required.");
  }
  // const result = await pool
  //   .request()
  //   .input("SiteID", sql.BigInt, siteId)
  //   .input("CustomerID", sql.Int, customerId)
  //   .input("SiteName", sql.NVarChar(300), siteName.trim())
  //   .input("LocationName", sql.NVarChar(400), locationName.trim())
  //   .input("Latitude", sql.Decimal(18, 8), latitude)
  //   .input("Longitude", sql.Decimal(18, 8), longitude)
  //   .input("RadiusMeters", sql.Int, radiusMeters)
  //   .input("IsActive", sql.Bit, isActive).query(`
  //           UPDATE SiteMaster
  //           SET
  //               SiteName = @SiteName,
  //               LocationName = @LocationName,
  //               Latitude = @Latitude,
  //               Longitude = @Longitude,
  //               RadiusMeters = @RadiusMeters,
  //               IsActive = @IsActive
  //           WHERE SiteID = @SiteID
  //             AND CustomerID = @CustomerID;

  //           SELECT
  //               SiteID,
  //               SiteName,
  //               LocationName,
  //               Latitude,
  //               Longitude,
  //               RadiusMeters,
  //               IsActive
  //           FROM SiteMaster
  //           WHERE SiteID = @SiteID
  //           AND CustomerID = @CustomerID;
  //       `);

  // return result.recordset[0];

  const oldSiteResponse = await pool
    .request()
    .input("SiteID", sql.BigInt, siteId)
    .input("CustomerID", sql.Int, customerId).query(`
    SELECT
      SiteID,
      SiteName,
      LocationName,
      Latitude,
      Longitude,
      IsActive
    FROM SiteMaster
    WHERE SiteID = @SiteID
      AND CustomerID = @CustomerID;
  `);

  if (oldSiteResponse.recordset.length === 0) {
    throw new Error("Site not found.");
  }

  const oldValues = oldSiteResponse.recordset[0];

  const result = await pool
    .request()
    .input("SiteID", sql.BigInt, siteId)
    .input("CustomerID", sql.Int, customerId)
    .input("SiteName", sql.NVarChar(300), siteName.trim())
    .input("LocationName", sql.NVarChar(400), locationName.trim())
    .input("Latitude", sql.Decimal(18, 8), latitude)
    .input("Longitude", sql.Decimal(18, 8), longitude)
    .input("IsActive", sql.Bit, isActive).query(`
    UPDATE SiteMaster
    SET
      SiteName = @SiteName,
      LocationName = @LocationName,
      Latitude = @Latitude,
      Longitude = @Longitude,
      IsActive = @IsActive
    WHERE SiteID = @SiteID
      AND CustomerID = @CustomerID;

    SELECT
      SiteID,
      SiteName,
      LocationName,
      Latitude,
      Longitude,
      IsActive
    FROM SiteMaster
    WHERE SiteID = @SiteID
      AND CustomerID = @CustomerID;
  `);

  const newValues = result.recordset[0];
  const onlyStatusChanged =
  oldValues.SiteName === newValues.SiteName &&
  oldValues.LocationName === newValues.LocationName &&
  Number(oldValues.Latitude) === Number(newValues.Latitude) &&
  Number(oldValues.Longitude) === Number(newValues.Longitude) &&
  oldValues.RadiusMeters === newValues.RadiusMeters &&
  oldValues.IsActive !== newValues.IsActive;

  const action = onlyStatusChanged
  ? "STATUS_CHANGE"
  : "UPDATE";

  await createAuditLog({
    customerId,
    userId,
    action,
    module: "SITE",
    recordId: siteId,
    description:
      action === "STATUS_CHANGE"
        ? `Site ${newValues.SiteName} status changed`
        : `Site ${newValues.SiteName} was updated`,
    oldValues,
    newValues,
    ipAddress,
  });

  return newValues;
}
module.exports = { getSites, createSite, updateSite };
