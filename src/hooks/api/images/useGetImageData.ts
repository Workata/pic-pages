import axios from 'axios';
import { useState } from 'react';
import { ImageData } from "models/ImageData";


export const useGetImageData = () => {
  const [imageData, setImageData] = useState<undefined | null | ImageData>(undefined);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [loading, setLoading] = useState<Boolean>(true);

  const getImageData = async (imgId: number): Promise<any> => {
    axios.get(`/api/v1/images/${imgId}`
    ).then( (res) => {
      setImageData(new ImageData(res.data));
      setErrorMsg('');
    }).catch( err => {
      if(err.response) {
        if(err.response.status === 404) setImageData(null);
      }
      setErrorMsg(err.response.data.detail);
    }).finally( () => {
      setLoading(false);
    });
  }

  return {
    getImageData,
    setImageData,
    imageData,
    errorMsg,
    loading
  }
}
