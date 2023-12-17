import axios from 'axios';
import { useState } from 'react';


export const useCreateCategory = () => {
  const [response, setResponse] = useState<any>();
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [loading, setLoading] = useState<Boolean>(true);

  const createCategory = async (categoryName: string) => {
    let data = {name: categoryName};
    axios.post("/api/v1/categories", data
    ).then( (res) => {  // 200
      setResponse(res);
      setErrorMsg('');  // clear error message on correct response
    }).catch( err => {
      setErrorMsg(err.response.data.detail);
    }).finally( () => {
      setLoading(false);
    });
  }

  return {
    createCategory,
    response,
    errorMsg,
    loading
  }
}
