import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import axios from "../api/axios";
import { useState, useEffect } from "react";
import Select from "react-select";

const AddUserPage = () => {
    const navigate = useNavigate();
    const [options, setOptions] = useState([])
    // const [permission, setPermission] = useState("");

    const [user, setUser] = useState({
        username: "",
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        roleId: "",
    })

    useEffect(() => {
        fetchRoles();
      }, []
    );
    

    const fetchRoles = async () => {
        try {
          const response = await axios.get("/account/get-roles");
          if (Array.isArray(response.data.data)) {
            const rolesData = response.data.data || [] 
            
            const rolesMap = rolesData.map(rol => ({value: rol.id, label: rol.name}));

            setOptions(rolesMap);

          } else {
            console.error(
              "La propiedad 'data' en la respuesta de la API no es un array:",
              response.data.data
            );
          }
        } catch (error) {
          console.error("Error fetching roles:", error);
        }
      }
    
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const { username, email, password, firstName, lastName, roleId } = user;
        try {
            const response = await axios.post(
                "/account/register",
                {
                    username,
                    email,
                    password,
                    firstName,
                    lastName,
                    roleId,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            // console.log("Éxito:", response.data);
            alert("Usuario creado con éxito");
            navigate("/comunicados");
        } catch (error) {
            if (error.response) {
                console.error("Error:", error.response.data.data);
            } else {
                console.error("Error:", error.message);
            }
        }
    }

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-grow">
                <Header />
                <div className="flex flex-col justify-center items-center p-2 w-full h-full md:h-screen">
                    <h1 className="font-bold text-2xl mt-8 ">Crear Nuevo Usuario</h1>
                    <form className="w-7/12 p-6 border-2 border-blue-400 rounded-lg shadow-md">
                        <div className="flex flex-col mb-4">
                            <label className="font-semibold mb-2">Usuario</label>
                            <input
                                className="border-2 w-full p-2 placeholder-gray-600 rounded-md outline-none"
                                placeholder="Usuario"
                                value={user.username}
                                onChange={(e) => setUser({ ...user, username: e.target.value })}
                            />
                        </div>

                        <div className="flex flex-col mb-4">
                            <label className="font-semibold mb-2">Correo Electrónico</label>
                            <input
                                className="border-2 w-full p-2 placeholder-gray-600 rounded-md outline-none"
                                placeholder="Correo Electronico"
                                value={user.email}
                                onChange={(e) => setUser({ ...user, email: e.target.value })}
                            />
                        </div>

                        <div className="flex flex-col mb-4">
                            <label className="font-semibold mb-2">Contraseña</label>
                            <input
                                className="border-2 w-full p-2 placeholder-gray-600 rounded-md outline-none"
                                placeholder="Contraseña"
                                value={user.password}
                                onChange={(e) => setUser({ ...user, password: e.target.value })}
                            />
                        </div>

                        <div className="flex flex-col mb-4">
                            <label className="font-semibold mb-2">Primer Nombre</label>
                            <input
                                className="border-2 w-full p-2 placeholder-gray-600 rounded-md outline-none"
                                placeholder="Primer Nombre"
                                value={user.firstName}
                                onChange={(e) => setUser({ ...user, firstName: e.target.value })}
                            />
                        </div>

                        <div className="flex flex-col mb-4">
                            <label className="font-semibold mb-2">Apellido</label>
                            <input
                                className="border-2 w-full p-2 placeholder-gray-600 rounded-md outline-none"
                                placeholder="Apellido"
                                value={user.lastName}
                                onChange={(e) => setUser({ ...user, lastName: e.target.value })}
                            />
                        </div>

                        <div className="flex flex-col mb-4">
                            <label className="font-semibold mb-2">Rol</label>
                            <Select placeholder="Rol" options={options} onChange={(choice) => setUser({ ...user, roleId: choice.value })} />
                        </div>

                        <div className="mt-3 flex items-center justify-center">
                            <span
                                className="bg-[#27AAE1] hover:bg-blue-700 text-white rounded-md p-2 ml-7 cursor-pointer"
                                onClick={(handleSubmit)}
                            >
                                Crear Usuario
                            </span>

                            <span
                                className="text-white bg-red-500 hover:bg-red-600 rounded-md p-2 ml-7 cursor-pointer"

                            >
                                Cancelar
                            </span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddUserPage;