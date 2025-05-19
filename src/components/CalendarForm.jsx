import { GrFormDown } from "react-icons/gr";

const CalendarForm = ({
  selectedDate,
  onChangeDate,
  openDetailId,
  blocks,
  blockNeighborhoods,
  selectedNeighborhoods,
  handleNeighborhoodSelect,
  observations,
  onChangeObservations,
  setOpenDetailId
}) => {
  const handleToggle = (blockId, isOpen) => {
    setOpenDetailId(isOpen ? blockId : null);
  };
  return (
    <div>
      <h2 className="font-bold text-lg mb-2">Fecha</h2>
      <input
        type="date"
        className="border-2 border-[#27AAE1] rounded-md p-2 w-full"
        onChange={onChangeDate}
        value={selectedDate}
      />

      <h2 className="font-bold text-lg mb-2">Zona y Barrio/Colonia</h2>
      <div className="space-y-2">

      {blocks.map((block) => (
        <div key={block.id} className="border-2 border-[#27AAE1] rounded-md p-3">
          <details
            open={openDetailId === block.id}
            onToggle={(e) => handleToggle(block.id, e.target.open)}
          >
            <summary className="font-semibold flex justify-between items-center cursor-pointer">
              <span className="flex items-center">
                <GrFormDown
                  className={`transition-transform duration-300 ease ${
                    openDetailId === block.id ? "rotate-180" : "rotate-0"
                  }`}
                  fontSize={20}
                />
                <span className="ml-2">{block.name}</span>
              </span>
              <span className="text-sm text-gray-600">
                {selectedNeighborhoods[block.id]?.length || 0}{" "} seleccionados
              </span>
            </summary>
            <div className="mt-2 ml-6 max-h-60 overflow-y-auto pr-2">
              {blockNeighborhoods[block.id] ? (
                blockNeighborhoods[block.id].map((neighborhood) => (
                  <div key={neighborhood.id} className="flex items-center py-1">
                    <input
                      type="checkbox"
                      id={`neighborhood-${neighborhood.id}`}
                      checked={
                        selectedNeighborhoods[block.id]?.includes(
                          neighborhood.id
                        ) || false
                      }
                      onChange={(e) =>
                        handleNeighborhoodSelect(
                          block.id,
                          neighborhood.id,
                          e.target.checked
                        )
                      }
                      className="mr-2"
                    />
                    <label
                      htmlFor={`neighborhood-${neighborhood.id}`}
                      className="text-sm"
                    >
                      {neighborhood.name}
                    </label>
                  </div>
                ))
              ) : (
                <p>Cargando barrios y colonias...</p>
              )}
            </div>
          </details>
        </div>
      ))}
      </div>

      <h2 className="font-bold text-lg mb-2">Observaciones</h2>
      <textarea
        className="w-full border-2 border-[#27AAE1] rounded-md p-2"
        rows="4"
        value={observations}
        onChange={onChangeObservations}
        placeholder="Agregue una descripción"
      />
    </div>
  );
};

export default CalendarForm;
