const {sql,getPool} = require("../config/db")

async function getSites(customerId){
   const pool=await getPool();
   
   const result= await pool
   .request()
   .input("CustomerID",sql.Int,customerId)
   .query(
    `
            SELECT
                SiteID,
                SiteName,
                LocationName,
                Latitude,
                Longitude,
                RadiusMeters,
                IsActive
            FROM SiteMaster
            WHERE CustomerID = @CustomerID
            ORDER BY SiteID;
        `
   );
   return result.recordset;
   
}
async function createSite(siteData, customerId) {
    // validate
    // INSERT into SiteMaster
     const pool=await getPool();
       const {
        siteName,
        locationName,
        latitude,
        longitude,
        radiusMeters,
        isActive
    } = siteData;
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
    
    if (radiusMeters === undefined || radiusMeters === null) {
        throw new Error("Radius is required.");
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
        .input("RadiusMeters", sql.Int, radiusMeters)
        .input("IsActive", sql.Bit, isActive)
        .query(`
            INSERT INTO SiteMaster
            (
                CustomerID,
                SiteName,
                LocationName,
                Latitude,
                Longitude,
                RadiusMeters,
                IsActive
            )
            VALUES
            (@CustomerID,
                @SiteName,
                @LocationName,
                @Latitude,
                @Longitude,
                @RadiusMeters,
                @IsActive
            );

            SELECT
                SiteID,
                SiteName,
                LocationName,
                Latitude,
                Longitude,
                RadiusMeters,
                IsActive
            FROM SiteMaster
            WHERE SiteID = SCOPE_IDENTITY();
        `);

    return result.recordset[0];
}
async function updateSite(siteId,siteData,customerId){
    const pool=await getPool();
     const {
        siteName,
        locationName,
        latitude,
        longitude,
        radiusMeters,
        isActive
    } = siteData;
  
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

    if (radiusMeters === undefined || radiusMeters === null) {
        throw new Error("Radius is required.");
    }

    if (typeof isActive !== "boolean") {
        throw new Error("Status is required.");
    }
    const result = await pool
        .request()
        .input("SiteID", sql.BigInt, siteId)
        .input("CustomerID", sql.Int, customerId)
        .input("SiteName", sql.NVarChar(300), siteName.trim())
        .input("LocationName", sql.NVarChar(400), locationName.trim())
        .input("Latitude", sql.Decimal(18, 8), latitude)
        .input("Longitude", sql.Decimal(18, 8), longitude)
        .input("RadiusMeters", sql.Int, radiusMeters)
        .input("IsActive", sql.Bit, isActive)
        .query(`
            UPDATE SiteMaster
            SET
                SiteName = @SiteName,
                LocationName = @LocationName,
                Latitude = @Latitude,
                Longitude = @Longitude,
                RadiusMeters = @RadiusMeters,
                IsActive = @IsActive
            WHERE SiteID = @SiteID
              AND CustomerID = @CustomerID;

            SELECT
                SiteID,
                SiteName,
                LocationName,
                Latitude,
                Longitude,
                RadiusMeters,
                IsActive
            FROM SiteMaster
            WHERE SiteID = @SiteID
            AND CustomerID = @CustomerID;
        `);
    return result.recordset[0];
}
module.exports = { getSites,createSite,updateSite}