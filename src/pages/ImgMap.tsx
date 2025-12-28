/* eslint-disable */
// * react
import { useEffect, useState, useContext } from "react";
import { Box } from "@mui/material";

// * models
import { Coords } from "models/Coords";

// * components
import AddMarkerModal from "components/modals/AddMarker";

// * map related
import Feature from "ol/Feature.js";
import Map from "ol/Map";
import XYZ from "ol/source/XYZ";
import Point from "ol/geom/Point.js";
import View from "ol/View.js";
import { transform } from "ol/proj";
import { Cluster, Vector as VectorSource } from "ol/source.js";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer.js";
import { fromLonLat } from "ol/proj";

// * styles
import { Circle as CircleStyle, Fill, Stroke, Style, Text } from "ol/style.js";

import { useGetMarkers } from "hooks/api/markers/useGetMarkers";

import { AppContext } from "AppContext";

export default function ImgMap() {
  const CLUSTER_DISTANCE = 50;
  const CLUSTER_MIN_DISTANCE = 50;
  // Set decimal precision for coordinates
  // ? https://en.wikipedia.org/wiki/Decimal_degrees
  const COORDS_DECIMAL_PRECISION = 6;

  // const [markers, setMarkers] = useState<Marker[] | undefined>(undefined);
  const [newMarkerCoords, setNewMarkerCoords] = useState<Coords>();
  const [openDialogWindow, setOpenDialogWindow] = useState(false);
  const { getMarkers, markers } = useGetMarkers();
  const { tokenValue } = useContext(AppContext);

  const mapping: any = {};
  const convertCoordsToString = (latitude: number, longitude: number) => {
    return `${parseFloat(String(latitude)).toFixed(6)}, ${parseFloat(String(longitude)).toFixed(6)}`;
  };

  const prepMapData = () => {
    const createPoint = (latitude: number, longtitude: number) => {
      let p = new Point(fromLonLat([longtitude, latitude]));
      return p;
    };

    let features: any = [];
    markers?.forEach((marker) => {
      features.push(
        new Feature({
          geometry: createPoint(marker.coords.latitude, marker.coords.longitude),
        }),
      );
      mapping[convertCoordsToString(marker.coords.latitude, marker.coords.longitude)] = marker.url;
    });

    // new layer with points on top?
    const source = new VectorSource({
      features: features,
    });

    const clusterSource = new Cluster({
      distance: CLUSTER_DISTANCE,
      minDistance: CLUSTER_MIN_DISTANCE,
      source: source,
    });

    // setup cluster
    const styleCache: any = {};
    const clusters = new VectorLayer({
      source: clusterSource,
      style: function (feature) {
        const size = feature.get("features").length;
        let style = styleCache[size];
        if (!style) {
          style = new Style({
            image: new CircleStyle({
              radius: 10,
              stroke: new Stroke({
                color: "#fff",
              }),
              fill: new Fill({
                color: "#3399CC",
              }),
            }),
            text: new Text({
              text: size.toString(),
              fill: new Fill({
                color: "#fff",
              }),
            }),
          });
          styleCache[size] = style;
        }
        return style;
      },
    });

    const raster = new TileLayer({
      source: new XYZ({
        url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
      }),
    });
    return [raster, clusters];
  };

  const getUrlFromMapping = (location: any) => {
    // location [longititude, latitude]
    return mapping[
      convertCoordsToString(
        location[1].toFixed(COORDS_DECIMAL_PRECISION),
        location[0].toFixed(COORDS_DECIMAL_PRECISION),
      )
    ];
  };

  const setupMap = () => {
    let layers = prepMapData();
    let mainMap = new Map({
      target: "mapContent",
      layers: layers,
      view: new View({
        center: [0, 0],
        zoom: 2,
      }),
    });
    // https://stackoverflow.com/questions/17546953/cant-access-object-property-even-though-it-shows-up-in-a-console-log
    // https://stackoverflow.com/questions/26967638/convert-point-to-lat-lon
    mainMap.on("click", function (event) {
      mainMap.forEachFeatureAtPixel(event.pixel, function (feature, layer) {
        let loc = JSON.parse(JSON.stringify(feature.getGeometry())).flatCoordinates;
        let loc_plus = transform(loc, "EPSG:3857", "EPSG:4326");
        let url = getUrlFromMapping(loc_plus);
        window.location.href = url; // navigate user to the specific page (full url)
      });
    });

    // * right click event
    mainMap.getViewport().addEventListener("contextmenu", function (event) {
      event.preventDefault();
      let coords = transform(mainMap.getEventCoordinate(event), "EPSG:3857", "EPSG:4326");
      console.log(coords);
      setNewMarkerCoords(
        new Coords({
          longitude: Number(coords[0].toFixed(COORDS_DECIMAL_PRECISION)),
          latitude: Number(coords[1].toFixed(COORDS_DECIMAL_PRECISION)),
        }),
      );
      handleOpenDialogWindow();
    });
  };

  const handleOpenDialogWindow = () => {
    setOpenDialogWindow(true);
  };

  useEffect(() => {
    getMarkers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (markers) setupMap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markers]);

  return (
    <>
      <Box
        // TODO fix map height
        sx={{
          width: "100%",
          height: "85vh",
        }}
        id="mapContent"
      />
      {/* TODO uncomment after fixing modal */}
      {/* {tokenValue && (
        <AddMarkerModal
          openDialogWindow={openDialogWindow}
          setOpenDialogWindow={setOpenDialogWindow}
          coords={newMarkerCoords}
        />
      )} */}
    </>
  );
}
