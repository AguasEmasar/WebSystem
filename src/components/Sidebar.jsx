import { GoArrowLeft, GoPersonAdd, GoShieldCheck } from "react-icons/go";
import { GoCalendar, GoReport, GoFile } from "react-icons/go";
import { IoHomeOutline } from "react-icons/io5";
import { CiLogout } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FcComboChart } from "react-icons/fc";
import { useContext, useEffect, useState } from "react";
import { NavItem } from "./NavItem";
import logo from "/src/Image/LogoAgua.png";

const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const { logout, user } = useContext(AuthContext);
  const [isAdmin, setIsAdmin] = useState(false);

  // Verifica si el usuario es administrador al cargar el componente o cuando cambia el usuario
  useEffect(() => {
    if (user && Array.isArray(user.roles)) {
      setIsAdmin(user.roles.includes("Admin")); // Actualiza isAdmin basado en los roles del usuario
    } else {
      setIsAdmin(false); // Si no hay usuario o roles, isAdmin es false
    }
  }, [user]);

  // console.log("Es administrador", isAdmin);

  const handleLogout = () => {
    logout();
  };

  // Efecto para manejar el redimensionamiento de la ventana
  useEffect(() => {
    const handleResize = () => {
      setOpen(window.innerWidth >= 768);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex">
      <div
        className={`bg-white p-5 pt-8 fixed top-0 left-0 h-full z-50 transition-all duration-300 ease-in-out ${
          open ? "w-56" : "w-20"
        } flex flex-col`}
        style={{ boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)" }}
      >
        <GoArrowLeft
          className={`bg-[#27AAE1] text-white text-2xl rounded-full absolute -right-3 top-9 border border-blue-light cursor-pointer transition-transform duration-300 ease-in-out ${
            !open ? "rotate-180" : "rotate-0"
          }`}
          onClick={() => setOpen(!open)}
        />

        <div className="inline-flex mb-6 items-center gap-x-2">
          <img src={logo} alt="logo" className="h-12 w-auto max-w-[66px] object-contain" />
          {open && (
            <span className="text-[#27AAE1] font-bold">AquaSystem</span>
          )}
        </div>

        <nav className="flex-grow">
          <ul>
            <NavItem
              icon={<IoHomeOutline />}
              onClick={() => navigate("/home")}
              open={open}
              title={"Inicio"}
            />
            <NavItem
              icon={<GoFile />}
              onClick={() => navigate("/Comunicados")}
              open={open}
              title={"Comunicados"}
            />
            <NavItem
              icon={<GoCalendar />}
              onClick={() => navigate("/calendarizacion")}
              open={open}
              title={"Calendarización y Distribución"}
            />
            <NavItem
              icon={<GoPersonAdd />}
              onClick={() => navigate("/User")}
              open={open}
              title={"Usuario"}
            />

            {/* Sección de Admin (solo si isAdmin es true) */}
            <NavItem
              icon={<GoShieldCheck />}
              onClick={() => navigate("/admin/users")}
              open={open}
              title={"Administración de Usuarios"}
            />

            <NavItem
              icon={<GoReport />}
              onClick={() => navigate("/Reportes")}
              open={open}
              title={"Reportes"}
            />
            <NavItem
              icon={<FcComboChart />}
              onClick={() => navigate("/estadisticas")}
              open={open}
              title={"Estadísticas"}
            />
          </ul>
        </nav>

        <ul className="mt-auto">
          <NavItem
            icon={<CiLogout />}
            onClick={handleLogout}
            open={open}
            title={"Cerrar Sesión"}
          />
        </ul>
      </div>

      <div
        className={`flex-grow transition-all duration-300 ease-in-out ${
          open ? "ml-56" : "ml-20"
        } mt-16`}
      >
        {/* Contenido principal */}
      </div>
    </div>
  );
};

export default Sidebar;
