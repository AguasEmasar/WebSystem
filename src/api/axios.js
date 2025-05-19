import axios from "axios";
import { jwtDecode } from "jwt-decode";

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
const setAuthToken = () => {
  const token = localStorage.getItem("token");

  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

setAuthToken();

let isRefreshing = false; // Flag para evitar múltiples renovaciones de token
let refreshSubscribers = []; // Array para almacenar solicitudes en espera

const redirectTo = (path) => {
  localStorage.clear(); // Limpia el almacenamiento local
  window.location.replace(path); // Redirige al usuario
};

// Función para verificar si el usuario tiene el rol de Admin
const isAdmin = (roles) => {
  return roles.includes("Admin");
};

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    const tokenExpiration = localStorage.getItem("tokenExpiration");

    // Verifica si el token ha expirado
    if (tokenExpiration && new Date() > new Date(tokenExpiration)) {
      redirectTo("/"); // Redirige al inicio de sesión
      return Promise.reject(new Error("El token ha expirado"));
    }

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        let roles =
          decodedToken[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          ] || [];

        if (!Array.isArray(roles)) {
          roles = [roles];
        }

        // Verifica si el usuario tiene el rol de Admin
        if (!isAdmin(roles)) {
          console.warn("Acceso denegado: Se requiere el rol de admin");
          redirectTo("/Unauthorized");
          return Promise.reject(
            new Error("Acceso denegado: Se requiere el rol de admin")
          );
        }

        config.headers["Authorization"] = `Bearer ${token}`;
      } catch (error) {
        // console.error("Error al decodificar el token", error);
        redirectTo("/");
        return Promise.reject(new Error("Error de autenticación"));
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Verifica si el error es 401 (no autorizado) y no es una solicitud de renovación de token
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Si ya se está renovando el token, agrega la solicitud a la lista de espera
        return new Promise((resolve) => {
          refreshSubscribers.push(() => {
            originalRequest.headers[
              "Authorization"
            ] = `Bearer ${localStorage.getItem("token")}`;
            resolve(axios(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.post(
          "/account/refresh-token",
          {
            token: localStorage.getItem("token") ?? "",
            refreshToken: localStorage.getItem("refreshToken") ?? "",
          },
          { withCredentials: true }
        );

        if (response.status === 200) {
          localStorage.setItem("token", response.data.data.token);
          localStorage.setItem("refreshToken", response.data.data.refreshToken);
          localStorage.setItem(
            "tokenExpiration",
            response.data.data.tokenExpiration
          );
          setAuthToken();

          // Reintenta las solicitudes en espera
          refreshSubscribers.forEach((callback) => callback());
          refreshSubscribers = [];

          return axios(originalRequest);
        }
      } catch (refreshError) {
        // console.error("Error al renovar token", refreshError);
        redirectTo("/");
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Si el error no es 401, redirige a la página de no autorizado
    if (error.response?.status === 403) {
      redirectTo("/Unauthorized");
    }

    return Promise.reject(error);
  }
);

export default axios;
