import { useState } from "react";
import {
  FaHome,
  FaMusic,
  FaSearch,
  FaBars,
  FaTimes,
  FaTrash,
  FaEdit,
  FaPlus,
  FaFileAlt,
  FaCalendarAlt,
} from "react-icons/fa";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="flex h-screen relative">
      <div
        className={`transition-all duration-300 ${
          isCollapsed ? "w-20" : "w-1/6"
        } bg-white dark:bg-zinc-800 p-4`}
      >
        <button
          onClick={toggleSidebar}
          className="mb-4 bg-blue-500 text-white p-2 rounded"
        >
          {isCollapsed ? <FaBars /> : <FaTimes />}
        </button>
        <div
          className={`text-lg font-bold mb-6 ${isCollapsed ? "hidden" : ""}`}
        >
          App
        </div>
        <div
          className={`text-zinc-600 dark:text-zinc-300 mb-4 ${
            isCollapsed ? "hidden" : ""
          }`}
        >
          Settings
        </div>
        <ul>
          <SidebarItem
            text="Comunicados"
            icon={<FaHome />}
            isCollapsed={isCollapsed}
          />
          <SidebarItem
            text="Crear usuario"
            icon={<FaSearch />}
            isCollapsed={isCollapsed}
          />
          <SidebarItem
            text="Ver Reportes"
            icon={<FaMusic />}
            isCollapsed={isCollapsed}
          />
        </ul>
      </div>
      <div
        className={`transition-all duration-300 ${
          isCollapsed ? "w-full" : "w-4/5"
        } bg-zinc-100 dark:bg-zinc-900 p-6`}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">
            Empresa Municipal Aguas de Santa Rosa
          </h1>
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Search tickets..."
              className="p-2 border border-zinc-300 dark:border-zinc-700 rounded mr-2"
            />
            <button className="p-2 bg-blue-500 text-white rounded">
              Filter
            </button>
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-800 rounded shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="py-2 px-4">Fecha</th>
                <th className="py-2 px-4">Título</th>
                <th className="py-2 px-4">Usuario</th>
                <th className="py-2 px-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <TableRow
                date="16-Jun"
                title="Calendarización de Distribución de Agua"
                user="User_00"
              />
            </tbody>
          </table>
        </div>
      </div>
      <button
        onClick={toggleModal}
        className="fixed bottom-4 right-4 bg-blue-500 text-white p-4 rounded-full shadow-lg"
      >
        <FaPlus size={24} />
      </button>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded shadow-lg text-center relative w-96">
            <button
              onClick={toggleModal}
              className="absolute top-2 right-2 text-red-500 text-2xl"
            >
              &times;
            </button>
            <h2 className="text-2xl mb-4">Nuevo</h2>
            <div className="flex space-x-8 justify-center items-center">
              <button className="flex flex-col items-center">
                <div className="bg-blue-500 text-white p-4 rounded-full shadow-lg mb-2">
                  <FaFileAlt size={48} />
                </div>
                <span className="text-lg">Comunicado</span>
              </button>
              <button className="flex flex-col items-center">
                <div className="bg-green-500 text-white p-4 rounded-full shadow-lg mb-2">
                  <FaCalendarAlt size={48} />
                </div>
                <span className="text-lg">Calendarización</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SidebarItem = ({ text, icon, isCollapsed }) => {
  return (
    <li className="mb-2">
      <a
        href="#"
        className="flex items-center p-2 text-zinc-800 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded"
      >
        <span className="mr-2">{icon}</span>
        {!isCollapsed && text}
      </a>
    </li>
  );
};

const TableRow = ({ date, title, user }) => {
  return (
    <tr className="border-b">
      <td className="py-2 px-4">{date}</td>
      <td className="py-2 px-4">{title}</td>
      <td className="py-2 px-4">{user}</td>
      <td className="py-2 px-4 flex space-x-2">
        <button className="p-1 bg-green-500 text-white rounded">
          <FaEdit aria-hidden="true" />
        </button>
        <button className="p-1 bg-red-500 text-white rounded">
          <FaTrash aria-hidden="true" />
        </button>
      </td>
    </tr>
  );
};

export default Sidebar;
