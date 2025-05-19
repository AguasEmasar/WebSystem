const Card = ({ item, onClick = [] }) => {
  // Function to get neighborhood/colony names from their IDs
  // const getNeighborhoodNames = (ids) => {
  //   return neighborhoods
  //     .filter((neighborhood) => ids.includes(neighborhood.id))
  //     .map((neighborhood) => neighborhood.name || "Desconocido")
  //     .join(", ");
  // };

  return (
    <div
      className="p-6 bg-white border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      onClick={onClick}
    >
      <div className="mb-4">
        <span className="font-bold text-gray-800 text-xl">
          {item.type === "registro" ? "Calendarización" : "Comunicado"}:
        </span>
        <span className="ml-2 text-gray-700 font-semibold">
          {new Date(item.date).toLocaleDateString()}
        </span>
      </div>
      <p className="text-lg">
        {item.type === "registro" ? (
          <>
            <span className="font-semibold text-gray-800">
              Barrios y Colonias:
            </span>{" "}
            {item.neighborhoodColonies.map((nc) => nc.name).join(", ") ||
              "No hay información"}
          </>
        ) : (
          <>
            <span className="font-medium text-gray-800">Título:</span>{" "}
            {item.tittle || "No hay título"}
          </>
        )}
      </p>
    </div>
  );
};

export default Card;
