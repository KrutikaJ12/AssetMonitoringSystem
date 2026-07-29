const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

const authRepository = require("../repositories/authRepository");
const { verifyPassword } = require("../utils/passwordUtils");
function createAccessToken(user, roles) {
  return jwt.sign(
    {
      sub: String(user.UserID),
      customerId: user.CustomerID !== null ? String(user.CustomerID) : null,
      userName: user.UserName,
      roles,
    },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: "15m",
      issuer: "asset-monitoring-api",
      audience: "asset-monitoring-web",
    },
  );
}

function createRefreshToken(userId) {
  return jwt.sign(
    {
      sub: String(userId),
      tokenType: "refresh",
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: "7d",
      issuer: "asset-monitoring-api",
      audience: "asset-monitoring-web",
    },
  );
}

async function authenticate(loginId, password) {
  console.log("authenticate", loginId, password);
  const genericFailure = {
    success: false,
    statusCode: 401,
    message: "Invalid login ID or password.",
  };

  const user = await authRepository.getUserForAuthentication(loginId);

  console.log("user", user);
  /*
   * Use a generic message whether the user exists or not.
   * This prevents username enumeration.
   */
  if (!user) {
    return genericFailure;
  }

  if (!user.IsActive) {
    return {
      success: false,
      statusCode: 403,
      message: "Your account is inactive. Contact the administrator.",
    };
  }

  const currentTime = new Date();

  if (
    user.IsLocked &&
    user.LockoutEndDateTime &&
    new Date(user.LockoutEndDateTime) <= currentTime
  ) {
    await authRepository.clearExpiredLockout(user.UserID);

    user.IsLocked = false;
    user.FailedLoginCount = 0;
    user.LockoutEndDateTime = null;
  }

  if (user.IsLocked) {
    return {
      success: false,
      statusCode: 423,
      message: "The account is temporarily locked. Try again later.",
    };
  }

  let passwordIsValid = false;
  console.log("Entered Password :", password);
  console.log("Password Hash :", user.PasswordHash);
  console.log("Type :", typeof user.PasswordHash);
  try {
    // passwordIsValid = await argon2.verify(
    //     user.PasswordHash,
    //     password
    // );
    passwordIsValid = await verifyPassword(password, user.PasswordHash);
    // const hash = user.PasswordHash.toString();

    // passwordIsValid = await argon2.verify(hash, password);
  } catch (error) {
    /*
     * A malformed or old hash should not crash the API.
     */
    console.error("Password verification error:", error);
  }

  if (!passwordIsValid) {
    await authRepository.recordFailedLogin(user.UserID);
    console.log("passs123");
    return genericFailure;
  }

  await authRepository.recordSuccessfulLogin(user.UserID);

  /*
   * Replace this example with the role/permission lookup
   * from usp_AppUser_GetLoginContext.
   */
  const roles = await authRepository.getUserRoles(user.UserID);
  const permissions = await authRepository.getUserPermissions(user.UserID);

  const accessToken = createAccessToken(user, roles);
  const refreshToken = createRefreshToken(user.UserID);

  return {
    success: true,
    statusCode: 200,
    message: "Login Successful",
    user: {
      userId: user.UserID,
      customerId: user.CustomerID,
      userName: user.UserName,
      fullName: user.FullName,
      emailId: user.EmailID,
    },

    roles,
    permissions,
    accessToken,
    refreshToken,
  };
}

module.exports = {
  authenticate,
};
