import React, { useEffect, useRef, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView.js';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer.js';
import SketchViewModel from '@arcgis/core/widgets/Sketch/SketchViewModel.js';
import Graphic from '@arcgis/core/Graphic.js';
import * as webMercatorUtils from '@arcgis/core/geometry/support/webMercatorUtils.js';
import WebTileLayer from '@arcgis/core/layers/WebTileLayer.js';
import Supercluster from 'supercluster';
import debounce from 'lodash.debounce';
import { loadModules } from 'esri-loader';
// import SideBar from './SideBar';
import GeoJSONLayer from '@arcgis/core/layers/GeoJSONLayer.js';
import KMLLayer from '@arcgis/core/layers/KMLLayer.js';
import TileLayer from '@arcgis/core/layers/TileLayer.js';
import VectorTileLayer from '@arcgis/core/layers/VectorTileLayer.js';
import ElevationLayer from '@arcgis/core/layers/ElevationLayer.js';
import MapImageLayer from '@arcgis/core/layers/MapImageLayer.js';
import { Bars3Icon, GlobeAmericasIcon } from '@heroicons/react/24/outline';
import Point from '@arcgis/core/geometry/Point.js';
import JSZip from 'jszip';
// import useApi from '@/hooks/useApi';
import SingleOneMarker from '../CanvasIcons/SingleOneMarker';
// import LeadBar from '../LeadBar/LeadBar';
// import LeadForm from './LeadForm';
// import uuidv4, { classNames } from '@/Providers/helpers';
// import LeadDetailPopUp from '../CanvasPopup/LeadDetailPopUp';
// import AddLeadPopUp from '../CanvasPopup/AddLeadPopUp';
// import CanvasFilters from './CanvasFilters';
// import ClusterPopup from '../CanvasPopup/ClusterPopup';
import './canvas.css';
// import { usePage } from '@inertiajs/react';
// import LegendBar from './LegendBar';
// import Basemap from '@arcgis/core/Basemap.js';
// import SceneView from '@arcgis/core/views/SceneView.js';
// import AlgoliaSearch from './AlgoliaSearch';
// import TerritoriesSearch from './TerritoriesSearch';
import WebMap from '@arcgis/core/WebMap.js';
import WebScene from '@arcgis/core/WebScene.js';
import * as reactiveUtils from '@arcgis/core/core/reactiveUtils.js';
// import AppContext from '@/helpers/CreateContext/CreateContext';
import {
  googleTerrainLayerUrl,
  hexToRGBA,
  mapViewProps,
  globViewProps,
  googleTerrainLayerProps,
  getView,
  onPointerMoveEvent,
  onMouseClickEvent,
} from './MapCreators/Maphelper';
import Basemap from '@arcgis/core/Basemap';
const defaultValue = '';

const AppContext = React.createContext(defaultValue);
function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}
function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}
const SourceMap = ({ mapType, setIsAddLeadFormPopUp, isAddLeadFormPopUp }) => {
  const filterItems = [
    // { label: 'Active Records', icon: 'MapPinIcon', isActive: false },
    // { label: 'Closed Records', icon: 'MapPinIcon', isActive: false },
    { label: 'Territories', icon: 'TerritoryIcon', isActive: false },
    // { label: 'Team', icon: 'UserIcon', isActive: false },
    { label: 'Satellite', icon: 'SateliteIcon', isActive: false },
    { label: 'GrayCanvas', icon: 'GlobeAmericasIcon', isActive: false },
    { label: 'KmL', icon: 'KmlIcon', isActive: false },
    // { label: 'GPS Trails', icon: 'GpsTrailIcon', isActive: false },
    { label: 'Globe View', icon: 'GlobeAltIcon', isActive: false },
  ];
  const { territories } = {
    territories: {}
  };
  const { postRoute, getRoute } = {
    postRoute: () => { }, getRoute: () => { }
  };
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
  const [legendDetails, setLegendDetails] = useState({});
  const [isTerritoryMethod, setIsTerritoryMethod] = useState(null);
  const [filters, setFilters] = useState(filterItems);
  const [clusterSize, setClusterSize] = useState(Number);
  useEffect(() => {
    setTotalTerritories(territories);
  }, []);

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
        zoom: 18,
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
    // const { data } = await getRoute('/canvas/get-map-layers');
    // setFiles(data);
    // setCheckFiles(data);
  };

  const getLeadPropData = async (leadId, item) => {
    // const { data, errors } = await postRoute('/canvas/get-lead-prop', {
    //   lead_id: leadId,
    // });
    // if (!errors) {
    //   setLeadDetailPopUp(true);
    //   setLeadData(data);
    // }
  };

  useEffect(() => {
    getFiles();
  }, []);

  // const addClustersToMap = useRef(
  //   debounce(async (minLat, maxLat, minLon, maxLon, zoomLevel) => {
  //     if (!superclusterRef.current) return;

  //     // const { data, errors } = await getRoute(
  //     //   `/canvas/canvas-leads-search?minLat=${minLat}&maxLat=${maxLat}&minLon=${minLon}&maxLon=${maxLon}&zoomLevel=${zoomLevel}`
  //     // );
  //     if (!errors) {
  //       const newCluster = data;
  //       clusterLayer.current.removeAll();

  //       if (newCluster?.length > 0) {
  //         newCluster?.forEach(cluster => {
  //           const [longitude, latitude] = cluster.geometry.coordinates;
  //           const isCluster = cluster.properties.cluster;
  //           let size = 30;
  //           let pointCount = isCluster ? cluster.properties.point_count : 0;

  //           if (isCluster) {
  //             size = Math.min(70, Math.max(30, pointCount * 0.5));
  //           }

  //           const pinIconSvgString = ReactDOMServer.renderToStaticMarkup(
  //             <SingleOneMarker
  //               fillColor={
  //                 cluster?.stage_color ? cluster?.stage_color : 'black'
  //               }
  //               className="w-6 h-6 text-blue-500 "
  //             />
  //           );
  //           const encodedPinIconSvg = encodeURIComponent(pinIconSvgString);
  //           const symbol = isCluster
  //             ? {
  //               type: 'simple-marker',
  //               style: 'circle',
  //               text: cluster.properties.point_count_abbreviated.toString(),
  //               label: pointCount.toString(),
  //               color:
  //                 popUpClusterId.current === cluster?.id
  //                   ? '#1F2836'
  //                   : '#5789D7',
  //               size: `${size}px`,
  //               outline: {
  //                 color: 'white',
  //                 width: 1.25,
  //               },
  //               font: {
  //                 size: '12px',
  //                 family: 'sans-serif',
  //                 weight: 'bold',
  //               },
  //             }
  //             : {
  //               type: 'picture-marker',
  //               url: 'data:image/svg+xml;charset=UTF-8,' + encodedPinIconSvg,
  //               width: '40px',
  //               height: '40px',
  //             };

  //           const graphic = new Graphic({
  //             geometry: {
  //               type: 'point',
  //               longitude,
  //               latitude,
  //             },
  //             symbol,
  //             id: cluster?.id,
  //             text: cluster.properties.point_count || 1,
  //             cluster: isCluster,
  //             attributes: cluster.properties,
  //             coordinates: cluster.geometry.coordinates,
  //             size: size,
  //             bounding_box: cluster?.bounding_box,
  //           });

  //           clusterLayer.current.add(graphic);
  //           if (isCluster) {
  //             const labelGraphic = new Graphic({
  //               geometry: {
  //                 type: 'point',
  //                 longitude,
  //                 latitude,
  //               },
  //               symbol: {
  //                 type: 'text',
  //                 color: 'white',
  //                 haloColor: 'black',
  //                 haloSize: '1px',
  //                 text: cluster.properties.point_count_abbreviated.toString(),
  //                 xoffset: 0,
  //                 yoffset: 0,
  //                 font: {
  //                   size: '12px',
  //                   family: 'sans-serif',
  //                   weight: 'bold',
  //                 },
  //               },
  //               cluster_id: cluster?.id,
  //               id: cluster?.id,
  //               text: cluster.properties.point_count || 1,
  //               cluster: isCluster,
  //               attributes: cluster.properties,
  //               coordinates: cluster.geometry.coordinates,
  //               size: size,
  //               bounding_box: cluster?.bounding_box,
  //             });
  //             clusterLayer.current.add(labelGraphic);
  //           }
  //         });
  //       }
  //     }
  //   }, 150)
  // ).current;

  useEffect(() => {
    if (!mapDiv.current) return;
    const googleTerrainLayer = new WebTileLayer(googleTerrainLayerProps);
    const map = new Map({Basemap:mapType});
    console.log(map)
    // map.add(googleTerrainLayer);
    const newView = getView(globView, mapDiv, map);
    setView(newView);
    reactiveUtils.watch(
      () => newView.updating,
      updating => {
        if (updating) {
          setDataLoading(true);
        } else {
          setDataLoading(false);
        }
      }
    );
    const initialSketchLayer = new GraphicsLayer();
    setSketchLayer(initialSketchLayer);
    map.add(initialSketchLayer, 2);
    const layer = new GraphicsLayer();
    let lastHoveredGraphic = null;
    onPointerMoveEvent(newView, lastHoveredGraphic);
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
    onMouseClickEvent(
      newView,
      postRoute,
      setMapPointCoordinates,
      setMapPointAddress,
      setClusterSize,
      setPopupPosition,
      setPopupCoordinates,
      setIsClusterPopUp,
      setLeadDetailPopUp,
      setClusterBox,
      popUpClusterId
    );

    newView.watch('stationary', isStationary => {
      if (!isStationary) {
        setDataLoading(true);
      }
    });
    setView(newView);
    setIsMapCreated(true);
    return () => {
      if (newView) newView.destroy();
    };
  }, [mapType, files, globView]);

  // useEffect(() => {
  //   loadModules([
  //     'esri/geometry/SpatialReference',
  //     'esri/geometry/support/webMercatorUtils',
  //   ])
  //     .then(([SpatialReference, webMercatorUtils]) => {
  //       let previousZoom = view.zoom;
  //       view.watch('extent', async newExtent => {
  //         const currentZoom = Math.round(view.zoom);
  //         if (newExtent) {
  //           const { xmin, ymin, xmax, ymax } = newExtent;

  //           const extent = {
  //             xmin: xmin,
  //             ymin: ymin,
  //             xmax: xmax,
  //             ymax: ymax,
  //             spatialReference: SpatialReference.WebMercator,
  //           };

  //           const geoExtent = webMercatorUtils.webMercatorToGeographic(extent);
  //           let {
  //             xmin: minLon,
  //             ymin: minLat,
  //             xmax: maxLon,
  //             ymax: maxLat,
  //           } = geoExtent;
  //           if (currentZoom !== previousZoom) {
  //             clusterLayer.current.removeAll();
  //             setIsClusterPopUp(false);
  //           }
  //           setBoundingBox({
  //             minLat: minLat,
  //             maxLat: maxLat,
  //             minLon: minLon,
  //             maxLon: maxLon,
  //           });
  //           // addClustersToMap(
  //           //   minLat,
  //           //   maxLat,
  //           //   minLon,
  //           //   maxLon,
  //           //   currentZoom,
  //           //   popUpClusterId
  //           // );

  //           previousZoom = currentZoom;
  //         }
  //       });
  //     })
  //     .catch(err => {
  //       console.error('Error loading ArcGIS modules: ', err);
  //     });
  // }, [mapType, view, popUpClusterId]);

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
            polygon_id: uuidv4(),
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
              geometry: { type: 'polygon', rings: newTerr?.geometry?.rings },
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
      kmlLayersRef.current.forEach(layer => {
        view?.map.remove(layer);
      });
      kmlLayersRef.current = [];
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

  return (
    <div className="flex w-[90vw] h-[90vh] bg-blue-500">
      {/* <AppContext.Provider
        value={{
          setFilters,
          filters,
          sketchLayer,
          setGlobView,
          isTerritoryMethod,
        }}
      > */}
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
        {/* {!isLeadBarOpen && !isSidebarOpen && (
          <div
            onClick={() => {
              if (!dataLoading) {
                setIsSidebarOpen(pre => !pre);
              }
            }}
            className={classNames(
              'absolute right-3  top-4 z-50 cursor-pointer rounded-full',
              !dataLoading && 'bg-white p-2'
            )}
          >
            {!dataLoading ? (
              <Bars3Icon className="w-6 h-6 text-latisGray-900 hover:text-latisSecondary-900" />
            ) : (
              <div className="w-10 h-10 border-4 border-blue-400 rounded-full animate-spin border-t-transparent"></div>
            )}
          </div>
        )} */}

        {/* <div ref={mapDiv} className="rounded-l-lg grow h-[90vh] w-[100vw]" /> */}

        {/* <AlgoliaSearch
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
              sketchView={sketchView}
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
      {/* </AppContext.Provider> */}
    </div>
  );
};

export default SourceMap;
