import axios from 'axios';
import { Category } from 'models/Category';
import { useState } from 'react';


export const useCreateImageData = () => {
  const [response, setResponse] = useState<any>();
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [loading, setLoading] = useState<Boolean>(true);

  const createImageData = async (imgId: string, name: string, categories: Category[] = [], comment: string = '') => {
    let data = {id: imgId, name: name, categories: categories, comment: comment};
    axios.post(
      "/api/v1/images", data
    ).then( (res) => {
      setResponse(res);
      setErrorMsg('');
    }).catch( err => {
      setErrorMsg(err.response.data.detail);
    }).finally( () => {
      setLoading(false);
    });
  }

  return {
    createImageData,
    response,
    errorMsg,
    loading
  }
}
