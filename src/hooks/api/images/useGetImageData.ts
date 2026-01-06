import axios from "axios";
import type { ImageData } from "models/ImageData";
import { useState } from "react";

export const useGetImageData = () => {
  const [imageData, setImageData] = useState<undefined | null | ImageData>(undefined);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const getImageData = async (imgId: number): Promise<any> => {
    const headers = {};

    axios
      .get(`/api/v1/images/${imgId}`, { headers: headers })
      .then((res) => {
        setImageData(res.data);
        setErrorMsg("");
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 404) setImageData(null);
        }
        setErrorMsg(err.response.data.detail);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return {
    getImageData,
    setImageData,
    imageData,
    errorMsg,
    loading,
  };
};
