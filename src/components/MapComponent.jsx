import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = import.meta.env.VITE_MAP_TOKEN;

const MapComponent = ({ selectedNeighborhoods, blockNeighborhoods }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [-88.776, 14.782],
      zoom: 12.4,
    });

    mapRef.current.on('load', () => {
      mapRef.current.addSource("neighborhoods", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [],
        },
      });

      mapRef.current.addLayer({
        id: "neighborhood-fills",
        type: "fill",
        source: "neighborhoods",
        layout: {},
        paint: {
          "fill-color": "#1AECD7",
          "fill-opacity": 0.2,
        },
      });

      mapRef.current.addLayer({
        id: "neighborhood-outline",
        type: "line",
        source: "neighborhoods",
        layout: {},
        paint: {
          "line-color": "#49CFEA",
          "line-width": 2,
        },
      });
    });
  }, []);

  useEffect(() => {
    if (!mapRef.current || !mapRef.current.loaded()) return;

    const features = Object.entries(selectedNeighborhoods).flatMap(([blockId, neighborhoodIds]) =>
      neighborhoodIds.map((neighborhoodId) => {
        const neighborhood = blockNeighborhoods[blockId]?.find(n => n.id === neighborhoodId);
        if (neighborhood && neighborhood.polygon && neighborhood.polygon.length > 0) {
          return {
            type: "Feature",
            properties: { name: neighborhood.name },
            geometry: {
              type: "Polygon",
              coordinates: [neighborhood.polygon.map(point => [parseFloat(point.longitude), parseFloat(point.latitude)])]
            }
          };
        }
        return null;
      }).filter(Boolean)
    );

    mapRef.current.getSource("neighborhoods").setData({
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
      mapRef.current.fitBounds(bounds, { padding: 50 });
    } else {
      mapRef.current.flyTo({
        center: [-88.776, 14.782],
        zoom: 12.4,
        essential: true
      });
    }
  }, [selectedNeighborhoods, blockNeighborhoods]);

  return <div ref={mapContainerRef} className="w-full h-[500px] border-2 border-[#27AAE1] rounded-md" />;
};

export default MapComponent;