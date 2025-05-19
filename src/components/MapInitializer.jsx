import mapboxgl from 'mapbox-gl';
import { useEffect, useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';

const MapInitializer = () => {
  const [initializedMap, setInitializedMap] = useState(null);

  useEffect(() => {
    initializeMap();
  }, []);

  const initializeMap = () => {
    const newMap = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-88.776, 14.782],
      zoom: 12.4,
    });

    newMap.on('load', () => {
      newMap.addSource('neighborhoods', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      });

      newMap.addLayer({
        id: 'neighborhood-fills',
        type: 'fill',
        source: 'neighborhoods',
        layout: {},
        paint: {
          'fill-color': '#1AECD7',
          'fill-opacity': 0.2,
        },
      });

      newMap.addLayer({
        id: 'neighborhood-outline',
        type: 'line',
        source: 'neighborhoods',
        layout: {},
        paint: {
          'line-color': '#49CFEA',
          'line-width': 2,
        },
      });
    });

    setInitializedMap(newMap);
  };

  return { initializedMap, initializeMap };
};

export default MapInitializer;