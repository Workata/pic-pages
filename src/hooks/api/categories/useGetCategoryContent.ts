import axios from "axios";
import type { Image } from "models/Image";
import { useState } from "react";

export const useGetCategoryContent = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [nextPage, setNextPage] = useState<null | string>(null);
  const [previousPage, setPreviousPage] = useState<null | string>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const getCategoryContent = async (category: string, page: number = 0) => {
    const headers = {};
    const params = { page: page };

    axios
      .get(`/api/v1/categories/${category}`, {
        headers: headers,
        params: params,
      })
      .then((res) => {
        setImages(res.data.images);
        setPreviousPage(res.data.previousPage);
        setNextPage(res.data.nextPage);
        setErrorMsg("");
      })
      .catch((err) => {
        setErrorMsg(err.response.data.detail);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return {
    getCategoryContent,
    setImages,
    images,
    nextPage,
    previousPage,
    errorMsg,
    loading,
  };
};
