import React, { useEffect, useRef, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import Map from 'https://js.arcgis.com/4.30/@arcgis/core/Map.js';
import MapView from 'https://js.arcgis.com/4.30/@arcgis/core/views/MapView.js';
import GraphicsLayer from 'https://js.arcgis.com/4.30/@arcgis/core/layers/GraphicsLayer.js';
import SketchViewModel from 'https://js.arcgis.com/4.30/@arcgis/core/widgets/Sketch/SketchViewModel.js';
import Graphic from 'https://js.arcgis.com/4.30/@arcgis/core/Graphic.js';
import * as webMercatorUtils from 'https://js.arcgis.com/4.30/@arcgis/core/geometry/support/webMercatorUtils.js';
import WebTileLayer from 'https://js.arcgis.com/4.30/@arcgis/core/layers/WebTileLayer.js';
import Supercluster from 'supercluster';
import debounce from 'lodash.debounce';
import { loadModules } from 'esri-loader';
import GeoJSONLayer from 'https://js.arcgis.com/4.30/@arcgis/core/layers/GeoJSONLayer.js';
import KMLLayer from 'https://js.arcgis.com/4.30/@arcgis/core/layers/KMLLayer.js';
import TileLayer from 'https://js.arcgis.com/4.30/@arcgis/core/layers/TileLayer.js';

import { Bars3Icon, GlobeAmericasIcon } from '@heroicons/react/24/outline';
import Point from 'https://js.arcgis.com/4.30/@arcgis/core/geometry/Point.js';
import JSZip from 'jszip';
import SingleOneMarker from '../CanvasIcons/SingleOneMarker';

import SceneView from 'https://js.arcgis.com/4.30/@arcgis/core/views/SceneView.js';

const SourceMap = ({ mapType, setIsAddLeadFormPopUp, isAddLeadFormPopUp }) => {
  const { postRoute, getRoute } = { postRoute:{}, getRoute:{} } 
  const [isMapCreated, setIsMapCreated] = useState(false);
  const [checkFiles, setCheckFiles] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [view, setView] = useState(null);
  const [leadData, setLeadData] = useState({});
  const [files, setFiles] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const mapDiv = useRef(null);
  const kmlLayersRef = useRef([]);
  const [sketchView, setSketchView] = useState(null);
  const clusterLayer = useRef(null);
  const superclusterRef = useRef(null);
  const [boundingBox, setBoundingBox] = useState({});
  const [mapPointCoordinates, setMapPointCoordinates] = useState({});
  const [sketchLayer, setSketchLayer] = useState(null);
  const [isLeadBarOpen, setIsLeadBarOpen] = useState(false);
  const [isSketching, setIsSketching] = useState(false);
  const [isAddLeadPopup, setIsAddLeadPopup] = useState(false);
  const [isLeadDetailPopUp, setLeadDetailPopUp] = useState(false);
  const [isClusterPopUp, setIsClusterPopUp] = useState(false);
  const [popupData, setPopupData] = useState({ title: '', content: '' });
  const [showOnlyPolygon, setShowOnlyPolyGon] = useState(false);
  const [navigatorLoading, setNavigatorLoading] = useState(false);
  const [currentPolygon, setCurrentPolygGon] = useState({});
  const [clusterBox, setClusterBox] = useState({});
  const labelLayer = useRef(null);
  const [popupPosition, setPopupPosition] = useState({
    left: '0px',
    top: '0px',
  });
  const [isLeadAdded, setIsLeadAdded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOn, setIsSearchOn] = useState(false);

  const [popupCoordinates, setPopupCoordinates] = useState([]);
  const [createdPolyGon, setCreatedPolyGon] = useState(null);
  const satelliteLayerRef = useRef(null);
  const labelLayerRef = useRef(null);
  const grayCanvasLayer = useRef(null);
  const placeLayerRef = useRef(null);
  const [totalTerritories, setTotalTerritories] = useState([]);
  const [isLeadEdit, setIsLeadEdit] = useState(false);
  const [globView, setGlobView] = useState(false);
  const popUpClusterId = useRef(null);
  const [mapPointAddress, setMapPointAddress] = useState({
    street: '',
    house_number: '',
    city: '',
    state: '',
    zip_code: '',
    country: '',
  });
  const [territory, setTerritory] = useState({
    name: '',
    assigned_users: '',
    owner: '',
    boundary_type: '',
    boundary_color: '#F2C94C',
    team_id: '',
  });
 
  const filterItems = [
    // { label: 'Active Records', icon: 'MapPinIcon', isActive: false },
    // { label: 'Closed Records', icon: 'MapPinIcon', isActive: false },
    { label: 'Territories', icon: 'TerritoryIcon', isActive: false },
    // { label: 'Team', icon: 'UserIcon', isActive: false },
    { label: 'Satellite', icon: 'SateliteIcon', isActive: false },
    { label: 'GrayCanvas', icon: 'GlobeAmericasIcon', isActive: false },
    { label: 'KmL', icon: 'KmlIcon', isActive: false },
    // { label: 'GPS Trails', icon: 'GpsTrailIcon', isActive: false },
    // { label: 'Globe View', icon: 'GlobeAltIcon', isActive: false },
  ];
  function hexToRGBA(hex, alpha = 1) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  const [isTerritoryMethod,setIsTerritoryMethod]=useState(false)
  const [filters, setFilters] = useState(filterItems);
  const [clusterSize, setClusterSize] = useState(Number);
  const handlePointClick = (item, addNewlead) => {
    const point = new Point({
      x: item.geometry.coordinates[0],
      y: item.geometry.coordinates[1],
      spatialReference: { wkid: 4326 },
    });
    const screenPoint = view.toScreen(point);
    view.goTo(
      {
        target: new Point({
          longitude: item?.geometry?.coordinates[0],
          latitude: item?.geometry?.coordinates[1],
        }),
        zoom: 17,
      },
      { duration: 500 }
    );
    setPopupData({
      title: 'Lead Details',
      content: `Coordinates: ${item.geometry.coordinates}`,
    });
    setPopupPosition({
      left: `${screenPoint.x}px`,
      top: `${screenPoint.y}px`,
    });
    setPopupCoordinates(item.geometry.coordinates);
    getLeadPropData(item?.id);
    if (addNewlead) {
      setLeadData({});
      setIsAddLeadPopup(true);
      setIsClusterPopUp(false);
      setLeadDetailPopUp(false);
    } else {
      setIsLeadBarOpen(true);

      setLeadDetailPopUp(true);
    }
  };
  useEffect(() => {
    superclusterRef.current = new Supercluster({
      radius: 40,
      maxZoom: 20,
    });
    const features = [];
    superclusterRef.current.load(features);
  }, []);

  const getFiles = async () => {
    const { data } = await getRoute('/canvas/get-map-layers');
    setFiles(data);
    setCheckFiles(data);
  };

  const getLeadPropData = async (leadId, item) => {
    const { data, errors } = await postRoute('/canvas/get-lead-prop', {
      lead_id: leadId,
    });
    if (!errors) {
      setLeadDetailPopUp(true);
      setLeadData(data);
    }
  };

  useEffect(() => {
    getFiles();
  }, []);

  const addClustersToMap = useRef(
    debounce(async (minLat, maxLat, minLon, maxLon, zoomLevel) => {
      if (!superclusterRef.current) return;

      const { data, errors } = await getRoute(
        `/canvas/canvas-leads-search?minLat=${minLat}&maxLat=${maxLat}&minLon=${minLon}&maxLon=${maxLon}&zoomLevel=${zoomLevel}`
      );

      if (!errors) {
        const newCluster = data;
        clusterLayer.current.removeAll();

        if (newCluster?.length > 0) {
          newCluster?.forEach(cluster => {
            const [longitude, latitude] = cluster.geometry.coordinates;
            const isCluster = cluster.properties.cluster;
            let size = 30;
            let pointCount = isCluster ? cluster.properties.point_count : 0;

            if (isCluster) {
              size = Math.min(70, Math.max(30, pointCount * 0.5));
            }

            const pinIconSvgString = ReactDOMServer.renderToStaticMarkup(
              <SingleOneMarker
                fillColor={
                  cluster?.stage_color ? cluster?.stage_color : 'black'
                }
                className="w-6 h-6 text-blue-500 "
              />
            );
            const encodedPinIconSvg = encodeURIComponent(pinIconSvgString);
            const symbol = isCluster
              ? {
                  type: 'simple-marker',
                  style: 'circle',
                  text: cluster.properties.point_count_abbreviated.toString(),
                  label: pointCount.toString(),
                  color:
                    popUpClusterId.current === cluster?.id
                      ? '#1F2836'
                      : '#5789D7',
                  size: `${size}px`,
                  outline: {
                    color: 'white',
                    width: 1.25,
                  },
                  font: {
                    size: '12px',
                    family: 'sans-serif',
                    weight: 'bold',
                  },
                }
              : {
                  type: 'picture-marker',
                  url: 'data:image/svg+xml;charset=UTF-8,' + encodedPinIconSvg,
                  width: '40px',
                  height: '40px',
                };

            const graphic = new Graphic({
              geometry: {
                type: 'point',
                longitude,
                latitude,
              },
              symbol,
              id: cluster?.id,
              text: cluster.properties.point_count || 1,
              cluster: isCluster,
              attributes: cluster.properties,
              coordinates: cluster.geometry.coordinates,
              size: size,
              bounding_box: cluster?.bounding_box,
            });

            clusterLayer.current.add(graphic);
            if (isCluster) {
              const labelGraphic = new Graphic({
                geometry: {
                  type: 'point',
                  longitude,
                  latitude,
                },
                symbol: {
                  type: 'text',
                  color: 'white',
                  haloColor: 'black',
                  haloSize: '1px',
                  text: cluster.properties.point_count_abbreviated.toString(),
                  xoffset: 0,
                  yoffset: 0,
                  font: {
                    size: '12px',
                    family: 'sans-serif',
                    weight: 'bold',
                  },
                },
                cluster_id: cluster?.id,
                id: cluster?.id,
                text: cluster.properties.point_count || 1,
                cluster: isCluster,
                attributes: cluster.properties,
                coordinates: cluster.geometry.coordinates,
                size: size,
                bounding_box: cluster?.bounding_box,
              });
              clusterLayer.current.add(labelGraphic);
            }
          });
        }
      }
    }, 150)
  ).current;

  useEffect(() => {
    if (!mapDiv.current) return;
    const googleTerrainLayer = new WebTileLayer({
      urlTemplate:
        'https://mts1.google.com/vt/lyrs=p&hl=en&x={col}&y={row}&z={level}&s=Galileo',
      copyright: 'Google Maps',
      opacity: 0.8,
    });

    const map = new Map({
      basemap: mapType,
    });
    map.add(googleTerrainLayer);
    const newView = globView
      ? new SceneView({
          container: mapDiv.current, // Your map container
          map: map,
          zoom: 2, // Global zoom level
          center: [-84.006, 40.7128], // Example center, you can adjust as needed
          environment: {
            atmosphere: {
              enable: true, // Enables a realistic atmosphere for the globe
            },
            lighting: {
              directShadowsEnabled: true, // Optionally enable shadows
              ambientOcclusionEnabled: true, // For realistic lighting
            },
          },
          constraints: {
            minZoom: 2,
            maxZoom: 20,
            rotationEnabled: true, // Enable globe rotation
          },
          ui: {
            components: [], // Removes default UI controls (optional)
          },
        })
      : new MapView({
          container: mapDiv.current,
          map: map,
          zoom: 2,
          maxZoom: 20,
          center: [-84.006, 40.7128],
          constraints: {
            minZoom: 2,
            maxZoom: 20,
            rotationEnabled: false,
          },
          ui: {
            components: [], // Removes zoom controls and other default UI elements
          },
        });
    setView(newView);
    const initialSketchLayer = new GraphicsLayer();
    setSketchLayer(initialSketchLayer);

    // const placeNamesLayer = new VectorTileLayer({
    //   url: 'https://cdn.arcgis.com/sharing/rest/content/items/1768e8369a214dfab4e2167d5c5f2454/resources/styles/root.json',
    // });
    // map.add(placeNamesLayer, 1);
    map.add(initialSketchLayer, 2);
    const layer = new GraphicsLayer();
    let lastHoveredGraphic = null;
    let lastHoveredLabelGraphic = null;

    newView.on('pointer-move', event => {
      const hitTestResult = newView.hitTest(event);
      hitTestResult.then(response => {
        if (response.results.length > 0) {
          const graphic = response.results[0].graphic;

          if (lastHoveredGraphic && lastHoveredGraphic !== graphic) {
            if (
              lastHoveredGraphic.symbol &&
              lastHoveredGraphic.symbol.type === 'simple-marker'
            ) {
              lastHoveredGraphic.symbol.color = '#5789D7';
              lastHoveredGraphic.symbol.zIndex = 0;
            }
            if (lastHoveredGraphic.labelSymbol) {
              lastHoveredGraphic.labelSymbol.zIndex = 0;
            }
          }
          if (graphic?.cluster && !graphic?.cluster_id) {
            newView.container.style.cursor = 'pointer';

            const labelGraphic = graphic.layer.graphics.find(
              g => g.cluster_id === graphic?.id
            );

            if (labelGraphic) {
              labelGraphic.symbol.zIndex = 9000;
              graphic.layer.graphics.reorder(
                labelGraphic,
                graphic.layer.graphics.length - 1
              );
              graphic.symbol.zIndex = 8999;
              graphic.symbol.color = '#1F2836';
              graphic.layer.graphics.reorder(
                graphic,
                graphic.layer.graphics.length - 2
              );
            }
            if (!graphic?.cluster_id) {
              lastHoveredGraphic = graphic;
            }
          }
        } else {
          newView.container.style.cursor = '';
          if (lastHoveredGraphic) {
        
            if (lastHoveredGraphic.labelSymbol) {
              lastHoveredGraphic.labelSymbol.zIndex = 0;
            }
            lastHoveredGraphic = null;
          }
        }
      });
    });

    clusterLayer.current = layer;
    newView.watch('center', newCenter => {
      if (newCenter.latitude < -45.0 || newCenter.latitude > 70.0) {
        newView.center = {
          longitude: newCenter.longitude,
          latitude: Math.max(-45.0, Math.min(newCenter.latitude, 70.0)),
        };
      }
    });
    map.add(layer, 5);

    newView.on('click', event => {
      newView.hitTest(event).then(response => {
        const graphic = response.results[0]?.graphic;
        if (!graphic?.cluster) {
          postRoute('canvas/get-address-by-coordinates', {
            latitude: event?.mapPoint?.latitude,
            longitude: event?.mapPoint?.longitude,
          })
            .then(addressResponse => {
              const { data } = addressResponse;
              setMapPointCoordinates({
                latitude: event?.mapPoint?.latitude,
                longitude: event?.mapPoint?.longitude,
              });
              setMapPointAddress({
                street: data?.streetName,
                house_number: data?.streetNumber,
                city: data?.city,
                state: data?.state,
                zip_code: data?.postalCode,
                country: data?.country,
                country_code: data?.countryCode,
              });
            })
            .catch(error => {
              console.error('Error fetching address:', error);
            });
        }
        if (graphic?.cluster) {
          const point = new Point({
            x: graphic?.coordinates[0],
            y: graphic?.coordinates[1],
            spatialReference: { wkid: 4326 },
          });
          const screenPoint = newView.toScreen(point);
          setClusterSize(graphic?.size);

          setPopupPosition({
            left: `${screenPoint.x}px`,
            top: `${screenPoint.y}px`,
          });
          setPopupCoordinates([
            graphic?.coordinates[0],
            graphic?.coordinates[1],
          ]);
          setIsClusterPopUp(true);
          setLeadDetailPopUp(false);
          setIsAddLeadPopup(false);
          setClusterBox(graphic?.bounding_box);
          popUpClusterId.current = graphic?.id;
        } else if (graphic?.text === 1) {
          const splitData = graphic?.id.split('_');
          getLeadPropData(splitData[0]);
          const point = new Point({
            x: graphic?.coordinates[0],
            y: graphic?.coordinates[1],
            spatialReference: { wkid: 4326 },
          });
          const screenPoint = newView.toScreen(point);
          newView.goTo({
            target: new Point({
              longitude: graphic?.coordinates[0],
              latitude: graphic?.coordinates[1],
            }),
          });
          setPopupData({
            title: 'Lead Details',
          });

          setPopupPosition({
            left: `${screenPoint.x}px`,
            top: `${screenPoint.y}px`,
          });
          setPopupCoordinates([
            graphic?.coordinates[0],
            graphic?.coordinates[1],
          ]);
          setIsLeadBarOpen(true);
          setLeadDetailPopUp(true);
          setIsClusterPopUp(false);
          setIsAddLeadPopup(false);
        } else if (
          newView.zoom > 15 &&
          graphic?.origin?.layerId == 'Building'
        ) {
          const point = new Point({
            x: event?.mapPoint?.longitude,
            y: event?.mapPoint?.latitude,
            spatialReference: { wkid: 4326 },
          });
          const screenPoint = newView.toScreen(point);
          setPopupData({
            title: 'Lead Details',
          });
          setPopupPosition({
            left: `${screenPoint.x}px`,
            top: `${screenPoint.y}px`,
          });
          setPopupCoordinates([
            event?.mapPoint?.longitude,
            event?.mapPoint?.latitude,
          ]);
          setIsAddLeadPopup(true);
          setIsClusterPopUp(false);
          setLeadDetailPopUp(false);
        }
      });
    });

    newView.watch('stationary', isStationary => {
      if (isStationary) {
        setDataLoading(false);
      } else {
        setDataLoading(true);
      }
    });
    setView(newView);
    setIsMapCreated(true);

    return () => {
      if (newView) newView.destroy();
    };
  }, [mapType, files, globView]);
  useEffect(() => {
    loadModules([
      'esri/geometry/SpatialReference',
      'esri/geometry/support/webMercatorUtils',
    ])
      .then(([SpatialReference, webMercatorUtils]) => {
        let previousZoom = view.zoom;
        view.watch('extent', async newExtent => {
          const currentZoom = Math.round(view.zoom);
          if (newExtent) {
            const { xmin, ymin, xmax, ymax } = newExtent;
            const extent = {
              xmin: xmin,
              ymin: ymin,
              xmax: xmax,
              ymax: ymax,
              spatialReference: SpatialReference.WebMercator,
            };
            const geoExtent = webMercatorUtils.webMercatorToGeographic(extent);
            const {
              xmin: minLon,
              ymin: minLat,
              xmax: maxLon,
              ymax: maxLat,
            } = geoExtent;
            if (currentZoom !== previousZoom) {
              clusterLayer.current.removeAll();
              setIsClusterPopUp(false);
            }
            setBoundingBox({
              minLat: minLat,
              maxLat: maxLat,
              minLon: minLon,
              maxLon: maxLon,
            });
            addClustersToMap(
              minLat,
              maxLat,
              minLon,
              maxLon,
              currentZoom,
              popUpClusterId
            );

            previousZoom = currentZoom;
          }
        });
      })
      .catch(err => {
        console.error('Error loading ArcGIS modules: ', err);
      });
  }, [mapType, view, popUpClusterId]);

  const drawPolygon = drawing => {
    if (showOnlyPolygon) {
      setShowOnlyPolyGon(false);
    }
    setShowOnlyPolyGon(false);
    setIsSketching(pre => !pre);
    sketchView.create('polygon');
  };
  const drawShowPolyGon = () => {
    if (showOnlyPolygon) {
      setShowOnlyPolyGon(false);
      handleRedraw();
    } else {
      if (!isTerritoryMethod && sketchView) {
        setShowOnlyPolyGon(true);
        setIsSketching(pre => !pre);
        sketchView.create('polygon');
      }
    }
  };

  useEffect(() => {
    if (!sketchLayer) return;
    const isTerritory = filters?.find(
      filter => filter?.label === 'Territories'
    );
    view.when(() => {
      const sketchViewModel = new SketchViewModel({
        view: view,
        layer: sketchLayer,
        updateOnGraphicClick: false,
        polygonSymbol: {
          type: 'simple-fill',
          color: hexToRGBA(territory?.boundary_color, 0.2),
          outline: {
            color: territory?.boundary_color,
            width: 1,
            style: 'solid',
          },
        },
      });
      sketchViewModel.on('create', event => {
        setIsSketching(true);
        if (event.state === 'complete') {
          setIsSketching(false);
          const convertedRings = event.graphic.geometry?.rings.map(ring =>
            ring.map(point => {
              const [x, y] = point;
              const geographicPoint = webMercatorUtils.webMercatorToGeographic({
                x,
                y,
              });
              return [geographicPoint.x, geographicPoint.y];
            })
          );
          const newPolyGon = {
            geometry: { type: 'polygon', rings: convertedRings },
            symbol: {
              type: 'simple-fill',
              color: hexToRGBA(territory?.boundary_color, 0.2),
              outline: {
                color: territory?.boundary_color,
                width: 1,
              },
            },
            polygon_id: 'd',
          };
          const polygonGraphic = new Graphic(newPolyGon);
          sketchLayer.add(polygonGraphic);
          setTerritory(newPolyGon);
        }
      });

      sketchViewModel.on('update', event => {
        setIsSketching(true);
        if (event.state === 'complete') {
          const updatedGraphic = event.graphics[0];
          const updatedRings = updatedGraphic.geometry?.rings.map(ring =>
            ring.map(point => {
              const [x, y] = point;
              const geographicPoint = webMercatorUtils.webMercatorToGeographic({
                x,
                y,
              });
              return [geographicPoint.x, geographicPoint.y];
            })
          );
          const updatedPolygon = {
            geometry: { type: 'polygon', rings: updatedRings },
            symbol: {
              type: 'simple-fill',
              color: hexToRGBA(territory?.boundary_color, 0.2),
              outline: {
                color: territory?.boundary_color,
                width: 1,
              },
            },
            polygon_id: updatedGraphic?.polygon_id,
          };
          sketchLayer.removeAll();
          const polygonGraphic = new Graphic(updatedPolygon);
          setTerritory(updatedPolygon);
          sketchLayer.add(polygonGraphic);
        }
      });
      setSketchView(sketchViewModel);
    });
    if (!isTerritoryMethod) {
      if (isTerritory?.isActive) {
        if (!isTerritoryMethod) {
          totalTerritories.forEach(newTerr => {
            const polygonGraphic = new Graphic({
              geometry: { type: 'polygon', rings: newTerr?.geometry.rings },
              symbol: newTerr.symbol,
            });
            sketchLayer.add(polygonGraphic);
          });
        } else {
          handleToggle(0);
        }
      }
    }
  }, [
    totalTerritories,
    sketchLayer,
    filters,
    view,
    territory,
    setTerritory,
    isTerritoryMethod,
  ]);

  useEffect(() => {
    const isSatellite = filters?.find(filter => filter?.label === 'Satellite');
    const isKml = filters?.find(filter => filter?.label === 'KmL');
    const isGrayCanvas = filters?.find(
      filter => filter?.label === 'GrayCanvas'
    );
    if (isKml?.isActive) {
      files.forEach(async file => {
        let layerToAdd;

        if (file?.file_extension === 'geojson') {
          layerToAdd = new GeoJSONLayer({
            url: file.file_path,
            opacity: 0.6,
            outFields: ['*'],
          });
        } else if (file?.file_extension === 'kmz') {
          const response = await fetch(file.file_path);
          const kmzBlob = await response.blob();
          const zip = await JSZip.loadAsync(kmzBlob);
          let kmlFile = null;

          zip.forEach((relativePath, fileInZip) => {
            if (relativePath.endsWith('.kml')) {
              kmlFile = fileInZip;
            }
          });

          if (kmlFile) {
            const kmlText = await kmlFile.async('text');
            const kmlBlob = new Blob([kmlText], {
              type: 'application/vnd.google-earth.kml+xml',
            });
            layerToAdd = new KMLLayer({
              url: URL.createObjectURL(kmlBlob),
            });
          }
        } else if (file?.file_extension === 'kml') {
          layerToAdd = new KMLLayer({
            url: file.file_path,
          });
        }

        if (layerToAdd) {
          const order = file.order || 0;
          view?.map.add(layerToAdd, order);
          kmlLayersRef.current.push(layerToAdd); // Store reference to the added layer
        }
      });
    } else {
      // Remove all KML layers when KmL is inactive
      kmlLayersRef.current.forEach(layer => {
        view?.map.remove(layer);
      });
      kmlLayersRef.current = []; // Clear the reference list
    }
    if (isSatellite) {
      if (isSatellite.isActive) {
        if (!satelliteLayerRef.current) {
          const googleSatelliteLayer = new WebTileLayer({
            urlTemplate:
              'https://mts1.google.com/vt/lyrs=s&hl=en&x={col}&y={row}&z={level}&s=Galileo',
            copyright: 'Google Maps',
          });
          const googleLabelsLayer = new WebTileLayer({
            urlTemplate:
              'https://mts1.google.com/vt/lyrs=h&hl=en&x={col}&y={row}&z={level}&s=Galileo',
            opacity: 1, // Set opacity to full
            copyright: 'Google Maps',
          });
          const satelliteLayer = new TileLayer({
            url: 'https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer',
          });
          view.map.add(googleSatelliteLayer, view?.map?.layers?.length - 2);
          view.map.add(googleLabelsLayer, view?.map?.layers?.length - 2);
          satelliteLayerRef.current = googleSatelliteLayer;
          labelLayerRef.current = googleLabelsLayer;
        }
        // if (!labelsLayerRef.current) {
        //   const labelsLayer = new TileLayer({
        //     url: 'https://services.arcgisonline.com/arcgis/rest/services/Reference/World_Reference_Overlay/MapServer',
        //   });
        //   view.map.add(labelsLayer, view?.map?.layers?.length - 2);
        //   labelsLayerRef.current = labelsLayer;
        // }
      } else {
        if (satelliteLayerRef.current) {
          view.map.remove(satelliteLayerRef.current);
          view.map.remove(labelLayerRef.current);
          satelliteLayerRef.current = null;
          labelLayerRef.current = null;
        }
        // if (labelsLayerRef.current) {
        //   view.map.remove(labelsLayerRef.current);
        //   labelsLayerRef.current = null;
        // }
      }
    }

    if (isGrayCanvas) {
      if (isGrayCanvas.isActive) {
        if (!grayCanvasLayer.current) {
          const lightGrayCanvasLayer = new TileLayer({
            url: 'https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Light_Gray_Base/MapServer',
          });
          view.map.add(lightGrayCanvasLayer, view?.map?.layers?.length - 2);

          grayCanvasLayer.current = lightGrayCanvasLayer;
        }
      } else {
        if (grayCanvasLayer.current) {
          view.map.remove(grayCanvasLayer.current);
          grayCanvasLayer.current = null;
        }
      }
    }
  }, [filters, view]);

  const handleViewChange = () => {
    if (isLeadDetailPopUp || isAddLeadPopup || isClusterPopUp) {
      const point = new Point({
        x: popupCoordinates[0],
        y: popupCoordinates[1],
        spatialReference: { wkid: 4326 },
      });
      const screenPoint = view.toScreen(point);
      setPopupPosition({
        left: `${screenPoint.x}px`,
        top: `${screenPoint.y}px`,
      });
    }
  };

  useEffect(() => {
    if (!view) return;
    view.watch('extent', handleViewChange);
  }, [
    view,
    isLeadDetailPopUp,
    popupCoordinates,
    isAddLeadPopup,
    isClusterPopUp,
  ]);

  const handleRedraw = e => {
    if (sketchLayer) {
      sketchLayer.removeAll();
    }
  };

  const handleToggle = index => {
    let preFilters = _.cloneDeep(filters);
    preFilters = preFilters.map((filter, i) => {
      if (index === i) {
        if (index === 0) {
          if (!isTerritoryMethod) {
            sketchLayer.removeAll();
            return { ...filter, isActive: !filter.isActive };
          } else {
            return filter;
          }
        } else {
          if (index === 8) {
            setGlobView(!filter.isActive);
          }
          return { ...filter, isActive: !filter.isActive };
        }
      } else {
        return filter;
      }
    });
    setFilters(preFilters);
  };

  const addTerritory = territory => {
    sketchLayer.removeAll();
    setTerritory(territory);
    const newPolyGon = {
      ...territory,
      geometry: territory?.geometry,
      symbol: {
        type: 'simple-fill',
        color: hexToRGBA(territory?.boundary_color, 0.2),
        outline: {
          color: territory?.boundary_color,
          width: 1,
        },
      },
    };
    const polygonGraphic = new Graphic(newPolyGon);
    setCurrentPolygGon(polygonGraphic);
    sketchLayer.add(polygonGraphic);
  };
  useEffect(() => {
    setTimeout(() => {
      if (isLeadAdded) {
        setIsLeadAdded(false);
      }
    }, 200);
  }, [isLeadAdded]);

  useEffect(() => {
    if (currentPolygon?.geometry) {
      const polygon = currentPolygon?.geometry;
      view
        .goTo(
          {
            target: polygon?.extent,
          },
          {
            duration: 500,
            easing: 'ease-in-out',
          }
        )
        .catch(err => {
          console.error('Error during zoom:', err);
        });
    }
  }, [currentPolygon]);

  const handleEditPolygon = () => {
    if (!sketchView || !sketchLayer) return;

    const graphicToEdit = sketchLayer.graphics.items[0];
    if (graphicToEdit) {
      sketchView.update([graphicToEdit], {
        tool: 'transform',
        enableRotation: true,
        enableScaling: true,
        enableZ: true,
        enableMoveAllGraphics: true,
        reshapeOptions: {
          edgeOperation: 'split',
          shapeOperation: 'move',
          vertexOperation: 'move',
        },
        snappingOptions: {
          enabled: true,
        },
        highlightOptions: {
          enabled: true,
        },
        toggleToolOnClick: true,
      });
    }
  };

  return (
    <div className="flex w-full h-full ">
      {/* {isLeadDetailPopUp ? (
        <LeadDetailPopUp
          leadData={leadData}
          setIsAddLeadFormPopUp={setIsAddLeadFormPopUp}
          title={popupData.title}
          content={popupData.content}
          onClose={e => {
            e?.preventDefault();
            setLeadDetailPopUp(false);
          }}
          style={{ position: 'absolute', ...popupPosition }}
        />
      ) : isAddLeadPopup ? (
        <AddLeadPopUp
          leadData={leadData}
          setIsAddLeadFormPopUp={setIsAddLeadFormPopUp}
          title={popupData.title}
          content={popupData.content}
          onClose={e => {
            e?.preventDefault();
            setLeadData({});
            setIsAddLeadPopup(false);
            if (view && view.graphics) {
              view.graphics.removeAll();
            }
          }}
          style={{ position: 'absolute', ...popupPosition }}
        />
      ) : isClusterPopUp ? (
        <ClusterPopup
          clusterBox={clusterBox}
          view={view}
          clusterSize={clusterSize}
          popupCoordinates={popupCoordinates}
          setIsClusterPopUp={setIsClusterPopUp}
          onClose={() => setIsClusterPopUp(false)}
          style={{ position: 'absolute', ...popupPosition }}
        />
      ) : null} */}

      {/* <CanvasFilters
        showOnlyPolygon={showOnlyPolygon}
        handleRedraw={handleRedraw}
        navigatorLoading={navigatorLoading}
        setNavigatorLoading={setNavigatorLoading}
        handlePointClick={handlePointClick}
        setFilters={setFilters}
        view={view}
        drawPolygon={drawShowPolyGon}
        filters={filters}
        isSketching={isSketching}
        handleToggle={handleToggle}
      /> */}
      {/* <LegendBar
        legendDetails={legendDetails}
        boundingCondition={boundingBox}
      /> */}
      {/* <TerritoriesSearch polyGons={territory?.geometry?.rings} /> */}
      {!isLeadBarOpen && !isSidebarOpen && (
        <div
          onClick={() => {
            if (!dataLoading) {
              setIsSidebarOpen(pre => !pre);
            }
          }}
          className={`absolute right-4  top-4 z-50 cursor-pointer rounded-full,
           ${!dataLoading && 'bg-white p-2' } `}
        >
          {!dataLoading ? (
            <Bars3Icon className="w-6 h-6 text-latisGray-900 hover:text-latisSecondary-900" />
          ) : (
            <div className="w-10 h-10 border-4 border-blue-400 rounded-full animate-spin border-t-transparent"></div>
          )}
        </div>
      )}

      <div ref={mapDiv} className="rounded-l-lg grow" />
{/* 
      <AlgoliaSearch
        setSearchQuery={setSearchQuery}
        isSearchOn={isSearchOn}
        setIsSearchOn={setIsSearchOn}
        dataLoading={dataLoading}
        isLeadAdded={isLeadAdded}
        setIsLeadAdded={setIsLeadAdded}
        boundingBox={boundingBox}
      >
        {isAddLeadFormPopUp ? (
          <LeadForm
            setIsLeadAdded={setIsLeadAdded}
            setLeadData={setLeadData}
            view={view}
            isAddLeadFormPopUp={isAddLeadFormPopUp}
            setIsAddLeadFormPopUp={setIsAddLeadFormPopUp}
            mapPointCoordinates={mapPointCoordinates}
            mapPointAddress={mapPointAddress}
            leadData={leadData?.lead}
            isLeadEdit={isLeadEdit}
            setIsLeadEdit={setIsLeadEdit}
          />
        ) : isLeadBarOpen ? (
          <LeadBar
            setLeadData={setLeadData}
            setIsLeadEdit={setIsLeadEdit}
            setIsAddLeadFormPopUp={setIsAddLeadFormPopUp}
            setMapPointAddress={setMapPointAddress}
            leadData={leadData}
            isLeadBarOpen={isLeadBarOpen}
            setIsLeadBarOpen={setIsLeadBarOpen}
            handlePointClick={handlePointClick}
          />
        ) : (
          <SideBar
            handleEditPolygon={handleEditPolygon}
            searchQuery={searchQuery}
            isSearchOn={isSearchOn}
            setIsTerritoryMethod={setIsTerritoryMethod}
            isTerritoryMethod={isTerritoryMethod}
            legendDetails={legendDetails}
            setLegendDetails={setLegendDetails}
            handleRedraw={handleRedraw}
            setCreatedPolyGon={setCreatedPolyGon}
            createdPolyGon={createdPolyGon}
            drawPolygon={drawPolygon}
            territory={territory}
            setTerritory={setTerritory}
            sketchLayer={sketchLayer}
            addTerritory={addTerritory}
            handlePointClick={handlePointClick}
            boundingCondition={boundingBox}
            isAddLeadFormPopUp={isAddLeadFormPopUp}
            setIsAddLeadFormPopUp={setIsAddLeadFormPopUp}
            setLeadData={setLeadData}
            view={view}
            dataLoading={dataLoading}
            leadData={leadData}
            getFiles={getFiles}
            files={files}
            setFiles={setFiles}
            isPopUpOpen={isSidebarOpen}
            setIsPopUpOpen={setIsSidebarOpen}
            checkFiles={checkFiles}
            setCheckFiles={setCheckFiles}
            mapPointAddress={mapPointAddress}
            mapPointCoordinates={mapPointCoordinates}
          />
        )}
      </AlgoliaSearch> */}
    </div>
  );
};

export default SourceMap;
