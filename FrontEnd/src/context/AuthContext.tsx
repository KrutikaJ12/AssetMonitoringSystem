// AuthContext responsible only for authentication state and RBAC helper methods.
// Its job is to:
// Create the context.
// Store authentication state.
// Provide values.
import { createContext, useCallback, useMemo, useState } from "react";

export const AuthContext = createContext(null);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const STORAGE_KEY = "asset-monitoring-auth";
const emptyAuthState = {
  accessToken: null,
  user: null,
  roles: [],
  permissions: [],
  modules: [],
};

function loadStoredAuthentication() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return emptyAuthState;
    }

    return JSON.parse(stored);
  } catch {
    localStorage.removeItem(STORAGE_KEY);

    return emptyAuthState;
  }
}

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(loadStoredAuthentication);

  const permissionSet = useMemo(
    () =>
        new Set(
            authState.permissions.map(
                (permission) =>
                    permission.PermissionCode
            )
        ),
    [authState.permissions]
);

  const saveAuthentication = useCallback((newState) => {
    setAuthState(newState);

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  }, []);
 const setAuthentication = useCallback((data) => {
    const newState = {
        accessToken: data.accessToken,
        user: data.user,
        roles: data.roles || [],
        permissions: data.permissions || [],
        permissionCodes: data.permissionCodes || [],
        modules: data.modules || []
    };

    setAuthState(newState);

    localStorage.setItem(
        "asset-monitoring-auth",
        JSON.stringify(newState)
    );

    // Add this line
    localStorage.setItem(
        "accessToken",
        data.accessToken
    );
}, []);
  const clearAuthentication = useCallback(() => {
     setAuthState(emptyAuthState);

     localStorage.removeItem("asset-monitoring-auth");
    localStorage.removeItem("accessToken");
    // sessionStorage.removeItem(STORAGE_KEY);
  }, []);

//   const login = useCallback(
//     async (loginId, password) => {
//       const response = await fetch(`${API_BASE_URL}/auth/login`, {
//         method: "POST",

//         headers: {
//           "Content-Type": "application/json",
//         },

//         body: JSON.stringify({
//           loginId,
//           password,
//         }),
//       });

//       const result = await response.json();

//       if (!response.ok) {
//         throw new Error(result.message || "Login failed.");
//       }

//       const newState = {
//         accessToken: result.accessToken,

//         user: result.user,

//         roles: result.roles || [],

//         permissions: result.permissions || [],

//         permissionCodes: result.permissionCodes || [],

//         modules: result.modules || [],
//       };

//       saveAuthentication(newState);

//       return newState;
//     },
//     [saveAuthentication],
//   );

  const logout = useCallback(async () => {
    try {
      if (authState.accessToken) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: "POST",

          headers: {
            Authorization: `Bearer ${authState.accessToken}`,
          },
        });
      }
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      clearAuthentication();
    }
  }, [authState.accessToken, clearAuthentication]);

  const hasPermission = useCallback(
    (permissionCode) => permissionSet.has(permissionCode),
    [permissionSet],
  );

  const hasAnyPermission = useCallback(
    (...permissionCodes) =>
      permissionCodes.some((code) => permissionSet.has(code)),
    [permissionSet],
  );

  const hasRole = useCallback(
    (roleCode) => authState.roles.some((role) => role.roleCode === roleCode),
    [authState.roles],
  );
  const hasModule = useCallback(
    (moduleCode) =>
        authState.modules.some(
            (module) => module.moduleCode === moduleCode
        ),
    [authState.modules]
);
  // const authFetch = useCallback(
  //     async (url, options = {}) => {
  //         if (!authState.accessToken) {
  //             throw new Error(
  //                 "Authentication is required."
  //             );
  //         }

  //         const headers = new Headers(
  //             options.headers || {}
  //         );

  //         headers.set(
  //             "Authorization",
  //             `Bearer ${authState.accessToken}`
  //         );

  //         if (
  //             options.body &&
  //             !headers.has("Content-Type")
  //         ) {
  //             headers.set(
  //                 "Content-Type",
  //                 "application/json"
  //             );
  //         }

  //         const response = await fetch(
  //             `${API_BASE_URL}${url}`,
  //             {
  //                 ...options,
  //                 headers
  //             }
  //         );

  //         if (response.status === 401) {
  //             clearAuthentication();
  //         }

  //         return response;
  //     },
  //     [
  //         authState.accessToken,
  //         clearAuthentication
  //     ]
  // );

  const contextValue = useMemo(
    () => ({
      ...authState,

      isAuthenticated: Boolean(authState.accessToken && authState.user),

      setAuthentication,
      clearAuthentication,
      logout,
      hasPermission,
      hasAnyPermission,
      hasRole,
      hasModule
    }),
    [
        authState,
        setAuthentication,
        clearAuthentication,
        logout,
        hasPermission,
        hasAnyPermission,
        hasRole,
        hasModule
    ],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
