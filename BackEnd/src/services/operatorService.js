const { sql, getPool } = require("../config/db");

async function getOperators(customerId) {
  const pool = await getPool();

  const result = await pool
    .request()
    .input("CustomerID", sql.Int, customerId)
    .query(
      `
    SELECT
    om.OperatorID,
    om.SiteID,
    om.OperatorName,
    om.MobileNo,
    om.LicenseNo,
    om.RFIDCardNo,
    om.IsActive,

    sm.SiteName,

    om.AssetID,
    am.AssetCode,
    am.AssetName,
    am.AssetTypeID,
    atm.AssetTypeName

FROM OperatorMaster om

INNER JOIN SiteMaster sm
    ON om.SiteID = sm.SiteID

LEFT JOIN AssetMaster am
    ON om.AssetID = am.AssetID

LEFT JOIN AssetTypeMaster atm
    ON am.AssetTypeID = atm.AssetTypeID

WHERE sm.CustomerID = @CustomerID

ORDER BY om.OperatorID;
`
    );
  return result.recordset;
}

async function createOperator(operatorsData, customerId) {
  const pool = await getPool();

  const {
    operatorName,
    mobileNo,
    licenseNo,
    siteId,
    assetId,
    isActive = true,
  } = operatorsData;

  // ==========================================
  // Validation
  // ==========================================

  if (!operatorName || !operatorName.trim()) {
    throw new Error("Operator name is required.");
  }

  if (!mobileNo) {
    throw new Error("Mobile No is required.");
  }

  if (!licenseNo) {
    throw new Error("License No is required.");
  }

  if (!siteId) {
    throw new Error("Site Id is required.");
  }

  if (!assetId) {
    throw new Error("Asset is required.");
  }

  // ==========================================
  // 1. Validate Site
  // ==========================================

  const siteResponse = await pool
    .request()
    .input("SiteID", sql.Int, Number(siteId))
    .input("CustomerID", sql.Int, customerId)
    .query(`
      SELECT SiteID
      FROM SiteMaster
      WHERE SiteID = @SiteID
        AND CustomerID = @CustomerID
        AND IsActive = 1;
    `);

  if (siteResponse.recordset.length === 0) {
    throw new Error("Invalid site.");
  }

  // ==========================================
  // 2. Validate Asset
  // ==========================================

  const assetResponse = await pool
    .request()
    .input("AssetID", sql.BigInt, Number(assetId))
    .input("SiteID", sql.Int, Number(siteId))
    .input("CustomerID", sql.Int, customerId)
    .query(`
      SELECT
        am.AssetID,
        am.AssetCode,
        am.AssetName
      FROM AssetMaster am

      INNER JOIN AssetInSite ais
        ON am.AssetID = ais.AssetID

      WHERE am.AssetID = @AssetID
        AND am.CustomerID = @CustomerID
        AND ais.SiteID = @SiteID
        AND ais.IsActive = 1;
    `);

  if (assetResponse.recordset.length === 0) {
    throw new Error(
      "Selected asset does not belong to the selected site."
    );
  }

  // ==========================================
  // 3. Check if Asset is already assigned
  // ==========================================

  const assignedResponse = await pool
    .request()
    .input("AssetID", sql.BigInt, Number(assetId))
    .query(`
      SELECT OperatorID
      FROM OperatorMaster
      WHERE AssetID = @AssetID
        AND IsActive = 1;
    `);

  if (assignedResponse.recordset.length > 0) {
    throw new Error("This asset is already assigned to another operator.");
  }

  // ==========================================
  // 4. Insert Operator
  // ==========================================

  const response = await pool
    .request()
    .input("SiteID", sql.Int, Number(siteId))
    .input("AssetID", sql.BigInt, Number(assetId))
    .input("OperatorName", sql.NVarChar(100), operatorName.trim())
    .input("MobileNo", sql.NVarChar(20), mobileNo)
    .input("LicenseNo", sql.NVarChar(100), licenseNo)
    .input("IsActive", sql.Bit, isActive)
    .query(`
      INSERT INTO OperatorMaster
      (
        SiteID,
        AssetID,
        OperatorName,
        MobileNo,
        LicenseNo,
        IsActive
      )
      VALUES
      (
        @SiteID,
        @AssetID,
        @OperatorName,
        @MobileNo,
        @LicenseNo,
        @IsActive
      );

      SELECT
        om.OperatorID,
        om.SiteID,
        om.OperatorName,
        om.MobileNo,
        om.LicenseNo,
        om.IsActive,

        sm.SiteName,

        om.AssetID,
        am.AssetCode,
        am.AssetName,
        am.AssetTypeID,
        atm.AssetTypeName

      FROM OperatorMaster om

      INNER JOIN SiteMaster sm
        ON om.SiteID = sm.SiteID

      LEFT JOIN AssetMaster am
        ON om.AssetID = am.AssetID

      LEFT JOIN AssetTypeMaster atm
        ON am.AssetTypeID = atm.AssetTypeID

      WHERE om.OperatorID = SCOPE_IDENTITY();
    `);

  return response.recordset[0];
}
async function updateOperator(operatorId, customerId, operatorsData) {
    const pool = await getPool();

    const {
        operatorName,
        mobileNo,
        licenseNo,
        rfidcard,
        siteId,
        isActive
    } = operatorsData;

    if (!operatorName || !operatorName.trim()) {
        throw new Error("Operator name is required.");
    }

    if (!mobileNo) {
        throw new Error("Mobile NO is required.");
    }

    if (!licenseNo) {
        throw new Error("License No is required.");
    }

    if (!rfidcard) {
        throw new Error("RFIDCard NO is required.");
    }

    if (!siteId) {
        throw new Error("Site Id is required.");
    }

    const response = await pool
        .request()
        .input("OperatorID", sql.BigInt, operatorId)
        .input("CustomerID", sql.Int, customerId)
        .input("OperatorName", sql.NVarChar(100), operatorName.trim())
        .input("MobileNo", sql.NVarChar(20), mobileNo)
        .input("LicenseNo", sql.NVarChar(100), licenseNo)
        .input("RFIDCardNo", sql.NVarChar(100), rfidcard)
        .input("SiteID", sql.Int, siteId)
        .input("IsActive", sql.Bit, isActive)
        .query(`
            UPDATE om
            SET
                om.SiteID = @SiteID,
                om.OperatorName = @OperatorName,
                om.MobileNo = @MobileNo,
                om.LicenseNo = @LicenseNo,
                om.RFIDCardNo = @RFIDCardNo,
                om.IsActive = @IsActive
            FROM OperatorMaster om
            INNER JOIN SiteMaster sm
                ON om.SiteID = sm.SiteID
            WHERE om.OperatorID = @OperatorID
              AND sm.CustomerID = @CustomerID;

            SELECT
                om.OperatorID,
                om.SiteID,
                om.OperatorName,
                om.MobileNo,
                om.LicenseNo,
                om.RFIDCardNo,
                om.IsActive,
                sm.SiteName
            FROM OperatorMaster om
            INNER JOIN SiteMaster sm
                ON om.SiteID = sm.SiteID
            WHERE om.OperatorID = @OperatorID
              AND sm.CustomerID = @CustomerID;
        `);

    return response.recordset[0];
}
module.exports = {
  getOperators,
  createOperator,
  updateOperator,
};
