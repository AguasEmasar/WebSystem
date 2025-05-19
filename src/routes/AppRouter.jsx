import { Route, Routes } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import { PublicRoute } from "./PublicRouter";
import AddComunicado from "../pages/AddComunicado";
import AddDistribucion from "../pages/AddDistribucion";
import AddUserPage from "../pages/AddUserPage";
import RecoverPassPage from "../pages/RecoverPassPage";
import { PrivateRouter } from "./PrivateRouter";
import ValidationPage from "../pages/ValidationPage";

import HomePage from "../pages/HomePage";
import EstadisticasPage from "../pages/EstadisticasPage";
import ComunicadosPage from "../pages/comunicatePage/ComunicadosPages";
import EditComunicado from "../pages/comunicatePage/EditComunicado";
import ViewComunicadoPage from "../pages/comunicatePage/ViewComunicadoPage";
import ViewReportPage from "../pages/reports/ViewReportPage";
import ListReportPage from "../pages/reports/ListReportPage";
import CandelarizationPages from "../pages/candelarization/CandelarizationPages";
import AddCalendarizacionPage from "../pages/AddCalendarizacionPage";
import EditCandelarization from "../pages/candelarization/EditCandelarization";
import ViewCandelarizationPage from "../pages/candelarization/ViewCandelarizationPage";
import { UnauthorizedPage } from "../pages/UnauthorizedPage";
import UserManagement from "../pages/admin/UserManagement";

export const AppRouter = () => {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        <Route
          path="Contraseña"
          element={
            <PublicRoute>
              <RecoverPassPage />
            </PublicRoute>
          }
        />

        <Route
          path="validation"
          element={
            <PublicRoute>
              <ValidationPage />
            </PublicRoute>
          }
        />

        <Route
          path="/home"
          element={
            <PrivateRouter>
              <HomePage />
            </PrivateRouter>
          }
        />
        <Route
          path="/comunicados"
          element={
            <PrivateRouter>
              <ComunicadosPage />
            </PrivateRouter>
          }
        />

        <Route
          path="/comunicados/add"
          element={
            <PrivateRouter>
              <AddComunicado />
            </PrivateRouter>
          }
        />

        <Route
          path="/editComunicado/:id"
          element={
            <PrivateRouter>
              <EditComunicado />
            </PrivateRouter>
          }
        />

        <Route
          path="/viewComunicado/:id"
          element={
            <PrivateRouter>
              <ViewComunicadoPage />
            </PrivateRouter>
          }
        />

        <Route
          path="/distribucion"
          element={
            <PrivateRouter>
              <AddDistribucion />
            </PrivateRouter>
          }
        />
        <Route
          path="/calendarizacion"
          element={
            <PrivateRouter>
              <CandelarizationPages />
            </PrivateRouter>
          }
        />

        <Route
          path="/candelarization/add"
          element={
            <PrivateRouter>
              <AddCalendarizacionPage />
            </PrivateRouter>
          }
        />

        <Route
          path="/editCandelarization/:id"
          element={
            <PrivateRouter>
              <EditCandelarization />
            </PrivateRouter>
          }
        />

        <Route
          path="/viewCandelarization/:id"
          element={
            <PrivateRouter>
              <ViewCandelarizationPage />
            </PrivateRouter>
          }
        />

        <Route
          path="/user"
          element={
            <PrivateRouter>
              <AddUserPage />
            </PrivateRouter>
          }
        />
        <Route
          path="/reportes"
          element={
            <PrivateRouter>
              <ListReportPage />
            </PrivateRouter>
          }
        />

        <Route
          path="/viewReport/:id"
          element={
            <PrivateRouter>
              <ViewReportPage />
            </PrivateRouter>
          }
        />

        <Route
          path="/estadisticas"
          element={
            <PrivateRouter>
              <EstadisticasPage />
            </PrivateRouter>
          }
        />

        <Route
          path="/Unauthorized"
          element={
            <PublicRoute>
              <UnauthorizedPage />
            </PublicRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <PrivateRouter>
              <UserManagement />
            </PrivateRouter>
          }
        />
      </Routes>
    </>
  );
};
