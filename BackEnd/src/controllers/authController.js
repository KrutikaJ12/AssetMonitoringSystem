const authService = require("../services/authService");

async function login(req, res) {
    try {
        const { loginId, password } = req.body;
      console.log("response",loginId,password)
        if (
            typeof loginId !== "string" ||
            typeof password !== "string" ||
            !loginId.trim() ||
            !password
        ) {
            return res.status(400).json({
                success: false,
                message: "Login ID and password are required."
            });
        }

        const result = await authService.authenticate(
            loginId.trim(),
            password
        );

        if (!result.success) {
            return res.status(result.statusCode).json({
                success: false,
                message: result.message
            });
        }

        /*
         * Store refresh token in an HTTP-only cookie.
         * JavaScript in React cannot read this cookie.
         */
        res.cookie("refreshToken", result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            success: true,
            user: result.user,
            roles: result.roles,
            permissions: result.permissions,
            accessToken: result.accessToken
        });
    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = {
    login
};