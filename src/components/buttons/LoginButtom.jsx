import { CiLogin } from "react-icons/ci";
import { FaUserCheck } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
export const LogintButton = () => {
  const navigate = useNavigate();

  const handleLogOut = () => {
    // console.log('Click en salir2')
    navigate("/login", { replace: true });
  };

  const handleRegister = () => {
    // console.log('Click en el registro')
    navigate("/register", { replace: true });
  };

  return (
    <div className="relative flex">
      <button
        type="submit"
        onClick={handleLogOut}
        className="z-20 text-white flex flex-col shrink-0 grow-0 
                bottom-0  rounded-lg mr-5 mb-5 lg:mb-5 text-center xl:mb-10 xl:mr-10"
      >
        <div
          className="p-3 rounded-lg border-4 border-white bg-teal-500 
                    hover:bg-teal-700 transition-colors items-center flex"
        >
          <CiLogin className="" />
          Iniciar Sesión
        </div>
      </button>
      <button
        type="submit"
        onClick={handleRegister}
        className="z-20 text-white flex flex-col shrink-0 grow-0 
                bottom-0  rounded-lg mr-5 mb-5 lg:mb-5 text-center xl:mb-10 xl:mr-10"
      >
        <div
          className="p-3 rounded-lg border-4 border-white bg-teal-500 
                    hover:bg-teal-700 transition-colors items-center flex"
        >
          <FaUserCheck />
          Registrarse
        </div>
      </button>
    </div>
  );
};
