import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import BackButton from "../../components/buttons/BackButton";

const CandelarizationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [calendarization, setCalendarization] = useState(null);
  const [neighborhoods, setNeighborhoods] = useState([]);

  useEffect(() => {
    const fetchCalendarization = async () => {
      try {
        const response = await axios.get(
          `/registration/${id}`
        );
        if (response.data && response.data.data) {
          setCalendarization(response.data.data);
        } else {
          console.error("La respuesta de la API no tiene datos.");
        }
      } catch (error) {
        console.error("Error al obtener la calendarización:", error);
      }
    };

    const fetchNeighborhoodColonies = async () => {
      try {
        const response = await axios.get(
          "/neighborhood-colony"
        );
        if (Array.isArray(response.data.data)) {
          setNeighborhoods(response.data.data);
        } else {
          console.error(
            "La propiedad 'data' en la respuesta de la API no es un array:",
            response.data.data
          );
        }
      } catch (error) {
        console.error("Error al obtener barrios/colonias:", error);
      }
    };

    fetchCalendarization();
    fetchNeighborhoodColonies();
  }, [id]);

  const getNeighborhoodColonies = (neighborhoods, ids) => {
    return neighborhoods
      .filter((nc) => ids.includes(nc.id))
      .map((nc) => nc.name || "Desconocido")
      .join(", ");
  };

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "2-digit", year: "2-digit" };
    return new Date(dateString).toLocaleDateString("es-ES", options);
  };

  return (
    <div className="flex flex-col">
      <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Detalles de Calendarización</h1>
          {/* <button
            
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Regresar a la lista
          </button> */}
          <BackButton onClick={() => navigate(-1)} />
        </div>
        {calendarization ? (
          <div className="space-y-6">
            <div className="flex flex-col gap-4">
              <div className="flex gap-4">
                <p className="font-semibold text-gray-900">Fecha:</p>
                <p className="text-gray-900">{formatDate(calendarization.date)}</p>
              </div>
              <div className="flex gap-4">
                <p className="font-semibold text-gray-900">Observaciones:</p>
                <p className="text-gray-900">{calendarization.observations || "No hay observaciones"}</p>
              </div>
              <div className="flex gap-4">
                <p className="font-semibold text-gray-900">Barrios/Colonias:</p>
                <p className="text-gray-00">
                  {calendarization.neighborhoodColonies
                    ? getNeighborhoodColonies(
                        neighborhoods,
                        calendarization.neighborhoodColonies.map((nc) => nc.id)
                      )
                    : "No hay barrios/colonias asociadas."}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-600">Cargando detalles de calendarización...</p>
        )}
      </div>
    </div>
  );
};

export default CandelarizationDetail;
