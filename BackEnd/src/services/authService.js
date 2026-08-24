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
      expiresIn: "2hr",
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
function createModuleList(permissions) {
    const moduleMap = new Map();

    for (const permission of permissions) {
        if (!moduleMap.has(permission.ModuleCode)) {
            moduleMap.set(permission.ModuleCode, {
                moduleId: permission.ModuleID,
                moduleCode: permission.ModuleCode,
                moduleName: permission.ModuleName,
            });
        }
    }

    return Array.from(moduleMap.values());
}
async function authenticate(loginId, password) {

    const genericFailure = {
        success: false,
        statusCode: 401,
        message: "Invalid login ID or password.",
    };

    const user =
        await authRepository.getUserForAuthentication(
            loginId
        );

    if (!user) {
        return genericFailure;
    }

    // inactive account
    if (!user.IsActive) {
        return {
            success: false,
            statusCode: 403,
            message:
                "Your account is inactive. Contact the administrator.",
        };
    }

    // locked account
    if (user.IsLocked) {
        return {
            success: false,
            statusCode: 423,
            message:
                "The account is temporarily locked. Try again later.",
        };
    }

    // verify password
    let passwordIsValid = false;

    try {
        passwordIsValid = await verifyPassword(
            password,
            user.PasswordHash
        );
    } catch (error) {
        console.error(
            "Password verification error:",
            error
        );
    }

    if (!passwordIsValid) {
        await authRepository.recordFailedLogin(
            user.UserID
        );

        return genericFailure;
    }

    // record login
    await authRepository.recordSuccessfulLogin(
        user.UserID
    );

    // get roles + permissions
    const authorizationContext =
        await authRepository.getAuthorizationContext(
            user.UserID,
            user.CustomerID
        );

    // no role assigned
    if (
        authorizationContext.roles.length === 0
    ) {
        return {
            success: false,
            statusCode: 403,
            message:
                "No active role assigned to this account.",
        };
    }

    const roleCodes =
        authorizationContext.roles.map(
            (role) => role.RoleCode
        );

    const modules = createModuleList(
        authorizationContext.permissions
    );

    // generate tokens
    const accessToken =
        createAccessToken(
            user,
            roleCodes
        );

    const refreshToken =
        createRefreshToken(
            user.UserID
        );

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

        roles: authorizationContext.roles,

        permissions:
            authorizationContext.permissions,

        modules,

        accessToken,

        refreshToken,
    };
}

module.exports = {
  authenticate,
};
