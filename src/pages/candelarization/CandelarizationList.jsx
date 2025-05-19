import { useState, useEffect } from "react";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { GrFormView } from "react-icons/gr";
import { CiEdit } from "react-icons/ci";
import { MdOutlineDeleteOutline } from "react-icons/md";
import AddButton from '../../components/buttons/AddButton';

const CalendarizationList = () => {
  const [calendarizations, setCalendarizations] = useState([]);
  const [neighborhoodColonies, setNeighborhoodColonies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCalendarizations = async () => {
      try {
        const response = await axios.get("/registration");
        if (Array.isArray(response.data.data)) {
          setCalendarizations(response.data.data);
        } else {
          console.error(
            "La propiedad 'data' en la respuesta de la API no es un array:",
            response.data.data
          );
        }
      } catch (error) {
        handleError(error);
      }
    };

    const fetchNeighborhoodColonies = async () => {
      try {
        const response = await axios.get("/neighborhood-colony");
        if (Array.isArray(response.data.data)) {
          setNeighborhoodColonies(response.data.data);
        } else {
          console.error(
            "La propiedad 'data' en la respuesta de la API no es un array:",
            response.data.data
          );
        }
      } catch (error) {
        handleError(error);
      }
    };

    fetchCalendarizations();
    fetchNeighborhoodColonies();
  }, []);

  const handleError = (error) => {
    if (error.response) {
      console.error("Response error:", error.response.status);
      console.error("Response data:", error.response.data);
    } else if (error.request) {
      console.error("Request error:", error.request);
    } else {
      console.error("Error message:", error.message);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que deseas eliminar la calendarización?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(`/registration/${id}`);
        setCalendarizations((prev) =>
          prev.filter((calendarization) => calendarization.id !== id)
        );
      } catch (error) {
        handleError(error);
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "2-digit", year: "2-digit" };
    return new Date(dateString).toLocaleDateString("es-ES", options);
  };

  const getNeighborhoodColonies = (neighborhoodColonies) => {
    return neighborhoodColonies
      .map((nc) => nc.name || "Desconocido")
      .join(", ");
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Lista de Calendarización</h1>

        <AddButton onClick={() => navigate("/candelarization/add")} />
      </div>
      <div className="bg-white shadow-md rounded">
        <table className="w-full text-md bg-white shadow-md rounded">
          <thead>
            <tr className="border-b border-[#27AAE1] h-12">
              <th className="text-left p-2">Fecha</th>
              <th className="text-left p-2">Barrios/Colonias</th>
              <th className="text-left p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {calendarizations.length > 0 ? (
              calendarizations.map((calendarization) => (
                <tr
                  key={calendarization.id}
                  className="border-b border-[#27AAE1] hover:bg-gray-100 h-12"
                >
                  <td className="text-gray-700 p-2">
                    <span className="p-2">
                      {formatDate(calendarization.date)}
                    </span>
                  </td>
                  <td className="p-2">
                    {getNeighborhoodColonies(calendarization.neighborhoodColonies)}
                  </td>
                  <td className="p-2 flex">
                    <button
                      className="bg-[#27AAE1] hover:bg-[#1A6DAE] text-white font-bold py-1 px-2 rounded mr-2"
                      onClick={() =>
                        navigate(`/viewCandelarization/${calendarization.id}`)
                      }
                    >
                      <GrFormView fontSize={30} />
                    </button>
                    <button
                      className="bg-yellow-500 hover:bg-yellow-400 text-white font-bold py-1 px-2 rounded mr-2"
                      onClick={() =>
                        navigate(`/editCandelarization/${calendarization.id}`)
                      }
                    >
                      <CiEdit fontSize={30} />
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded"
                      onClick={() => handleDelete(calendarization.id)}
                    >
                      <MdOutlineDeleteOutline fontSize={30} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center p-4">
                  No hay calendarizaciones disponibles.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CalendarizationList;
