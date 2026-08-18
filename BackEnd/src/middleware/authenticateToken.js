const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
    // console.log("Request",req)
    console.log("AUTH HEADER:", req.headers.authorization);
    const authorization = req.headers.authorization;

    if (
        !authorization ||
        !authorization.startsWith("Bearer ")
    ) {
        return res.status(401).json({
            success: false,
            message: "Authentication is required."
        });
    }

    const token = authorization.substring(7);

    try {
        const payload = jwt.verify(
            token,
            process.env.JWT_ACCESS_SECRET,
            {
                issuer: "asset-monitoring-api",
                audience: "asset-monitoring-web"
            }
        );

        req.auth = {
            userId: Number(payload.sub),
            customerId:
                payload.customerId !== null
                    ? Number(payload.customerId)
                    : null,
            userName: payload.userName,
            roles: payload.roles || []
        };

        next();
    } catch(error) {
        console.error("JWT Error:", error);
        return res.status(401).json({
            success: false,
            message: "The session is invalid or expired."
        });
    }
}

module.exports = authenticateToken;