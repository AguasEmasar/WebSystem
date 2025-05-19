import { useEffect, useState } from "react";
import axios from "../api/axios";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import ModalAdd from "../components/modals/ModalAdd";
import ModalCard from "../components/modals/ModalCard";
import Card from "../components/Card";
import Pagination from "../components/Pagination";
import AddButton from "../components/buttons/AddButton";

const HomePage = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

  const handleClose = () => setShowModal(false);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const response = await axios.get("/registration", {
          params: { date: new Date().toISOString().split("T")[0] },
        });
        return response.data.data.map((reg) => ({
          ...reg,
          type: "registro",
        }));
      } catch (error) {
        setError("Error fetching registrations");
        // console.error("Error fetching registrations:", error);
        return [];
      }
    };

    const fetchComunicados = async () => {
      try {
        const response = await axios.get("/communicate");
        return response.data.data.map((com) => ({
          ...com,
          type: "comunicado",
        }));
      } catch (error) {
        // setError("Error fetching comunicados");
        // console.error("Error fetching comunicados:", error);
        return [];
      }
    };

    const loadItems = async () => {
      const [registrations, comunicados] = await Promise.all([
        fetchRegistrations(),
        fetchComunicados(),
      ]);
      const combined = [...registrations, ...comunicados];
      const sorted = combined.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      setItems(sorted);
      setFilteredItems(sorted);
    };

    loadItems();
  }, []);

  useEffect(() => {
    let updatedItems = items;

    if (searchQuery) {
      updatedItems = updatedItems.filter(
        (item) =>
          item.tittle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.observations?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterType !== "all") {
      updatedItems = updatedItems.filter((item) => item.type === filterType);
    }

    setFilteredItems(updatedItems);
    setCurrentPage(1);
  }, [searchQuery, filterType, items]);

  const handleCardClick = (item) => {
    setSelectedItem(item);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterType={filterType}
          setFilterType={setFilterType}
        />
  
        <div className="container mx-auto mb-5 p-3">
          {error && <div className="text-red-600 mb-4">{error}</div>}
  
          <h2 className="text-3xl font-bold mb-6 pt-3">
            Calendarización y Comunicados
          </h2>
          
          {/* Mensaje cuando no hay resultados de búsqueda */}
          {filteredItems.length === 0 && searchQuery && (
            <div className="text-gray-600 mb-4">
              No se encontraron resultados para &quot;{searchQuery}&quot;.
            </div>
          )}
          
          {/* Mensaje cuando no hay contenido en general */}
          {filteredItems.length === 0 && !searchQuery && (
            <div className="text-center py-10">
              <p className="text-gray-600 text-lg">
                No hay comunicados o registros de agua disponibles actualmente.
              </p>
              <p className="text-gray-500 mt-2">
                Intenta crear un nuevo comunicado o registro usando el botón "+".
              </p>
            </div>
          )}
          
          {/* Mostrar items solo si hay contenido */}
          {filteredItems.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {currentItems.map((item) => (
                  <Card
                    key={item.id}
                    item={item}
                    onClick={() => handleCardClick(item)}
                  />
                ))}
              </div>
  
              <Pagination
                currentPage={currentPage}
                filteredItems={filteredItems}
                itemsPerPage={itemsPerPage}
                paginate={paginate}
              />
            </>
          )}
  
          {selectedItem && (
            <ModalCard item={selectedItem} onClose={handleCloseModal} />
          )}
        </div>
  
        <AddButton onClick={() => setShowModal(true)} />
        <ModalAdd onClose={handleClose} visible={showModal} />
      </div>
    </div>
  );
};

export default HomePage;
