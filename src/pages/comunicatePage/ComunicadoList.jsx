import { useState, useEffect } from "react";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { GrFormView } from "react-icons/gr";
import { CiEdit } from "react-icons/ci";
import { MdOutlineDeleteOutline } from "react-icons/md";
import AddButton from "../../components/buttons/AddButton";

const ComunicadoList = () => {
  const [comunicados, setComunicados] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchComunicados = async () => {
      try {
        const response = await axios.get("/communicate");
        if (Array.isArray(response.data.data)) {
          setComunicados(response.data.data);
        } else {
          console.error(
            "La propiedad 'data' en la respuesta de la API no es un array:",
            response.data.data
          );
        }
      } catch (error) {
        console.error("Error fetching comunicados:", error);
      }
    };

    fetchComunicados();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que deseas eliminar este comunicado?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(`/communicate/${id}`);
        setComunicados(
          comunicados.filter((comunicado) => comunicado.id !== id)
        );
      } catch (error) {
        console.error("Error deleting comunicado:", error);
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "2-digit", year: "2-digit" };
    return new Date(dateString).toLocaleDateString("es-ES", options);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Lista de Comunicados</h1>
        <AddButton onClick={() => navigate("/Comunicados/add")} />
      </div>
      <div className="bg-white shadow-md rounded">
        <table className="w-full text-md bg-white shadow-md rounded">
          <thead>
            <tr className="border-b border-[#27AAE1] h-12">
              <th className="text-left p-2">Fecha</th>
              <th className="text-left p-2">Título</th>
              <th className="text-left p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {comunicados.length > 0 ? (
              comunicados.map((comunicado) => (
                <tr
                  key={comunicado.id}
                  className="border-b border-[#27AAE1] hover:bg-gray-100 h-12"
                >
                  <td className="text-gray-700 p-2">
                    <span className="p-2">
                      {formatDate(comunicado.date)}
                    </span>
                  </td>
                  <td className="p-2">{comunicado.tittle}</td>
                  <td className="p-2">
                    <button
                      className="bg-[#27AAE1] hover:bg-[#1A6DAE] text-white font-bold py-1 px-2 rounded mr-2"
                      onClick={() =>
                        navigate(`/viewComunicado/${comunicado.id}`)
                      }
                    >
                      <GrFormView fontSize={30} />
                    </button>
                    <button
                      className="bg-yellow-500 hover:bg-yellow-400 text-white font-bold py-1 px-2 rounded mr-2"
                      onClick={() =>
                        navigate(`/editComunicado/${comunicado.id}`)
                      }
                    >
                      <CiEdit fontSize={30} />
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded"
                      onClick={() => handleDelete(comunicado.id)}
                    >
                      <MdOutlineDeleteOutline fontSize={30} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center p-4">
                  No hay comunicados disponibles.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComunicadoList;
