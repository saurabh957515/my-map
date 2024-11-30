import Point from '@arcgis/core/geometry/Point';
import VectorTileLayer from '@arcgis/core/layers/VectorTileLayer';
import MapView from '@arcgis/core/views/MapView';
import SceneView from '@arcgis/core/views/SceneView';
import _ from 'lodash';

export const handleToggle = (
  index,
  setFilters = () => {},
  filters = [],
  sketchLayer,
  setGlobView = () => {},
  isTerritoryMethod = Boolean
) => {
  const { settingBarShow, setSettingBarShow, deleteInput } =
    useContext(AppContext);
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

export function hexToRGBA(hex, alpha = 1) {
  const r = parseInt(hex?.slice(1, 3), 16);
  const g = parseInt(hex?.slice(3, 5), 16);
  const b = parseInt(hex?.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
export const googleTerrainLayerUrl =
  'https://mts1.google.com/vt/lyrs=p&hl=en&x={col}&y={row}&z={level}&s=Galileo';
export const placeNamesLayer = new VectorTileLayer({
  url: 'https://cdn.arcgis.com/sharing/rest/content/items/1768e8369a214dfab4e2167d5c5f2454/resources/styles/root.json',
});
export const googleTerrainLayerProps = {
  urlTemplate:
    'https://mts1.google.com/vt/lyrs=p&hl=en&x={col}&y={row}&z={level}&s=Galileo',
  copyright: 'Google Maps',
  opacity: 0.8,
};

export const globViewProps = {
  zoom: 3,
  center: [-84.006, 40.7128],
  environment: {
    atmosphere: {
      enable: true,
    },
    lighting: {
      directShadowsEnabled: true,
      ambientOcclusionEnabled: true,
    },
  },
  constraints: {
    minZoom: 3,
    maxZoom: 20,
    rotationEnabled: true,
  },
  ui: {
    components: [],
  },
};
export const mapViewProps = {
  zoom: 3,
  maxZoom: 20,
  center: [-84.006, 40.7128],
  constraints: {
    minZoom: 3,
    maxZoom: 20,
    rotationEnabled: false,
  },
  ui: {
    components: [],
  },
};
export const getView = (globView, mapDiv, map) =>
  globView
    ? new SceneView({
        container: mapDiv.current,
        map: map,
        ...globViewProps,
      })
    : new MapView({
        container: mapDiv.current,
        map: map,
        ...mapViewProps,
      });

export const onPointerMoveEvent = (newView, lastHoveredGraphic) => {
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
};
export const onMouseClickEvent = (
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
) => {
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
        setPopupCoordinates([graphic?.coordinates[0], graphic?.coordinates[1]]);
        setIsClusterPopUp(true);
        setLeadDetailPopUp(false);
        setIsAddLeadPopup(false);
        setClusterBox(graphic?.bounding_box);
        popUpClusterId.current = graphic?.id;
      } else if (graphic?.text === 1) {
        getLeadPropData(graphic?.attributes?.id);
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
        setPopupCoordinates([graphic?.coordinates[0], graphic?.coordinates[1]]);
        setIsLeadBarOpen(true);
        setLeadDetailPopUp(true);
        setIsClusterPopUp(false);
        setIsAddLeadPopup(false);
      } else if (newView.zoom > 15 && graphic?.origin?.layerId == 'Building') {
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
};
