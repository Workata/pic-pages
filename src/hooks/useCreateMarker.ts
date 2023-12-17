import axios from 'axios';
import { useState } from 'react';


export const useCreateMarker = () => {
  const [response, setResponse] = useState<any>();
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [loading, setLoading] = useState<Boolean>(true);

  const createMarker = async (lat: number, lon: number, url: string) => {
    let data = {
      latitude: lat,
      longitude: lon,
      url: url
    }
    axios.post(
      "/api/v1/map/marker", data
    ).then( res => {
      setResponse(res);
      setErrorMsg('');
    }).catch( err => {
      setErrorMsg(err.response.data.detail);
    }).finally( () => {
      setLoading(false);
    });
  }

  return {
    createMarker,
    response,
    errorMsg,
    loading
  }
}
