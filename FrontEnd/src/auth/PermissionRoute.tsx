
import { Navigate } from "react-router";
import { useAuth } from "../hooks/useAuth"

export default function PermissionRoute({
    permission,
    children
}) {
    const { hasPermission ,permissionCodes} = useAuth();
    console.log("permission",permission)
     console.log("User Permissions:", permissionCodes);
    console.log("Has Permission:", hasPermission(permission));
    if (!hasPermission(permission)) {
        return (
            <Navigate
                to="/forbidden"
                replace
            />
        );
    }

    return children;
}