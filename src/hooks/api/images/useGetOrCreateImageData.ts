import axios from "axios";
import type { Category } from "models/Category";
import { ImageData } from "models/ImageData";
import { useState } from "react";

export const useGetOrCreateImageData = () => {
  const [imageData, setImageData] = useState<undefined | ImageData>(undefined);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const getOrCreateImageData = async (
    imgId: string,
    name: string,
    categories: Category[],
    comment: string,
    token: string,
  ) => {
    const data = {
      id: imgId,
      name: name,
      categories: categories,
      comment: comment,
    };
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    axios
      .post("/api/v1/images", data, { headers: headers })
      .then((res) => {
        setImageData(new ImageData(res.data));
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
    getOrCreateImageData,
    imageData,
    setImageData,
    errorMsg,
    loading,
  };
};
