import { FiEyeOff } from "react-icons/fi";
import { LuEye } from "react-icons/lu";
import styled, { keyframes } from "styled-components";
import logo1 from "../Image/Muni.png";
import logo2 from "../Image/Aguas.jpg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

const buttonClassName =
  "w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300";

const wave = keyframes`
  0% { transform: translate3d(0, 0, 0); }
  100% { transform: translate3d(50%, 50%, 0); }
`;

const WavesContainer = styled.div`
  position: relative;
  overflow: hidden;
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;

  &::before,
  &::after {
    content: "";
    position: absolute;
    width: 200%;
    height: 200%;
    top: -100%;
    left: -50%;
    background: linear-gradient(
      45deg,
      rgba(0, 123, 255, 0.6),
      rgba(0, 80, 255, 0.6)
    );
    opacity: 0.7;
    border-radius: 50%;
    animation: ${wave} 30s infinite linear;
    pointer-events: none;
  }

  &::after {
    animation-delay: 15s;
  }
`;

export const ValidationPage = () => {
  const [resetForm, setResetForm] = useState({
    email: "",
    token: "",
    newPassword: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    token: "",
    newPassword: "",
    general: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const navigate = useNavigate();

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      email: "",
      token: "",
      newPassword: "",
      general: "",
    };

    // Validar email
    if (!resetForm.email) {
      newErrors.email = "El correo electrónico es requerido";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resetForm.email)) {
      newErrors.email = "Ingrese un correo electrónico válido";
      isValid = false;
    }

    // Validar token
    if (!resetForm.token) {
      newErrors.token = "El código de recuperación es requerido";
      isValid = false;
    } else if (resetForm.token.length !== 8) {
      newErrors.token = "El código debe tener exactamente 8 dígitos";
      isValid = false;
    } else if (!/^\d+$/.test(resetForm.token)) {
      newErrors.token = "El código debe contener solo números";
      isValid = false;
    }

    // Validar contraseña
    if (!resetForm.newPassword) {
      newErrors.newPassword = "La nueva contraseña es requerida";
      isValid = false;
    } else if (resetForm.newPassword.length < 6) {
      newErrors.newPassword = "La contraseña debe tener al menos 6 caracteres";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await axios.post("/account/reset-password", {
        email: resetForm.email,
        token: resetForm.token,
        newPassword: resetForm.newPassword,
      });

      alert("Contraseña restablecida exitosamente.");
      navigate("/");
    } catch (error) {
      // console.error("Error:", error.response ? error.response.data : error);

      // Manejar respuestas de error específicas desde el backend
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        if (errorData.code === "InvalidToken") {
          setErrors({
            ...errors,
            token: "Código inválido o expirado. Por favor, solicite uno nuevo.",
            general: "",
          });
        } else {
          setErrors({
            ...errors,
            general:
              "No se pudo restablecer la contraseña. Intente nuevamente.",
          });
        }
      } else {
        setErrors({
          ...errors,
          general: "Hubo un error al restablecer la contraseña.",
        });
      }
    }
  };

  return (
    <WavesContainer>
      <div className="max-w-[500px] bg-white bg-opacity-80 rounded-lg shadow-lg p-8 z-10 flex flex-col items-center">
        <div className="text-center mb-1">
          <h1 className="text-4xl font-bold mb-4">Restablecer Contraseña</h1>
          <div className="flex justify-center">
            <div className="mb-auto">
              <img src={logo1} alt="Logo 1" className="h-28 w-64 mx-2 p-5" />
            </div>
            <div className="mt-5">
              <img src={logo2} alt="Logo 2" className="h-20 w-15 mx-2" />
            </div>
          </div>
        </div>
        <div className="w-full">
          <h2 className="text-2xl font-bold mb-2 text-center">
            Restablece tu Contraseña
          </h2>

          {errors.general && (
            <div className="text-red-500 text-center mb-4 p-2 bg-red-50 rounded">
              {errors.general}
            </div>
          )}

          <form className="flex flex-col items-center" onSubmit={handleSubmit}>
            <div className="w-full">
              {/* Campo Email */}
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold mb-2"
                >
                  Correo Electrónico:
                </label>
                <input
                  type="email"
                  id="email"
                  className={`w-80 rounded-md bg-transparent border-b-2 ${
                    errors.email ? "border-red-500" : "border-blue-500"
                  } focus:outline-none focus:border-blue-700 p-2`}
                  value={resetForm.email}
                  onChange={(e) => {
                    setResetForm({ ...resetForm, email: e.target.value });
                    setErrors({ ...errors, email: "" });
                  }}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              {/* Campo Token/Código */}
              <div className="mb-4">
                <label
                  htmlFor="token"
                  className="block text-sm font-semibold mb-2"
                >
                  Código de Recuperación:
                </label>
                <input
                  type="text"
                  id="token"
                  className={`w-80 rounded-md bg-transparent border-b-2 ${
                    errors.token ? "border-red-500" : "border-blue-500"
                  } focus:outline-none focus:border-blue-700 p-2`}
                  value={resetForm.token}
                  onChange={(e) => {
                    // Solo permitir números
                    const value = e.target.value.replace(/\D/g, "");
                    setResetForm({ ...resetForm, token: value });
                    setErrors({ ...errors, token: "" });
                  }}
                  maxLength="8"
                />
                {errors.token && (
                  <p className="text-red-500 text-xs mt-1">{errors.token}</p>
                )}
              </div>

              {/* Campo Nueva Contraseña */}
              <div className="mb-6 relative">
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-semibold mb-2"
                >
                  Nueva Contraseña:
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="newPassword"
                    className={`w-80 rounded-md bg-transparent border-b-2 ${
                      errors.newPassword ? "border-red-500" : "border-blue-500"
                    } focus:outline-none focus:border-blue-700 p-2`}
                    value={resetForm.newPassword}
                    onChange={(e) => {
                      setResetForm({
                        ...resetForm,
                        newPassword: e.target.value,
                      });
                      setErrors({ ...errors, newPassword: "" });
                    }}
                  />
                  <span
                    onClick={handleShowPassword}
                    className="absolute inset-y-0 right-0 px-3 flex items-center cursor-pointer"
                  >
                    {showPassword ? <LuEye /> : <FiEyeOff />}
                  </span>
                </div>
                {errors.newPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.newPassword}
                  </p>
                )}
              </div>

              <button type="submit" className={buttonClassName}>
                Restablecer Contraseña
              </button>
            </div>
          </form>

          <p className="m-4 text-center">
            ¿Ya recuerdas tu contraseña?{" "}
            <button
              onClick={() => navigate("/")}
              className="text-blue-500 underline hover:text-blue-700"
            >
              Inicia sesión aquí
            </button>
          </p>
        </div>
      </div>
    </WavesContainer>
  );
};

export default ValidationPage;
