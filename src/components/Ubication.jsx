import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';

export const Ubication = () => {

    const divMapaRef = useRef(null);
    // const mapRef = useRef();
    const [mapa, setMapa] = useState(null);

    useEffect(() => {
        if (divMapaRef.current) {
            const map = new mapboxgl.Map({
                container: divMapaRef.current,
                style: 'mapbox://styles/mapbox/streets-v12',
                center: [-88.7781, 14.767525],
                zoom: 9,
            });
            setMapa(map);

            map.onload = () => {
                if (map) {
                    map.addlayer({
                        id: 'maine',
                        type: 'Feature',
                        source: 'maine',
                        layout: {},
                        paint: {
                            'fill-color': '#0080ff',
                            'fill-opacity': 0.5
                        },
                    });
                }
            }
        }
    }, [divMapaRef]);



    return (
        <div className='flex justify-center p-4'>
            <div
                className='flex justify-center rounded-md'
                ref={divMapaRef}
                style={{ width: '600px', height: '600px' }}
            />
        </div>

    );
};
