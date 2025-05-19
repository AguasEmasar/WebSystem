import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

export const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Suponiendo que los roles se almacenan en el objeto de usuario
  const hasRequiredRole =
    user.roles && allowedRoles.some((role) => user.roles.includes(role));

  if (!hasRequiredRole) {
    // Si hay un error lo redirecciona
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

// Componen para la pagina de no autorizado
export const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">
          Acceso Denegado
        </h1>
        <p className="mb-6">No tienes permisos para acceder a esta página.</p>
        <button
          onClick={() => navigate("/")}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Volver al Inicio
        </button>
      </div>
    </div>
  );
};
