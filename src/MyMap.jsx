import React, { useEffect, useRef, useState } from 'react';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import WebTileLayer from '@arcgis/core/layers/WebTileLayer';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';

const MyMap = ({ mapType, setIsAddLeadFormPopUp, isAddLeadFormPopUp }) => {
    const [dataLoading, setDataLoading] = useState(false);
    const mapDiv = useRef(null);

    useEffect(() => {
        if (!mapDiv.current) return;

        const map = new Map({
            basemap: 'gray-vector' // Gray background basemap
        });

        const newView = new MapView({
            container: mapDiv.current,
            map: map,
            zoom: 4,
            maxZoom: 20,
            center: [-84.006, 40.7128],
            constraints: {
                minZoom: 2,
                maxZoom: 20,
                rotationEnabled: false,
                snapToZoom: true,
            },
            ui: { components: [] },
        });

        const googleTerrainLayer = new WebTileLayer({
            urlTemplate: 'https://mts1.google.com/vt/lyrs=p&hl=en&x={col}&y={row}&z={level}&s=Galileo',
            copyright: 'Google Maps',
            refreshInterval: 1
        });

        const googleLabelsLayer = new WebTileLayer({
            urlTemplate: 'https://mts1.google.com/vt/lyrs=h&hl=en&x={col}&y={row}&z={level}&s=Galileo',
            refreshInterval: 1
        });

        map.add(googleTerrainLayer);
        map.add(googleLabelsLayer);

        const detailedLayer = new GraphicsLayer({ opacity: 0 });
        map.add(detailedLayer, 5);


        return () => {
            if (newView) newView.destroy();
        };
    }, [mapType]);

    return (
        <div style={{ height: '100vh', width: '100vw' }} ref={mapDiv}>

        </div>
    );
};

export default MyMap;
