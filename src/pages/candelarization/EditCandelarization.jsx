import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import axios from "../../api/axios";
import MapComponent from "../../components/MapComponent";
import BlockNeighborhoodSelector from "../../components/BlockNeighborhoodSelector";
import ActionButtons from "../../components/buttons/ActionButtons";

const EditCalendarization = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState("");
  const [blocks, setBlocks] = useState([]);
  const [observations, setObservations] = useState("");
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState({});
  const [blockNeighborhoods, setBlockNeighborhoods] = useState({});
  const [openDetailId, setOpenDetailId] = useState(null);

  useEffect(() => {
    fetchCalendarization();
    fetchBlocks();
  }, []);

  const fetchCalendarization = async () => {
    try {
      const response = await axios.get(`/registration/${id}`);
      const data = response.data.data;
      setSelectedDate(data.date.split("T")[0]);
      setObservations(data.observations);

      const neighborhoodsByBlock = {};
      data.neighborhoodColonies.forEach((nc) => {
        if (!neighborhoodsByBlock[nc.blockId]) {
          neighborhoodsByBlock[nc.blockId] = [];
        }
        neighborhoodsByBlock[nc.blockId].push(nc.id);
      });
      setSelectedNeighborhoods(neighborhoodsByBlock);
    } catch (error) {
      console.error("Error fetching calendarization:", error);
    }
  };

  const fetchBlocks = async () => {
    try {
      const response = await axios.get("/block");
      const blocksData = response.data.data || [];
      setBlocks(blocksData);
      fetchNeighborhoods(blocksData.map((block) => block.id));
    } catch (error) {
      console.error("Error fetching blocks:", error);
    }
  };

  const fetchNeighborhoods = async (blockIds) => {
    try {
      const neighborhoodsData = {};
      for (const blockId of blockIds) {
        const response = await axios.get(
          `/neighborhood-colony/block/${blockId}`
        );
        const data = response.data;
        if (data.status) {
          neighborhoodsData[blockId] = await Promise.all(
            data.data.map(async (neighborhood) => {
              const polygonResponse = await axios.get(
                `/districts-points/byNeighborhoodsColonies/${neighborhood.id}`
              );
              return {
                ...neighborhood,
                polygon: polygonResponse.data.data,
              };
            })
          );
        }
      }
      setBlockNeighborhoods((prev) => ({ ...prev, ...neighborhoodsData }));
    } catch (error) {
      console.error("Error fetching neighborhoods:", error);
    }
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleNeighborhoodSelect = (blockId, neighborhoodId, isSelected) => {
    setSelectedNeighborhoods((prev) => {
      const newSelection = { ...prev };
      if (!newSelection[blockId]) {
        newSelection[blockId] = [];
      }
      if (isSelected) {
        newSelection[blockId] = [...newSelection[blockId], neighborhoodId];
      } else {
        newSelection[blockId] = newSelection[blockId].filter(
          (id) => id !== neighborhoodId
        );
      }
      if (newSelection[blockId].length === 0) {
        delete newSelection[blockId];
      }
      return newSelection;
    });
  };

  const handleToggle = (blockId, isOpen) => {
    setOpenDetailId(isOpen ? blockId : null);
  };

  const validateSelectedNeighborhoods = () => {
    for (const [blockId, neighborhoods] of Object.entries(
      selectedNeighborhoods
    )) {
      if (!Array.isArray(neighborhoods) || neighborhoods.length === 0) {
        console.error(`No neighborhoods selected for block ${blockId}`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!selectedDate) {
      alert("Por favor, selecciona una fecha.");
      return;
    }

    if (Object.keys(selectedNeighborhoods).length === 0) {
      alert("Por favor, selecciona al menos un barrio o colonia.");
      return;
    }

    if (!validateSelectedNeighborhoods()) {
      alert("Verifica las selecciones de barrios/colonias.");
      return;
    }

    const calendarizationData = {
      date: selectedDate,
      observations: observations,
      neighborhoodsColoniesId: Object.values(selectedNeighborhoods).flat(),
    };

    try {
      await axios.put(`/registration/${id}`, calendarizationData);

      const neighborhoodRelations = Object.values(selectedNeighborhoods)
        .flat()
        .map((neighborhoodId) => ({
          registrationWaterId: id,
          neighborhoodColoniesId: neighborhoodId,
        }));

      await axios.post(
        "/RegistrationWaterNeighborhoodsColonies/add-relations",
        neighborhoodRelations
      );

      alert("Calendarización actualizada con éxito");
      navigate("/calendarizacion");
    } catch (error) {
      console.error("Error updating calendarization:", error);
      alert("Error al actualizar la calendarización");
    }
  };

  return (
    <div className="flex colors">
      <Sidebar />
      <div className="flex-grow">
        <Header />
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
          <div className="w-full max-w-6xl bg-white rounded-lg shadow-xl p-6">
            <h1 className="font-bold text-3xl mb-6 text-center text-[#27AAE1]">
              Nuevo Calendario y Distribución
            </h1>

            <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-6">
              <div className="flex flex-col w-full lg:w-1/2 space-y-6">
                <div>
                  <h2 className="font-bold text-lg mb-2">Fecha</h2>
                  <input
                    type="date"
                    className="border-2 border-[#27AAE1] rounded-md p-2 w-full"
                    onChange={handleDateChange}
                    value={selectedDate}
                  />
                </div>

                <BlockNeighborhoodSelector
                  blocks={blocks}
                  blockNeighborhoods={blockNeighborhoods}
                  selectedNeighborhoods={selectedNeighborhoods}
                  onNeighborhoodSelect={handleNeighborhoodSelect}
                  openDetailId={openDetailId}
                  onToggle={handleToggle}
                />

                <div>
                  <h2 className="font-bold text-lg mb-2">Observaciones</h2>
                  <textarea
                    className="w-full border-2 border-[#27AAE1] rounded-md p-2"
                    rows="4"
                    value={observations}
                    placeholder="Agregue una descripción"
                    onChange={(e) => setObservations(e.target.value)}
                  />
                </div>

                <div className="flex space-x-4">
                  <ActionButtons
                    onPublish={handleSubmit}
                    onCancel={() => navigate("/calendarizacion")}
                  />
                </div>
              </div>

              <div className="w-full lg:w-1/2">
                <MapComponent
                  selectedNeighborhoods={selectedNeighborhoods}
                  blockNeighborhoods={blockNeighborhoods}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCalendarization;
