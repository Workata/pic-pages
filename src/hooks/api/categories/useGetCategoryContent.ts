import axios from "axios";
import { useState } from "react";
import { Image } from "models/Image";

export const useGetCategoryContent = () => {
  const [images, setImages] = useState<undefined | Image[]>();
  const [nextPage, setNextPage] = useState<null | string>(null);
  const [previousPage, setPreviousPage] = useState<null | string>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [loading, setLoading] = useState<Boolean>(true);

  const getCategoryContent = async (category: string, page: number = 0) => {
    let headers = {};
    let params = { page: page };

    axios
      .get(`/api/v1/categories/${category}`, {
        headers: headers,
        params: params,
      })
      .then((res) => {
        setImages(res.data.images.map((o: any) => new Image(o)));
        setPreviousPage(res.data.previous_page);
        setNextPage(res.data.next_page);
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
