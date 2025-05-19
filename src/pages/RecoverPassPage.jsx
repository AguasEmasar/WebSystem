import styled, { keyframes } from "styled-components";
import logo1 from "../Image/Muni.png";
import logo2 from "../Image/Aguas.jpg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

const wave = keyframes`
  0% {
    transform: translate3d(0, 0, 0);
  }
  100% {
    transform: translate3d(50%, 50%, 0);
  }
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

export const RecoverPassPage = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      setError("Por favor ingrese un correo electrónico válido");
      return;
    }

    try {
      await axios.post("/account/generate-password-reset-token", {
        email: email,
      });
      setSuccess(true);
      setTimeout(() => {
        navigate("/validation", { state: { email } });
      }, 2000);
    } catch (error) {
      setError("Error al procesar la solicitud. Por favor intente nuevamente.");
    }
  };

  return (
    <WavesContainer>
      <div className="max-w-[500px] bg-white bg-opacity-80 rounded-lg shadow-lg p-8 z-10 flex flex-col items-center">
        <div className="text-center mb-1">
          <h1 className="text-4xl font-bold mb-4">Recuperar Contraseña</h1>
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
          <p className="text-center mb-6">
            Ingrese su correo electrónico para recibir un código de verificación
          </p>

          <form className="flex flex-col items-center" onSubmit={handleSubmit}>
            <div className="w-full mb-6">
              <label
                htmlFor="email"
                className="block text-sm font-semibold mb-2"
              >
                Correo Electrónico:
              </label>
              <input
                type="email"
                id="email"
                className={`w-full rounded-md bg-transparent border-b-2 ${
                  error ? "border-red-500" : "border-blue-500"
                } focus:outline-none focus:border-blue-700 p-2`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>

            {success && (
              <div className="mb-4 text-green-600 text-center">
                ¡Correo enviado! Redirigiendo...
              </div>
            )}

            <button
              type="submit"
              className="w-1/2 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
              disabled={success}
            >
              Enviar Código
            </button>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="mt-4 text-blue-500 hover:text-blue-700"
            >
              Volver al inicio
            </button>
          </form>
        </div>
      </div>
    </WavesContainer>
  );
};

export default RecoverPassPage;
