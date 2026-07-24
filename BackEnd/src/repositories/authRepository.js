const { sql, getPool } = require("../config/db");

async function getUserForAuthentication(loginId) {
    const pool = await getPool();
    console.log("Login ID :", loginId);
    const result = await pool
        .request()
        .input("LoginID", sql.NVarChar(150), loginId)
        .execute("dbo.usp_AppUser_GetForAuthentication");
    console.log("Recordset :", result.recordset);
    return result.recordset[0] || null;
}

async function recordSuccessfulLogin(userId) {
    const pool = await getPool();

    await pool
        .request()
        .input("UserID", sql.BigInt, userId)
        .execute("dbo.usp_AppUser_RecordSuccessfulLogin");
}

async function recordFailedLogin(userId) {
    const pool = await getPool();

    await pool
        .request()
        .input("UserID", sql.BigInt, userId)
        .execute("dbo.usp_AppUser_RecordFailedLogin");
}

async function clearExpiredLockout(userId) {
    const pool = await getPool();

    await pool
        .request()
        .input("UserID", sql.BigInt, userId)
        .execute("dbo.usp_AppUser_ClearExpiredLockout");
}

module.exports = {
    getUserForAuthentication,
    recordSuccessfulLogin,
    recordFailedLogin,
    clearExpiredLockout
};