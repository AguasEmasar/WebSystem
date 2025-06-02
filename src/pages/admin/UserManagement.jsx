import { useEffect, useState, useMemo } from "react";
import { FiSearch, FiTrash, FiUser, FiUserPlus } from "react-icons/fi";
import { MdOutlineAssignmentInd } from "react-icons/md";
import { roleService } from "../../../services/roleService";
import axios from "../../api/axios";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

export default function UserManagement() {
  const [users, setUsers] = useState([]); // Usuarios
  const [roles, setRoles] = useState([]); // Roles
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false); // Para controlar estado asignación
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, rolesResponse] = await Promise.all([
          roleService.getAllUsers(),
          roleService.getRole(),
        ]);
        setUsers(usersResponse || []);
        setRoles(rolesResponse || []);
      } catch (error) {
        alert("Error al obtener los datos");
        console.error("Error al obtener los datos", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAssignRole = async () => {
    if (!selectedUser || !selectedRole) {
      alert("Seleccione un usuario y un rol");
      return;
    }
    try {
      setAssigning(true);
      await axios.post(`/account/assign-role/${selectedUser.id}`, {
        roleName: selectedRole,
      });
      const updatedUsers = await roleService.getAllUsers();
      setUsers(updatedUsers || []);
      alert("Rol asignado correctamente");
      // Limpiar selección si quieres
      setSelectedUser(null);
      setSelectedRole("");
    } catch (error) {
      alert(error.response?.data?.message || "Error al asignar rol");
      console.error("Error al asignar rol:", error);
    } finally {
      setAssigning(false);
    }
  };

  const handleRemoveRole = async (userId, roleName) => {
    try {
      await roleService.removeRole(userId, roleName);
      const updatedUsers = await roleService.getAllUsers();
      setUsers(updatedUsers || []);
      alert(`Rol ${roleName} eliminado correctamente`);
    } catch (error) {
      alert("Error al eliminar el rol");
      console.error("Error al eliminar el rol", error);
    }
  };

  const filteredUsers = useMemo(
    () =>
      users.filter((user) =>
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [users, searchTerm]
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-medium">Cargando datos...</div>
      </div>
    );
  }

  return (
    <div className="flex colors">
      <Sidebar />
      <div className="flex-grow">
        <Header />
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <FiUser className="mr-2" /> Administración de Roles
          </h1>

          {/* Campo de búsqueda */}
          <div className="mt-4 relative">
            <input
              type="text"
              placeholder="Buscar por correo"
              className="block w-full rounded-md border border-gray-300 px-3 py-2 pl-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <FiSearch className="text-gray-500" />
            </div>
          </div>

          {/* Asignar Rol */}
          <div className="mt-6 rounded-lg bg-white p-6 shadow">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <MdOutlineAssignmentInd className="mr-2" /> Asignar Rol
            </h2>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Usuario
                </label>
                <select
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  value={selectedUser?.id?.toString() || ""}
                  onChange={(e) => {
                    const user = users.find(
                      (u) => u.id.toString() === e.target.value
                    );
                    setSelectedUser(user);
                  }}
                >
                  <option value="">Selecciona un usuario</option>
                  {[...filteredUsers]
                    .sort((a, b) => a.firstName.localeCompare(b.firstName))
                    .map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.firstName} {user.lastName}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Rol
                </label>
                <select
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                >
                  <option value="">Selecciona un rol</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.name}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleAssignRole}
                  disabled={assigning}
                  className={`rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center ${
                    assigning
                      ? "bg-indigo-400 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-500 focus:ring-indigo-600"
                  }`}
                >
                  {assigning ? (
                    "Asignando..."
                  ) : (
                    <>
                      <FiUserPlus className="mr-2" /> Asignar Rol
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Tabla de usuarios y roles */}
          <div className="mt-6 rounded-lg bg-white p-6 shadow">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              Usuarios y Roles
            </h2>
            <div className="mt-4 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                      Usuario
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Email
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Roles
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500">
                        <div className="flex flex-wrap gap-2">
                          {user.roles.map((role, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"
                            >
                              {role}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500">
                        {user.roles.map((role, index) => (
                          <button
                            key={index}
                            onClick={() => handleRemoveRole(user.id, role)}
                            className="rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-800 hover:bg-red-200 items-center mr-2 inline-flex"
                          >
                            <FiTrash className="mr-2" /> {role}
                          </button>
                        ))}
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-center py-4 text-sm text-gray-500"
                      >
                        No se encontraron usuarios.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
