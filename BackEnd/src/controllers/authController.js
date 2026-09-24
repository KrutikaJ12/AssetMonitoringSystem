const authService = require("../services/authService");

async function login(req, res, next) {
    try {
        const { loginId, password } = req.body;

        if (
            typeof loginId !== "string" ||
            typeof password !== "string" ||
            !loginId.trim() ||
            !password
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Login ID and password are required."
            });
        }

        const result = await authService.authenticate(
             loginId.trim(),
            password,
            // ipAddress: req.ip,
            // userAgent:
            //     req.get("user-agent") || null
        );

        if (!result.success) {
            return res
                .status(result.statusCode)
                .json({
                    success: false,
                    message: result.message
                });
        }

        return res.status(200).json({
            success: true,

            accessToken: result.accessToken,

            user: result.user,

            roles: result.roles,

            permissions: result.permissions,

            permissionCodes:
                result.permissionCodes,

            modules: result.modules
        });
    } catch (error) {
        // next(error);
        console.error("Login error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

async function logout(req, res) {
    res.clearCookie("refreshToken");

    return res.status(200).json({
        success: true,
        message: "Logout successful."
    });
}
module.exports = {
    login,
    logout
};