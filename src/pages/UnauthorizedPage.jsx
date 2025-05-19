import { useNavigate } from "react-router-dom";

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
