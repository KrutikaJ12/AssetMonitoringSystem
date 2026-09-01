const { sql, getPool } = require("../config/db");
const createAuditLog = require("../services/auditLogService");
async function getUsers(customerId) {
  const pool = await getPool();

  // 1. Get users
  const usersResponse = await pool
    .request()
    .input("CustomerID", sql.Int, customerId).query(`
      SELECT
        UserID,
        FullName,
        MobileNo,
        EmailID,
        UserName,
        IsActive
      FROM AppUser
      WHERE CustomerID = @CustomerID
      ORDER BY UserID;
    `);

  // 2. Get user roles
  const rolesResponse = await pool.request().query(`
      SELECT
        urm.UserID,
        r.RoleID,
        r.RoleName,
        r.RoleCode
      FROM UserRoleMapping urm
      INNER JOIN RoleMaster r
        ON urm.RoleID = r.RoleID
      WHERE urm.IsActive = 1;
    `);

  // 3. Get user sites
  const sitesResponse = await pool
    .request()
    .input("CustomerID", sql.Int, customerId).query(`
      SELECT
        usa.UserID,
        s.SiteID,
        s.SiteName
      FROM UserSiteAccess usa
      INNER JOIN SiteMaster s
        ON usa.SiteID = s.SiteID
      WHERE usa.CustomerID = @CustomerID
        AND usa.IsActive = 1;
    `);

  const users = usersResponse.recordset;
  const roles = rolesResponse.recordset;
  const sites = sitesResponse.recordset;

  // Combine everything user-wise
  return users.map((user) => ({
    userId: user.UserID,
    fullName: user.FullName,
    mobileNo: user.MobileNo,
    emailId: user.EmailID,
    userName: user.UserName,
    isActive: user.IsActive,

    roles: roles
      .filter((role) => role.UserID === user.UserID)
      .map((role) => ({
        roleId: role.RoleID,
        roleName: role.RoleName,
        roleCode: role.RoleCode,
      })),

    sites: sites
      .filter((site) => site.UserID === user.UserID)
      .map((site) => ({
        siteId: site.SiteID,
        siteName: site.SiteName,
      })),
  }));
}

async function createUser(customerId, userData, userId, ipAddress) {
  const pool = await getPool();

  const {
    fullName,
    mobileNo,
    emailId,
    userName,
    roleId,
    siteIds = [],
    isActive = true,
  } = userData;

  // -------------------------
  // Validation
  // -------------------------

  if (!fullName || !fullName.trim()) {
    throw new Error("Full name is required.");
  }

  if (!mobileNo) {
    throw new Error("Mobile number is required.");
  }

  if (!emailId || !emailId.trim()) {
    throw new Error("Email is required.");
  }

  if (!userName || !userName.trim()) {
    throw new Error("Username is required.");
  }

  if (!roleId) {
    throw new Error("Role is required.");
  }

  // siteIds should be an array
  if (!Array.isArray(siteIds)) {
    throw new Error("Site IDs must be an array.");
  }

  // -------------------------
  // Transaction
  // -------------------------

  const transaction = new sql.Transaction(pool);
  let transactionStarted = false;
  try {
    await transaction.begin();
    transactionStarted = true;
    // ==========================================
    // 1. Create User
    // ==========================================

    const userRequest = new sql.Request(transaction);

    const userResponse = await userRequest
      .input("CustomerID", sql.Int, customerId)
      .input("FullName", sql.NVarChar(100), fullName.trim())
      .input("MobileNo", sql.NVarChar(20), mobileNo)
      .input("EmailID", sql.NVarChar(200), emailId.trim())
      .input("UserName", sql.NVarChar(100), userName.trim())
      .input("RoleID", sql.Int, Number(roleId))
      .input("IsActive", sql.Bit, isActive)
      .input("CreatedBy", sql.BigInt, customerId).query(`
        INSERT INTO AppUser
        (
          CustomerID,
          FullName,
          MobileNo,
          EmailID,
          UserName,
          IsActive,
          IsLocked,
          FailedLoginCount,
          IsEmailVerified,
          IsMobileVerified,
          CreatedBy,
          CreatedDate
        )
        VALUES
        (
          @CustomerID,
          @FullName,
          @MobileNo,
          @EmailID,
          @UserName,
          @IsActive,
          0,
          0,
          0,
          0,
          @CreatedBy,
          GETDATE()
        );

        SELECT SCOPE_IDENTITY() AS UserID;
      `);

    const userId = userResponse.recordset[0].UserID;

    // ==========================================
    // 2. Assign Role
    // ==========================================

    const roleRequest = new sql.Request(transaction);

    await roleRequest
      .input("UserID", sql.BigInt, userId)
      .input("RoleID", sql.Int, roleId).query(`
        INSERT INTO UserRoleMapping
        (
          UserID,
          RoleID,
          IsActive,
          CreatedDate
        )
        VALUES
        (
          @UserID,
          @RoleID,
          1,
          GETDATE()
        );
      `);

    // ==========================================
    // 3. Assign Sites
    // ==========================================

    for (const siteId of siteIds) {
      const siteRequest = new sql.Request(transaction);

      await siteRequest
        .input("CustomerID", sql.Int, customerId)
        .input("UserID", sql.BigInt, userId)
        .input("SiteID", sql.BigInt, siteId).query(`
          INSERT INTO UserSiteAccess
          (
            CustomerID,
            UserID,
            SiteID,
            IsActive,
            CreatedDate
          )
          VALUES
          (
            @CustomerID,
            @UserID,
            @SiteID,
            1,
            GETDATE()
          );
        `);
    }

    // ==========================================
    // 4. Commit
    // ==========================================

    await transaction.commit();
    transactionStarted = false;

    await createAuditLog({
      customerId,
      userId,
      action: "CREATE",
      module: "USER",
      recordId: userId,
      description: `User ${userName.trim()} was created`,
      oldValues: null,
      newValues: {
        UserID: userId,
        FullName: fullName.trim(),
        MobileNo: mobileNo,
        EmailID: emailId.trim(),
        UserName: userName.trim(),
        RoleID: roleId,
        SiteIDs: siteIds,
        IsActive: isActive,
      },
      ipAddress,
    });
    return {
      userId,
      fullName: fullName.trim(),
      mobileNo,
      emailId: emailId.trim(),
      userName: userName.trim(),
      roleId,
      siteIds,
      isActive,
    };
  } catch (error) {
    if (transactionStarted) {
      await transaction.rollback();
    }
    throw error;
  }
}
async function updateUser(userId, customerId, userData, ipAddress) {
  const pool = await getPool();

  const {
    fullName,
    mobileNo,
    emailId,
    userName,
    roleId,
    siteIds = [],
    isActive,
  } = userData;

  // ==========================================
  // Validation
  // ==========================================

  if (!fullName || !fullName.trim()) {
    throw new Error("Full name is required.");
  }

  if (!mobileNo) {
    throw new Error("Mobile number is required.");
  }

  if (!emailId || !emailId.trim()) {
    throw new Error("Email is required.");
  }

  if (!userName || !userName.trim()) {
    throw new Error("Username is required.");
  }

  if (!roleId || isNaN(Number(roleId))) {
    throw new Error("Valid role is required.");
  }

  if (!Array.isArray(siteIds)) {
    throw new Error("Site IDs must be an array.");
  }

  const transaction = new sql.Transaction(pool);
  let transactionStarted = false;

  try {
    await transaction.begin();
    transactionStarted = true;

    // ==========================================
    // 1. Get OLD USER values
    // ==========================================

    const oldUserResponse = await new sql.Request(transaction)
      .input("UserID", sql.BigInt, userId)
      .input("CustomerID", sql.Int, customerId)
      .query(`
        SELECT
          UserID,
          CustomerID,
          FullName,
          MobileNo,
          EmailID,
          UserName,
          IsActive
        FROM AppUser
        WHERE UserID = @UserID
          AND CustomerID = @CustomerID;
      `);

    if (oldUserResponse.recordset.length === 0) {
      throw new Error("User not found.");
    }

    const oldUser = oldUserResponse.recordset[0];

    // ==========================================
    // 2. Get OLD ROLE
    // ==========================================

    const oldRoleResponse = await new sql.Request(transaction)
      .input("UserID", sql.BigInt, userId)
      .query(`
        SELECT RoleID
        FROM UserRoleMapping
        WHERE UserID = @UserID
          AND IsActive = 1;
      `);

    const oldRoleId =
      oldRoleResponse.recordset.length > 0
        ? Number(oldRoleResponse.recordset[0].RoleID)
        : null;

    // ==========================================
    // 3. Get OLD SITE ACCESS
    // ==========================================

    const oldSitesResponse = await new sql.Request(transaction)
      .input("UserID", sql.BigInt, userId)
      .input("CustomerID", sql.Int, customerId)
      .query(`
        SELECT SiteID
        FROM UserSiteAccess
        WHERE UserID = @UserID
          AND CustomerID = @CustomerID
          AND IsActive = 1;
      `);

    const oldSiteIds = oldSitesResponse.recordset.map(
      row => Number(row.SiteID)
    );

    // ==========================================
    // 4. Build OLD VALUES
    // ==========================================

    const oldValues = {
      UserID: Number(oldUser.UserID),
      CustomerID: Number(oldUser.CustomerID),
      FullName: oldUser.FullName,
      MobileNo: oldUser.MobileNo,
      EmailID: oldUser.EmailID,
      UserName: oldUser.UserName,
      IsActive: Boolean(oldUser.IsActive),
      RoleID: oldRoleId,
      SiteIDs: [...oldSiteIds].sort((a, b) => a - b),
    };

    // ==========================================
    // 5. UPDATE USER
    // ==========================================

    const userResponse = await new sql.Request(transaction)
      .input("UserID", sql.BigInt, userId)
      .input("CustomerID", sql.Int, customerId)
      .input("FullName", sql.NVarChar(100), fullName.trim())
      .input("MobileNo", sql.NVarChar(20), mobileNo)
      .input("EmailID", sql.NVarChar(200), emailId.trim())
      .input("UserName", sql.NVarChar(100), userName.trim())
      .input("IsActive", sql.Bit, isActive)
      .query(`
        UPDATE AppUser
        SET
          FullName = @FullName,
          MobileNo = @MobileNo,
          EmailID = @EmailID,
          UserName = @UserName,
          IsActive = @IsActive,
          ModifiedDate = GETDATE()
        WHERE UserID = @UserID
          AND CustomerID = @CustomerID;

        SELECT
          UserID,
          CustomerID,
          FullName,
          MobileNo,
          EmailID,
          UserName,
          IsActive
        FROM AppUser
        WHERE UserID = @UserID
          AND CustomerID = @CustomerID;
      `);

    const updatedUser = userResponse.recordset[0];

    // ==========================================
    // 6. UPDATE ROLE
    // ==========================================

    await new sql.Request(transaction)
      .input("UserID", sql.BigInt, userId)
      .query(`
        UPDATE UserRoleMapping
        SET IsActive = 0
        WHERE UserID = @UserID;
      `);

    await new sql.Request(transaction)
      .input("UserID", sql.BigInt, userId)
      .input("RoleID", sql.Int, Number(roleId))
      .query(`
        INSERT INTO UserRoleMapping
        (
          UserID,
          RoleID,
          IsActive,
          CreatedDate
        )
        VALUES
        (
          @UserID,
          @RoleID,
          1,
          GETDATE()
        );
      `);

    // ==========================================
    // 7. UPDATE SITE ACCESS
    // ==========================================

    await new sql.Request(transaction)
      .input("UserID", sql.BigInt, userId)
      .query(`
        UPDATE UserSiteAccess
        SET IsActive = 0
        WHERE UserID = @UserID;
      `);

    for (const siteId of siteIds) {
      await new sql.Request(transaction)
        .input("CustomerID", sql.Int, customerId)
        .input("UserID", sql.BigInt, userId)
        .input("SiteID", sql.BigInt, Number(siteId))
        .query(`
          INSERT INTO UserSiteAccess
          (
            CustomerID,
            UserID,
            SiteID,
            IsActive,
            CreatedDate
          )
          VALUES
          (
            @CustomerID,
            @UserID,
            @SiteID,
            1,
            GETDATE()
          );
        `);
    }

    // ==========================================
    // 8. Build NEW VALUES
    // ==========================================

    const newValues = {
      UserID: Number(updatedUser.UserID),
      CustomerID: Number(updatedUser.CustomerID),
      FullName: updatedUser.FullName,
      MobileNo: updatedUser.MobileNo,
      EmailID: updatedUser.EmailID,
      UserName: updatedUser.UserName,
      IsActive: Boolean(updatedUser.IsActive),
      RoleID: Number(roleId),
      SiteIDs: siteIds
        .map(Number)
        .sort((a, b) => a - b),
    };

    // ==========================================
    // 9. Check what changed
    // ==========================================

    const statusChanged =
      oldValues.IsActive !== newValues.IsActive;

    const otherFieldsChanged =
      oldValues.FullName !== newValues.FullName ||
      oldValues.MobileNo !== newValues.MobileNo ||
      oldValues.EmailID !== newValues.EmailID ||
      oldValues.UserName !== newValues.UserName ||
      oldValues.RoleID !== newValues.RoleID ||
      JSON.stringify(oldValues.SiteIDs) !==
        JSON.stringify(newValues.SiteIDs);

    // ==========================================
    // 10. Decide Audit Action
    // ==========================================

    let action = "UPDATE";

    if (statusChanged && !otherFieldsChanged) {
      action = "STATUS_CHANGE";
    }

    // ==========================================
    // 11. Commit
    // ==========================================

    await transaction.commit();
    transactionStarted = false;

    // ==========================================
    // 12. Create Audit Log
    // ==========================================

    await createAuditLog({
      customerId,
      userId,
      action,
      module: "USER",
      recordId: userId,

      description:
        action === "STATUS_CHANGE"
          ? `User ${newValues.UserName} status was changed`
          : `User ${newValues.UserName} was updated`,

      oldValues,
      newValues,

      ipAddress,
    });

    // ==========================================
    // 13. Return
    // ==========================================

    return {
      userId,
      fullName: newValues.FullName,
      mobileNo: newValues.MobileNo,
      emailId: newValues.EmailID,
      userName: newValues.UserName,
      roleId: newValues.RoleID,
      siteIds: newValues.SiteIDs,
      isActive: newValues.IsActive,
    };

  } catch (error) {

    if (transactionStarted) {
      await transaction.rollback();
    }

    throw error;
  }
}

module.exports = { getUsers, createUser, updateUser };
