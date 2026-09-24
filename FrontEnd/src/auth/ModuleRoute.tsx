import { Navigate } from "react-router";
import { useAuth } from "../hooks/useAuth"

export default function ModuleRoute({
    moduleCode,
    children,
}) {
    const { hasModule } = useAuth();

    if (!hasModule(moduleCode)) {
        return <Navigate to="/forbidden" replace />;
    }

    return children;
}