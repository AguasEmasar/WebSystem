import mapboxgl from "mapbox-gl";
import { useEffect } from "react";

const NeighborhoodUpdater = ({
  map,
  selectedNeighborhoods,
  blockNeighborhoods,
}) => {

  useEffect(() => {
    updateMap();
  }, [selectedNeighborhoods, map]);

  const updateMap = () => {
    if (map && map.loaded() && map.getSource("neighborhoods")) {
      const features = Object.entries(selectedNeighborhoods).flatMap(
        ([blockId, neighborhoodIds]) =>
          neighborhoodIds
            .map((neighborhoodId) => {
              const neighborhood = blockNeighborhoods[blockId]?.find(
                (n) => n.id === neighborhoodId
              );
              if (
                neighborhood &&
                neighborhood.polygon &&
                neighborhood.polygon.length > 0
              ) {
                return {
                  type: "Feature",
                  properties: {
                    name: neighborhood.name,
                  },
                  geometry: {
                    type: "Polygon",
                    coordinates: [
                      neighborhood.polygon.map((point) => [
                        parseFloat(point.longitude),
                        parseFloat(point.latitude),
                      ]),
                    ],
                  },
                };
              }
              return null;
            })
            .filter(Boolean)
      );

      map.getSource("neighborhoods").setData({
        type: "FeatureCollection",
        features,
      });

      if (features.length > 0) {
        const bounds = new mapboxgl.LngLatBounds();
        features.forEach((feature) => {
          feature.geometry.coordinates[0].forEach((coord) => {
            bounds.extend(coord);
          });
        });
        map.fitBounds(bounds, { padding: 50 });
      } else {
        map.flyTo({
          center: [-88.776, 14.782],
          zoom: 12.4,
          essential: true,
        });
      }
    }
  };

  return { updateMap };
};

export default NeighborhoodUpdater;
