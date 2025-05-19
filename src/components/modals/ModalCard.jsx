import { useNavigate } from "react-router-dom";
import { MdClose } from "react-icons/md";
import { FaRegFileAlt, FaRegCommentDots } from "react-icons/fa";

const ModalCard = ({ item, onClose }) => {
  const navigate = useNavigate();

  const handleAIdCom = () => {
    navigate("/comunicados");
  };

  const handleIdCal = () => {
    navigate("/calendarizacion");
  };

  if (!item) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2 max-h-[80vh] relative overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-red-200 hover:bg-red-300 rounded-full text-red-600 hover:text-red-800 transition-colors duration-200"
          aria-label="Close"
        >
          <MdClose size={28} />
        </button>
        <div className="overflow-y-auto max-h-[calc(80vh-4rem)] pr-4">
          <h3 className="text-3xl font-bold mb-4 border-b-2 border-gray-200 pb-2 flex items-center">
            {item.type === "registro" ? (
              <FaRegFileAlt className="mr-2 text-gray-700" size={24} />
            ) : (
              <FaRegCommentDots className="mr-2 text-gray-700" size={24} />
            )}
            {item.type === "registro" ? "Calendarización" : "Comunicado"}
          </h3>
          <p className="text-lg mb-4">
            <span className="font-semibold text-gray-800">Fecha:</span>{" "}
            {new Date(item.date).toLocaleDateString()}
          </p>
          {item.type === "registro" ? (
            <>
              <p className="text-lg mb-4">
                <span className="font-semibold text-gray-800">
                  Barrios y Colonias:
                </span>{" "}
                {item.neighborhoodColonies.map((nc) => nc.name).join(", ") ||
                  "No hay información"}
              </p>
              <p className="text-lg">
                <span className="font-semibold text-gray-800">
                  Observaciones:
                </span>{" "}
                {item.observations || "No hay observaciones"}
              </p>
              <button
                onClick={handleIdCal}
                className="mt-4 text-blue-600 hover:text-blue-800"
              >
                Ver lista de calendarizacion
              </button>
            </>
          ) : (
            <div className="flex flex-col space-y-3">
              <p className="text-lg flex items-center">
                <span className="font-semibold text-gray-800 mr-2">
                  Título:
                </span>{" "}
                {item.tittle || "No hay título"}
              </p>
              <div className="flex">
                <span className="font-medium mr-2">Descripción:</span>
                <span
                  dangerouslySetInnerHTML={{
                    __html: item.content || "No hay descripción",
                  }}
                />
              </div>
              <button
                onClick={handleAIdCom}
                className="mt-4 text-blue-600 hover:text-blue-800"
              >
                Ver lista de comunicado
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalCard;
