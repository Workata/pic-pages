import axios from 'axios';
import { useState } from 'react';
import { Image } from "../../../models/Image";


export const useGetCategoryContent = () => {
  const [images, setImages] = useState<undefined | Image[]>();
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [loading, setLoading] = useState<Boolean>(true);

  const getCategoryContent = async (category: string) => {
    axios.get(
      `/api/v1/categories/${category}`
    ).then( (res) => {
      setImages(res.data.map(
        (o: any) => new Image(o)
      ));
      setErrorMsg('');
    }).catch( err => {
      setErrorMsg(err.response.data.detail);
    }).finally( () => {
      setLoading(false);
    });
  }

  return {
    getCategoryContent,
    images,
    errorMsg,
    loading
  }
}
