import { Navigate } from "react-router-dom";

function getAdminRouteStatus(token) {
  if (!token) {
    return "login";
  }

  try {
    const payload = JSON.parse(
      atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
    );

    const isExpired = payload.exp && payload.exp * 1000 < Date.now();

    const roles = [
      payload.role,
      payload.roles,
      payload.authorities,
      payload.authority,
    ]
      .flat()
      .filter(Boolean)
      .map((role) =>
        typeof role === "object" ? role.authority || role.role : role
      )
      .map((role) => String(role).replace(/^ROLE_/, "").toUpperCase());

    if (isExpired || !roles.includes("ADMIN")) {
      if (isExpired) {
        localStorage.removeItem("token");
        return "login";
      }

      return "products";
    }

    return "authorized";
  } catch {
    localStorage.removeItem("token");
    return "login";
  }
}

function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const routeStatus = getAdminRouteStatus(token);

  if (routeStatus === "login") {
    return <Navigate to="/login" replace />;
  }

  if (routeStatus === "products") {
    return <Navigate to="/products" replace />;
  }

  return children;
}

export default AdminRoute;