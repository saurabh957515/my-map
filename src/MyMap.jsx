import React, { useEffect, useRef } from 'react';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import WebTileLayer from '@arcgis/core/layers/WebTileLayer';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';

const MyMap = ({ mapType }) => {
    const mapDiv = useRef(null);
    let isZooming = false;
    useEffect(() => {
        if (!mapDiv.current) return;

        const map = new Map();

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
        const googleSatelliteLayer = new WebTileLayer({
            urlTemplate:
                'https://mts1.google.com/vt/lyrs=s&hl=en&x={col}&y={row}&z={level}&s=Galileo',
            copyright: 'Google Maps',
        });
        const googleTerrainLayer = new WebTileLayer({
            urlTemplate: 'https://mts1.google.com/vt/lyrs=p&hl=en&x={col}&y={row}&z={level}&s=Galileo',
            copyright: 'Google Maps',
            refreshInterval: 0.7,
        });

        const googleLabelsLayer = new WebTileLayer({
            urlTemplate: 'https://mts1.google.com/vt/lyrs=h&hl=en&x={col}&y={row}&z={level}&s=Galileo',
            refreshInterval: 0.7,
        });

        map.add(googleSatelliteLayer);
        map.add(googleLabelsLayer);

        const detailedLayer = new GraphicsLayer({ opacity: 0 });
        map.add(detailedLayer, 5);

        newView.on('mouse-wheel', (event) => {
            event.stopPropagation();
            if (isZooming) return;
            isZooming = true;

            const zoomChange = event.deltaY > 0 ? -1 : 1;
            const targetZoom = newView.zoom + zoomChange;

            newView
                .goTo(
                    { zoom: targetZoom },
                    {
                        duration: 400, easing: 'ease-in-out',
                    }
                )
                .finally(() => {
                    isZooming = false;
                });
        });

        return () => {
            if (newView) newView.destroy();
        };
    }, [mapType]);

    return <div style={{ height: '100vh', width: '100vw' }} ref={mapDiv}></div>;
};

export default MyMap;
