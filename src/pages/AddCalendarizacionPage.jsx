import { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import CalendarForm from "../components/CalendarForm";
import BlockFetcher from "../components/BlockFetcher";
import MapInitializer from "../components/MapInitializer";
import NeighborhoodUpdater from "../components/NeighborhoodUpdater";

mapboxgl.accessToken = import.meta.env.VITE_MAP_TOKEN;

const AddCalendarizacionPage = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [observations, setObservations] = useState("");
  const [selectedBlocks] = useState([]);
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState({});
  const [fetchNeighborhoods, setBlockNeighborhoods] = useState({});
  const [openDetailId, setOpenDetailId] = useState(null);

  const navigate = useNavigate();

  const { fetchedBlocks, blockNeighborhoods, fetchBlocks } = BlockFetcher();
  const { initializedMap, initializeMap } = MapInitializer();
  const { updateMap } = NeighborhoodUpdater({
    map: initializedMap,
    selectedNeighborhoods,
    blockNeighborhoods,
  });

  useEffect(() => {
    fetchBlocks();
    initializeMap();
  }, []);

  useEffect(() => {
    if (selectedBlocks.length > 0) {
      fetchNeighborhoods(selectedBlocks);
    } else {
      setBlockNeighborhoods({});
    }
  }, [selectedBlocks]);

  useEffect(() => {
    updateMap();
  }, [selectedNeighborhoods, initializedMap]);

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

  const handleObservationsChange = (e) => {
    setObservations(e.target.value);
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

  const handlePublicar = async () => {
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

    const calendarizacionData = {
      date: selectedDate,
      observations: observations,
      neighborhoodsColoniesId: Object.values(selectedNeighborhoods).flat(),
    };

    try {
      // console.log("Sending data:", calendarizacionData);
      const response = await axios.post("/registration", calendarizacionData);

      const registrationWaterId = response.data.data.id;

      const neighborhoodRelations = Object.entries(
        selectedNeighborhoods
      ).flatMap(([blockId, neighborhoodIds]) =>
        neighborhoodIds.map((neighborhoodId) => ({
          registrationWaterId,
          neighborhoodColoniesId: neighborhoodId,
        }))
      );

      // console.log("Sending neighborhood relations:", neighborhoodRelations);
      await axios.post(
        "/RegistrationWaterNeighborhoodsColonies/add-relations",
        neighborhoodRelations
      );

      alert("Calendarización publicada con éxito");
      navigate("/calendarizacion");
    } catch (error) {
      console.error("Error publishing calendarización:", error);
      alert("Error al publicar la calendarización");
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
                <CalendarForm
                  selectedDate={selectedDate}
                  onChangeDate={handleDateChange}
                  blocks={fetchedBlocks}
                  blockNeighborhoods={blockNeighborhoods}
                  selectedNeighborhoods={selectedNeighborhoods}
                  handleNeighborhoodSelect={handleNeighborhoodSelect}
                  observations={observations}
                  onChangeObservations={handleObservationsChange}
                  setOpenDetailId={setOpenDetailId}
                />

                <div className="flex space-x-4">
                  <button
                    className="bg-[#27AAE1] text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
                    onClick={handlePublicar}
                  >
                    Publicar
                  </button>
                  <button
                    onClick={() => navigate("/calendarizacion")}
                    className="bg-red-500 text-white font-bold py-2 px-4 rounded-md hover:bg-red-600 transition duration-300"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
              <div className="w-full lg:w-1/2">
                <div
                  id="map"
                  className="w-full h-[500px] border-2 border-[#27AAE1] rounded-md"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCalendarizacionPage;
