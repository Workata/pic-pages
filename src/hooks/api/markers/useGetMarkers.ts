import axios from 'axios';
import { useState } from 'react';
import { Coords } from "../../../models/Coords";
import { Marker } from "../../../models/Marker";


export const useGetMarkers = () => {
  const [markers, setMarkers] = useState<undefined | Marker[]>();
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [loading, setLoading] = useState<Boolean>(true);

  const getMarkers = async () => {
    axios.get("/api/v1/map/marker"
    ).then( (res) => {
      setMarkers(res.data.map(
        (o: any) => new Marker(
          {coords: new Coords({longitude: o.longitude, latitude: o.latitude}), url: o.url}
        )
      ));
      setErrorMsg('');
    }).catch( err => {
      setErrorMsg(err.response.data.detail);
    }).finally( () => {
      setLoading(false);
    });
  }

  return {
    getMarkers,
    markers,
    errorMsg,
    loading
  }
}
