const {sql,getPool} = require("../config/db");

async function getAssets(customerId, siteId) {
  const pool = await getPool();

  const request = pool
    .request()
    .input("CustomerID", sql.Int, customerId);

  let siteCondition = "";

  if (siteId) {
    request.input("SiteID", sql.BigInt, Number(siteId));

    siteCondition = `
      AND ais.SiteID = @SiteID
    `;
  }

  const result = await request.query(`
    SELECT 
      am.AssetID, 
      am.AssetCode, 
      am.AssetName, 
      am.AssetTypeID, 
      atm.AssetTypeName, 
      atm.Category, 
      am.FuelPercentage, 
      am.RegistrationNo, 
      am.Make, 
      am.Model, 
      am.SerialNo, 
      am.DeviceID, 
      am.SIMNo, 
      am.TankCapacityLitres, 
      am.OpeningEngineHours, 
      am.OpeningOdometer, 
      am.Status, 
      am.ProtocolType, 
      ais.SiteID, 
      sm.SiteName,  
      om.OperatorID,
      om.OperatorName,   
      ROUND(COALESCE(ads.EngineMinutes, 0) / 60.0, 2) AS EngineHours, 
      ROUND(COALESCE(ads.IdleMinutes, 0) / 60.0, 2) AS IdleHours 

    FROM AssetMaster am 

    LEFT JOIN AssetTypeMaster atm 
      ON am.AssetTypeID = atm.AssetTypeID 

    LEFT JOIN AssetInSite ais 
      ON am.AssetID = ais.AssetID 

    LEFT JOIN SiteMaster sm 
      ON ais.SiteID = sm.SiteID 
    
    LEFT JOIN OperatorMaster om
    ON am.AssetID = om.AssetID

    LEFT JOIN AssetDailyUsageSummary ads 
      ON am.AssetID = ads.AssetID 
      AND ads.UsageDate = CAST(GETDATE() AS DATE) 

    WHERE am.CustomerID = @CustomerID
      ${siteCondition}

    ORDER BY am.AssetID;
  `);

  return result.recordset;
}
async function createAsset(assetData, customerId) {
  const pool = await getPool();

  const {
    assetCode,
    assetName,
    assetTypeId,
    regNo,
    siteId,
    status
  } = assetData;

  // Validation
  if (!assetCode || !assetCode.trim()) {
    throw new Error("Asset code is required.");
  }

  if (!assetName || !assetName.trim()) {
    throw new Error("Asset name is required.");
  }

  if (!assetTypeId) {
    throw new Error("Asset type is required.");
  }

  if (!regNo || !regNo.trim()) {
    throw new Error("Registration number is required.");
  }

  if (!siteId) {
    throw new Error("Site is required.");
  }

  if (!status) {
    throw new Error("Status is required.");
  }

  const transaction = new sql.Transaction(pool);

  try {
    await transaction.begin();

    const request = new sql.Request(transaction);

    // 1. Insert into AssetMaster
    const assetResponse = await request
      .input("CustomerID", sql.Int, customerId)
      .input("AssetTypeID", sql.Int, assetTypeId)
      .input("AssetCode", sql.NVarChar(100), assetCode.trim())
      .input("AssetName", sql.NVarChar(100), assetName.trim())
      .input("RegistrationNo", sql.NVarChar(100), regNo.trim())
      .input("Status", sql.NVarChar(50), status)
      .query(`
        INSERT INTO AssetMaster
        (
          CustomerID,
          AssetTypeID,
          AssetCode,
          AssetName,
          RegistrationNo,
          Status
        )
        OUTPUT INSERTED.AssetID
        VALUES
        (
          @CustomerID,
          @AssetTypeID,
          @AssetCode,
          @AssetName,
          @RegistrationNo,
          @Status
        );
      `);

    const assetId = assetResponse.recordset[0].AssetID;

    // 2. Insert into AssetInSite
    await new sql.Request(transaction)
      .input("AssetID", sql.Int, assetId)
      .input("SiteID", sql.Int, siteId)
      .query(`
        INSERT INTO AssetInSite
        (
          AssetID,
          SiteID
        )
        VALUES
        (
          @AssetID,
          @SiteID
        );
      `);

    await transaction.commit();

    return {
      AssetID: assetId,
      AssetCode: assetCode,
      AssetName: assetName,
      AssetTypeID: assetTypeId,
      RegistrationNo: regNo,
      SiteID: siteId,
      Status: status
    };

  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}
async function updateAsset(assetId,customerId,assetData){
  const pool= await getPool();
  const {
    assetCode,
    assetName,
    assetTypeId,
    regNo,
    siteId,
    status
  } = assetData;

   if (!assetCode || !assetCode.trim()) {
    throw new Error("Asset code is required.");
  }

  if (!assetName || !assetName.trim()) {
    throw new Error("Asset name is required.");
  }

  if (!assetTypeId) {
    throw new Error("Asset type is required.");
  }

  if (!regNo || !regNo.trim()) {
    throw new Error("Registration number is required.");
  }

  if (!siteId) {
    throw new Error("Site is required.");
  }

  if (!status) {
    throw new Error("Status is required.");
  }

  const transaction = new sql.Transaction(pool);

try {
    await transaction.begin();
   const request = new sql.Request(transaction);
    const assetResponse = await request
      .input("AssetID", sql.Int, assetId)
      .input("CustomerID", sql.Int, customerId)
      .input("AssetTypeID", sql.Int, assetTypeId)
      .input("AssetCode", sql.NVarChar(100), assetCode.trim())
      .input("AssetName", sql.NVarChar(100), assetName.trim())
      .input("RegistrationNo", sql.NVarChar(100), regNo.trim())
      .input("SiteID", sql.Int, siteId)
      .input("Status", sql.NVarChar(50), status)
      .query(`
    UPDATE AssetMaster
    SET
        AssetCode = @AssetCode,
        AssetName = @AssetName,
        AssetTypeID = @AssetTypeID,
        RegistrationNo = @RegistrationNo,
        Status = @Status
    WHERE AssetID = @AssetID
      AND CustomerID = @CustomerID;

    UPDATE AssetInSite
    SET
        SiteID = @SiteID
    WHERE AssetID = @AssetID;

    SELECT
        AssetID,
        CustomerID,
        AssetTypeID,
        AssetCode,
        AssetName,
        RegistrationNo,
        Status
    FROM AssetMaster
    WHERE AssetID = @AssetID
      AND CustomerID = @CustomerID;
`)
    // UPDATE AssetMaster
    // UPDATE AssetInSite

    await transaction.commit();
    return {
      AssetID: assetId,
      AssetCode: assetCode,
      AssetName: assetName,
      AssetTypeID: assetTypeId,
      RegistrationNo: regNo,
      SiteID: siteId,
      Status: status
    };
} catch (error) {
    await transaction.rollback();
    throw error;
}
}
module.exports = {getAssets,createAsset,updateAsset}