import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

import 'mapbox-gl/dist/mapbox-gl.css';

export const Shadow = () => {
    const mapContainerRef = useRef();
    const mapRef = useRef();

    useEffect(() => {

        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/light-v11',
            center: [-68.137343, 45.137451],
            zoom: 5
        });

        mapRef.current.on('load', () => {
            mapRef.current.addSource('maine', {
                type: 'geojson',
                data: {
                    type: 'Feature',
                    geometry: {
                        type: 'Polygon',
                        // These coordinates outline Maine.
                        coordinates: [
                            [
                                [-67.13734, 45.13745],
                                [-66.96466, 44.8097],
                                [-68.03252, 44.3252],
                                [-69.06, 43.98],
                                [-70.11617, 43.68405],
                                [-70.64573, 43.09008],
                                [-70.75102, 43.08003],
                                [-70.79761, 43.21973],
                                [-70.98176, 43.36789],
                                [-70.94416, 43.46633],
                                [-71.08482, 45.30524],
                                [-70.66002, 45.46022],
                                [-70.30495, 45.91479],
                                [-70.00014, 46.69317],
                                [-69.23708, 47.44777],
                                [-68.90478, 47.18479],
                                [-68.2343, 47.35462],
                                [-67.79035, 47.06624],
                                [-67.79141, 45.70258],
                                [-67.13734, 45.13745]
                            ]
                        ]
                    }
                }
            });

            mapRef.current.addLayer({
                id: 'maine',
                type: 'fill',
                source: 'maine',
                layout: {},
                paint: {
                    'fill-color': '#0080ff',
                    'fill-opacity': 0.5
                }
            });

            mapRef.current.addLayer({
                
                type: 'line',
                source: 'maine',
                layout: {},
                paint: {
                    'line-color': '#000',
                    'line-width': 3
                }
            });
        });
    }, []);

    // return <div id="map" ref={mapContainerRef} style={{ height: '100%' }} />;
    return(
        <div className='flex justify-center p-4'>
            <div
                className='flex justify-center rounded-md'
                ref={mapContainerRef}
                style={{ width: '600px', height: '600px' }}
            />
        </div>
    );
};
