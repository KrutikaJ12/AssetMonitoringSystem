const {sql,getPool} = require("../config/db");

async function createAuditLog({
  customerId,
  userId,
  action,
  module,
  recordId,
  description,
  oldValues,
  newValues,
  ipAddress,
}) {
  const pool = await getPool();

  await pool
    .request()
    .input("CustomerID", sql.Int, customerId)
    .input("UserID", sql.BigInt, userId)
    .input("Action", sql.NVarChar(50), action)
    .input("Module", sql.NVarChar(100), module)
    .input("RecordID", sql.BigInt, recordId)
    .input("Description", sql.NVarChar(500), description)
    .input(
      "OldValues",
      sql.NVarChar(sql.MAX),
      oldValues ? JSON.stringify(oldValues) : null
    )
    .input(
      "NewValues",
      sql.NVarChar(sql.MAX),
      newValues ? JSON.stringify(newValues) : null
    )
    .input("IPAddress", sql.NVarChar(50), ipAddress)
    .query(`
      INSERT INTO AuditLog
      (
        CustomerID,
        UserID,
        Action,
        Module,
        RecordID,
        Description,
        OldValues,
        NewValues,
        IPAddress
      )
      VALUES
      (
        @CustomerID,
        @UserID,
        @Action,
        @Module,
        @RecordID,
        @Description,
        @OldValues,
        @NewValues,
        @IPAddress
      );
    `);
}

module.exports = {createAuditLog};