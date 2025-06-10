import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import axios from "../api/axios";
import { useState, useEffect } from "react";
import Select from "react-select";
import {
  UserPlus,
  Mail,
  Lock,
  User,
  Users,
  Shield,
  Save,
  X,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

const AddUserPage = () => {
  const navigate = useNavigate();
  const [options, setOptions] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    roleId: "",
  });

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await axios.get("/account/get-roles");
      if (Array.isArray(response.data.data)) {
        const rolesData = response.data.data || [];
        const rolesMap = rolesData.map((rol) => ({
          value: rol.id,
          label: rol.name,
        }));
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
  };

  const validateForm = () => {
    const newErrors = {};

    if (!user.username.trim()) newErrors.username = "El usuario es requerido";
    if (!user.email.trim()) newErrors.email = "El correo es requerido";
    if (!user.email.includes("@"))
      newErrors.email = "Formato de correo inválido";
    if (!user.password.trim())
      newErrors.password = "La contraseña es requerida";
    if (user.password.length < 6)
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    if (!user.firstName.trim())
      newErrors.firstName = "El primer nombre es requerido";
    if (!user.lastName.trim()) newErrors.lastName = "El apellido es requerido";
    if (!user.roleId) newErrors.roleId = "El rol es requerido";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});
    setSuccessMessage("");

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

      setSuccessMessage("Usuario creado exitosamente");
      setTimeout(() => {
        navigate("/comunicados");
      }, 2000);
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors({
          general: error.response.data.message || "Error al crear usuario",
        });
      } else {
        setErrors({ general: "Error de conexión" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/comunicados");
  };

  const handleInputChange = (field, value) => {
    setUser({ ...user, [field]: value });
    // Limpiar error específico cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  // Estilos personalizados para react-select
  const selectStyles = {
    control: (provided, state) => ({
      ...provided,
      border: `2px solid ${
        state.isFocused ? "#3B82F6" : errors.roleId ? "#EF4444" : "#E5E7EB"
      }`,
      borderRadius: "8px",
      padding: "4px",
      boxShadow: state.isFocused ? "0 0 0 3px rgba(59, 130, 246, 0.1)" : "none",
      "&:hover": {
        borderColor: state.isFocused ? "#3B82F6" : "#9CA3AF",
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#3B82F6"
        : state.isFocused
        ? "#EBF4FF"
        : "white",
      color: state.isSelected ? "white" : "#374151",
      "&:hover": {
        backgroundColor: state.isSelected ? "#3B82F6" : "#EBF4FF",
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#9CA3AF",
    }),
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-grow">
        <Header />
        <div className="p-6">
          <div className="max-w-4xl mx-auto">
            {/* Header Section */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <UserPlus className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Crear Nuevo Usuario
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Completa la información para registrar un nuevo usuario en
                    el sistema
                  </p>
                </div>
              </div>
            </div>

            {/* Success Message */}
            {successMessage && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                  <p className="text-green-800 font-medium">{successMessage}</p>
                </div>
              </div>
            )}

            {/* General Error Message */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
                  <p className="text-red-800 font-medium">{errors.general}</p>
                </div>
              </div>
            )}

            {/* Form Section */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b">
                <h2 className="text-lg font-semibold text-gray-900">
                  Información del Usuario
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Username */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      <User className="w-4 h-4 inline mr-2" />
                      Nombre de Usuario *
                    </label>
                    <input
                      type="text"
                      value={user.username}
                      onChange={(e) =>
                        handleInputChange("username", e.target.value)
                      }
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                        errors.username ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Ingresa el nombre de usuario"
                    />
                    {errors.username && (
                      <p className="text-red-500 text-sm flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.username}
                      </p>
                    )}
                  </div>
                  {/* Email */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Correo Electrónico *
                    </label>
                    <input
                      type="email"
                      value={user.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="correo@ejemplo.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* First Name */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      <User className="w-4 h-4 inline mr-2" />
                      Primer Nombre *
                    </label>
                    <input
                      type="text"
                      value={user.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                        errors.firstName ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Ingresa el primer nombre"
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-sm flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      <Users className="w-4 h-4 inline mr-2" />
                      Apellido *
                    </label>
                    <input
                      type="text"
                      value={user.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                        errors.lastName ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Ingresa el apellido"
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-sm flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <Lock className="w-4 h-4 inline mr-2" />
                    Contraseña *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={user.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      className={`w-full px-4 py-3 pr-12 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                        errors.password ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Mínimo 6 caracteres"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Role */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <Shield className="w-4 h-4 inline mr-2" />
                    Rol *
                  </label>
                  <Select
                    placeholder="Selecciona un rol"
                    options={options}
                    styles={selectStyles}
                    onChange={(choice) =>
                      handleInputChange("roleId", choice.value)
                    }
                    className="react-select-container"
                    classNamePrefix="react-select"
                  />
                  {errors.roleId && (
                    <p className="text-red-500 text-sm flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.roleId}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4 mt-8 pt-6 border-t">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creando...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Crear Usuario
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUserPage;
