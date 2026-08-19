const { sql,getPool} = require("../config/db");

async function getUsers(customerId){
   const pool = await getPool();

  // 1. Get users
  const usersResponse = await pool
    .request()
    .input("CustomerID", sql.Int, customerId)
    .query(`
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
  const rolesResponse = await pool
    .request()
    .query(`
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
    .input("CustomerID", sql.Int, customerId)
    .query(`
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

async function createUser(customerId, userData) {
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

  try {
    await transaction.begin();

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
      .input("CreatedBy", sql.BigInt, customerId)
      .query(`
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
      .input("RoleID", sql.Int, roleId)
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
    // 3. Assign Sites
    // ==========================================

    for (const siteId of siteIds) {
      const siteRequest = new sql.Request(transaction);

      await siteRequest
        .input("CustomerID", sql.Int, customerId)
        .input("UserID", sql.BigInt, userId)
        .input("SiteID", sql.BigInt, siteId)
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
    // 4. Commit
    // ==========================================

    await transaction.commit();

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

    // ==========================================
    // Rollback
    // ==========================================

    await transaction.rollback();

    throw error;
  }
}
async function updateUser(userId, customerId, userData) {
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

  if (!roleId || isNaN(Number(roleId))) {
    throw new Error("Valid role is required.");
  }

  if (!Array.isArray(siteIds)) {
    throw new Error("Site IDs must be an array.");
  }

  const transaction = new sql.Transaction(pool);

  try {
    await transaction.begin();

    // ==========================================
    // 1. Update UserMaster
    // ==========================================

    const userRequest = new sql.Request(transaction);

    const userResponse = await userRequest
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

    if (userResponse.recordset.length === 0) {
      throw new Error("User not found.");
    }

    // ==========================================
    // 2. Update Role Mapping
    // ==========================================

    // Deactivate existing role mappings
    const deactivateRolesRequest = new sql.Request(transaction);

    await deactivateRolesRequest
      .input("UserID", sql.BigInt, userId)
      .query(`
        UPDATE UserRoleMapping
        SET IsActive = 0
        WHERE UserID = @UserID;
      `);

    // Add selected role
    const roleRequest = new sql.Request(transaction);

    await roleRequest
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
    // 3. Update Site Access
    // ==========================================

    // Deactivate existing site access
    const deactivateSitesRequest = new sql.Request(transaction);

    await deactivateSitesRequest
      .input("UserID", sql.BigInt, userId)
      .query(`
        UPDATE UserSiteAccess
        SET IsActive = 0
        WHERE UserID = @UserID;
      `);

    // Add currently selected sites
    for (const siteId of siteIds) {
      const siteRequest = new sql.Request(transaction);

      await siteRequest
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
    // 4. Commit
    // ==========================================

    await transaction.commit();

    return {
      userId,
      fullName: fullName.trim(),
      mobileNo,
      emailId: emailId.trim(),
      userName: userName.trim(),
      roleId: Number(roleId),
      siteIds: siteIds.map(Number),
      isActive,
    };

  } catch (error) {

    // ==========================================
    // Rollback
    // ==========================================

    await transaction.rollback();

    throw error;
  }
}

module.exports = { getUsers,createUser,updateUser}