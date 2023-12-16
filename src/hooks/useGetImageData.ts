import axios from 'axios';
import { useState } from 'react';
import { ImageData } from "../models/ImageData";


export const useGetImageData = () => {
  const [imageData, setImageData] = useState<undefined | null | ImageData>(undefined);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [loading, setLoading] = useState<Boolean>(true);

  const getImageData = async (imgId: number): Promise<any> => {
    axios.get(`/api/v1/images/${imgId}`
    ).then( (res) => {  // 200
      setImageData(new ImageData(res.data));
      setErrorMsg('');  // clear error message on correct response
    }).catch( err => {  // 401
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
