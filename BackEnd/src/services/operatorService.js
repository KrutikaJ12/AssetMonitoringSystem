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
    sm.SiteName
FROM OperatorMaster om
INNER JOIN SiteMaster sm
    ON om.SiteID = sm.SiteID
WHERE sm.CustomerID =@CustomerID
ORDER BY om.OperatorID;
    `,
    );
  return result.recordset;
}

async function createOperator(operatorsData, customerId) {
  const pool = await getPool();
  const { operatorName, mobileNo, licenseNo, rfidcard, siteId, isActive } =
    operatorsData;

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
    .input("CustomerID", sql.Int, customerId)
    .input("OperatorName", sql.NVarChar(100), operatorName.trim())
    .input("MobileNo", sql.NVarChar(20), mobileNo)
    .input("LicenseNo", sql.NVarChar(100), licenseNo)
    .input("RFIDCardNo", sql.NVarChar(100), rfidcard)
    .input("SiteID", sql.Int, siteId)
    .input("IsActive", sql.Bit, isActive).query(`
        INSERT INTO OperatorMaster
        (
            SiteID,
            OperatorName,
            MobileNo,
            LicenseNo,
            RFIDCardNo,
            IsActive
        )
        VALUES
        (
            @SiteID,
            @OperatorName,
            @MobileNo,
            @LicenseNo,
            @RFIDCardNo,
            @IsActive
        );

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
