middleware/requirePermission
const authRepository =
    require("../repositories/authRepository");

function requirePermission(permissionCode) {
    return async function permissionMiddleware(
        req,
        res,
        next
    ) {
        try {
            if (!req.auth?.userId) {
                return res.status(401).json({
                    success: false,
                    message:
                        "Authentication is required."
                });
            }

            /*
             * Permission is checked against the
             * current database mappings.
             *
             * We do not trust permission values
             * submitted by React.
             */
            const isAllowed =
                await authRepository.hasPermission(
                    req.auth.userId,
                    permissionCode
                );

            if (!isAllowed) {
                return res.status(403).json({
                    success: false,
                    message:
                        "You do not have permission to perform this action.",
                    requiredPermission:
                        permissionCode
                });
            }

            next();
        } catch (error) {
            next(error);
        }
    };
}

module.exports = requirePermission;