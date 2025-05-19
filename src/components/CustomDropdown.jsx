const CustomDropdown = ({
  block,
  neighborhoods,
  selectedNeighborhoods,
  onNeighborhoodSelect,
  onBlockChange,
}) => {
  // Manejo de la selección de barrios/colonias
  const handleNeighborhoodChange = (neighborhoodId, isSelected) => {
    onNeighborhoodSelect(neighborhoodId, isSelected);
  };

  return (
    <div>
      <h3>{block.name}</h3>
      <input
        type="checkbox"
        onChange={(e) => onBlockChange(e.target.checked)}
      />
      <label>Select Block</label>
      <div>
        {neighborhoods.map((neighborhood) => (
          <div key={neighborhood.id}>
            <input
              type="checkbox"
              checked={selectedNeighborhoods.includes(neighborhood.id)}
              onChange={(e) =>
                handleNeighborhoodChange(neighborhood.id, e.target.checked)
              }
            />
            <label>{neighborhood.name}</label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomDropdown;
