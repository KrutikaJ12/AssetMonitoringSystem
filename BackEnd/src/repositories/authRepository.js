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

async function getAuthorizationContext(userId, customerId) {
    const pool = await getPool();

    const request = pool
        .request()
        .input("UserID", sql.BigInt, userId);

    if (customerId === null || customerId === undefined) {
        request.input("CustomerID", sql.BigInt, null);
    } else {
        request.input("CustomerID", sql.BigInt, customerId);
    }

    const result = await request.execute(
        "dbo.usp_AppUser_GetAuthorizationContext"
    );

    return {
        roles: result.recordsets[0] || [],
        permissions: result.recordsets[1] || []
    };
}

async function hasPermission(userId, permissionCode) {
    const pool = await getPool();

    const result = await pool
        .request()
        .input("UserID", sql.BigInt, userId)
        .input(
            "PermissionCode",
            sql.NVarChar(100),
            permissionCode
        )
        .execute("dbo.usp_AppUser_HasPermission");

    return result.recordset[0]?.HasPermission === true;
}

// async function getUserRoles(userId) {
//   // SQL query here
// }

// async function getUserPermissions(userId) {
//   // SQL query here
// }


module.exports = {
    getUserForAuthentication,
    recordSuccessfulLogin,
    recordFailedLogin,
    clearExpiredLockout,
    getAuthorizationContext,
    hasPermission
};