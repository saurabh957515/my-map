import React, { useEffect, useRef, useState } from 'react';

const MyGoogleMap = () => {
    const mapDiv = useRef(null);
    const [map, setMap] = useState(null);
    const [terrainLayer, setTerrainLayer] = useState(null);
    const [labelsLayer, setLabelsLayer] = useState(null);
    const [dataLoading, setDataLoading] = useState(false);
    const [terrainLayerOpacity, setTerrainLayerOpacity] = useState(0);
    const [labelsLayerOpacity, setLabelsLayerOpacity] = useState(0);

    useEffect(() => {
        // Load Google Maps JavaScript API dynamically
        const loadGoogleMapsScript = () => {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=places`;
            script.async = true;
            document.head.appendChild(script);
            script.onload = () => initializeMap();
        };

        const initializeMap = () => {
            // Initialize the map
            const googleMap = new window.google.maps.Map(mapDiv.current, {
                center: { lat: 40.7128, lng: -84.006 },
                zoom: 4,
                minZoom: 2,
                maxZoom: 20,
                mapTypeId: 'terrain', // Use the terrain map type
                disableDefaultUI: true,
                gestureHandling: 'auto'
            });
            setMap(googleMap);

            // Set up terrain and labels layers
            const terrainLayerInstance = new window.google.maps.ImageMapType({
                getTileUrl: (coord, zoom) => `https://mts1.google.com/vt/lyrs=p&hl=en&x=${coord.x}&y=${coord.y}&z=${zoom}&s=Galileo`,
                tileSize: new window.google.maps.Size(256, 256),
                opacity: terrainLayerOpacity,
                copyright: 'Google Maps',
                refreshInterval: 1
            });

            const labelsLayerInstance = new window.google.maps.ImageMapType({
                getTileUrl: (coord, zoom) => `https://mts1.google.com/vt/lyrs=h&hl=en&x=${coord.x}&y=${coord.y}&z=${zoom}&s=Galileo`,
                tileSize: new window.google.maps.Size(256, 256),
                opacity: labelsLayerOpacity,
                    copyright: 'Google Maps',
            refreshInterval: 1
            });

            googleMap.overlayMapTypes.push(terrainLayerInstance);
            googleMap.overlayMapTypes.push(labelsLayerInstance);

            setTerrainLayer(terrainLayerInstance);
            setLabelsLayer(labelsLayerInstance);

            // Control loading overlay based on map movement
            googleMap.addListener('idle', () => {
                setDataLoading(false);
                fadeInLayers();
            });

            googleMap.addListener('dragstart', () => setDataLoading(true));
            googleMap.addListener('zoom_changed', () => setDataLoading(true));
        };

        loadGoogleMapsScript();

        // Smooth transition to adjust layer opacity on load
        const fadeInLayers = () => {
            setTimeout(() => setTerrainLayerOpacity(0.8), 200);
            setTimeout(() => setLabelsLayerOpacity(1), 400);
        };
    }, [terrainLayerOpacity, labelsLayerOpacity]);

    // Apply opacity to layers based on state
    useEffect(() => {
        if (terrainLayer) terrainLayer.setOpacity(terrainLayerOpacity);
        if (labelsLayer) labelsLayer.setOpacity(labelsLayerOpacity);
    }, [terrainLayerOpacity, labelsLayerOpacity]);

    return (
        <div style={{ height: '100vh', width: '100vw', position: 'relative' }}>
            <div ref={mapDiv} style={{ height: '100%', width: '100%' }} />
            {dataLoading && <div className="loading-overlay">Loading...</div>}
            <style jsx>{`
                .loading-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(255, 255, 255, 0.7);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1;
                    transition: opacity 0.5s ease;
                }
            `}</style>
        </div>
    );
};

export default MyGoogleMap;
