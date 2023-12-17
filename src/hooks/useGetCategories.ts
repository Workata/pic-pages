import axios from 'axios';
import { useState } from 'react';
import { Category } from "../models/Category";


export const useGetCategories = () => {
  const [categories, setCategories] = useState<undefined | Category[]>();
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [loading, setLoading] = useState<Boolean>(true);

  const getCategories = async () => {
    axios.get(
      "/api/v1/categories"
    ).then( (res) => {
      let categories = res.data.map(
        (obj: any) => new Category(obj)
      )
      setCategories(categories);
      setErrorMsg('');
    }).catch( err => {
      setErrorMsg(err.response.data.detail);
    }).finally( () => {
      setLoading(false);
    });
  }

  return {
    getCategories,
    categories,
    errorMsg,
    loading
  }
}
