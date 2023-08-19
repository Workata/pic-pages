// * react
import React, { useEffect, useState, useContext } from 'react'
import {
  Box,
    Typography

} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";


// map related
import Feature from 'ol/Feature.js';
import Map from 'ol/Map';
import XYZ from 'ol/source/XYZ';
import Point from 'ol/geom/Point.js';
import View from 'ol/View.js';
import {transform} from 'ol/proj';

// styles
import {
  Circle as CircleStyle,
  Fill,
  Stroke,
  Style,
  Text,
} from 'ol/style.js';


import {Cluster, OSM, Vector as VectorSource} from 'ol/source.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import {boundingExtent} from 'ol/extent.js';
import { fromLonLat } from 'ol/proj'

import { Coords } from "../models/Coords";
import { Marker } from "../models/Marker";


// Decimal places for precision: 6

export default function ImgMap() {

  const [markers, setMarkers] = useState<Marker[]>([])
  const navigate = useNavigate();

  const wroclawCoords = new Coords({longitude: 17.038538, latitude: 51.107883});
  const wroclawMarker = new Marker({coords:  wroclawCoords, url: '/login'})

  const convertCoordsToString = (latitude: number, longitude: number) => {
    return `${latitude}, ${longitude}`
 }

 const createMapping = () => {
  let stringifiedCoords = convertCoordsToString(wroclawMarker.coords.latitude, wroclawMarker.coords.longitude);
  return {
    [stringifiedCoords]: wroclawMarker.url
   }
 }

  const prepMapData = () => {
    // points
    const count = 1; //20000;
    const features = new Array(count);

    const createPoint = (latitude: number, longtitude: number) => {
      let p = new Point(fromLonLat([longtitude, latitude]));
      return p;
    };


    features[0] = new Feature({ 
      geometry: createPoint(wroclawMarker.coords.latitude, wroclawMarker.coords.longitude)
    });

    // new layer with points on top?
    const source = new VectorSource({
      features: features,
    });

    const clusterSource = new Cluster({
      distance: 100,      //parseInt(distanceInput.value, 10),
      minDistance: 100,   //parseInt(minDistanceInput.value, 10),
      source: source,
    });

    // setup cluster
    const styleCache: any = {};
    const clusters = new VectorLayer({
      source: clusterSource,
      style: function (feature) {
        const size = feature.get('features').length;
        let style = styleCache[size];
        if (!style) {
          style = new Style({
            image: new CircleStyle({
              radius: 10,
              stroke: new Stroke({
                color: '#fff',
              }),
              fill: new Fill({
                color: '#3399CC',
              }),
            }),
            text: new Text({
              text: size.toString(),
              fill: new Fill({
                color: '#fff',
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
        url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
      })
    });
      return [raster, clusters]
  };

  const mapping = createMapping();
 
  const getUrlFromMapping = (location: any) => {
    // location [longititude, latitude]
    console.log("getUrlFromMapping");
    console.log(mapping);
    console.log(convertCoordsToString(location[1].toFixed(6), location[0].toFixed(6)))
    return mapping[convertCoordsToString(location[1].toFixed(6), location[0].toFixed(6))]
  };

  const setupMap = () => {
    let layers = prepMapData()
    let mainMap = new Map({
        target: 'mapContent',
        layers: layers,
        view: new View({
          center: [0, 0],
          zoom: 2
        })
    })
    // https://stackoverflow.com/questions/17546953/cant-access-object-property-even-though-it-shows-up-in-a-console-log
    // https://stackoverflow.com/questions/26967638/convert-point-to-lat-lon
    // TODO double precision rounding
    mainMap.on('click', function (event) {
      mainMap.forEachFeatureAtPixel(event.pixel, function (feature, layer) {
        let loc = JSON.parse(JSON.stringify(feature.getGeometry())).flatCoordinates
        console.log(
          loc
        );
        let loc_plus = transform(loc, 'EPSG:3857', 'EPSG:4326');  // works ok 
        console.log("Location after transform:")
        console.log(loc_plus[0].toFixed(6))
        console.log(loc_plus[1].toFixed(6))
        let url =  getUrlFromMapping(loc_plus)
        console.log(url);
        navigate(url);
      })
    })
  }


    useEffect(() => {
      // setMarkers([new Coords({longitude: 17.038538, latitude: 51.107883}), new Coords({longitude: 21.012230, latitude: 52.229675})])
      setupMap()
      }, [])

  return (
    <>
      <Box
        sx={{
          width: '90vw', //'90vw',
          height: '85vh', //'85vh',
          marginLeft: 'auto',
          // marginTop: '30px',
          marginRight: 'auto'
        }}
        id="mapContent"
      />
    </>
  );
}
