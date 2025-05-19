import { useState, useEffect } from "react";
import { FaSearch, FaFilter } from "react-icons/fa";
import { useLocation } from "react-router-dom";

const Header = ({ searchQuery, setSearchQuery, filterType, setFilterType }) => {
  const [showFilterBox, setShowFilterBox] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("Todos");
  const [isSearchDisabled, setIsSearchDisabled] = useState(false);

  const location = useLocation();

  useEffect(() => {
    setIsSearchDisabled(location.pathname !== "/home");
  }, [location]);

  const handleFilterChange = (event) => {
    const newFilter = event.target.value;
    setFilterType(newFilter);
    setSelectedFilter(
      newFilter === "all"
        ? "Filter"
        : newFilter === "registro"
        ? "Calendarización"
        : "Comunicado"
    );
    setShowFilterBox(true);
  };

  return (
    <header className="bg-[#27AAE1] p-4 flex flex-col md:flex-row justify-between items-center w-full left-0 relative">
      <h1 className="text-white text-xl font-bold mb-2 md:mb-0">
        Empresa Municipal Aguas de Santa Rosa
      </h1>
      <div className="flex flex-col md:flex-row items-center w-full md:w-auto">
        <div
          className={`flex items-center bg-white p-2 rounded-md shadow-md w-full md:w-72 mb-2 md:mb-0 ${
            isSearchDisabled ? "pointer-events-none opacity-50" : ""
          }`}
        >
          <FaSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Buscar tickets..."
            className="outline-none w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={isSearchDisabled}
          />
        </div>
        <button
          className={`relative mt-2 md:mt-0 bg-blue-500 text-white p-2 rounded-md flex items-center md:ml-2 transition duration-300 ease-in-out hover:bg-blue-600 ${
            isSearchDisabled ? "cursor-not-allowed" : ""
          }`}
          onClick={() => setShowFilterBox(!showFilterBox)}
          disabled={isSearchDisabled}
        >
          <FaFilter className="mr-1" />
          {selectedFilter}
        </button>
        {showFilterBox && (
          <div className="absolute top-16 right-4 bg-white border border-gray-300 rounded-md shadow-lg w-48 p-2 z-10 transition-transform transform duration-300 ease-in-out">
            <select
              value={filterType}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
            >
              <option value="all">Todos</option>
              <option value="registro">Calendarización</option>
              <option value="comunicado">Comunicado</option>
            </select>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;