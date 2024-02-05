import axios from "axios";
import { useState } from "react";

export const useUpdateImageCategories = () => {
  const [response, setResponse] = useState<any>();
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [loading, setLoading] = useState<Boolean>(true);

  const updateImageCategories = async (
    imgId: string,
    categories: string[],
    token: string,
  ) => {
    let headers = {
      Authorization: `Bearer ${token}`,
      "ngrok-skip-browser-warning": "69420",
    };

    axios
      .patch(`/api/v1/images/${imgId}/categories`, categories, {
        headers: headers,
      })
      .then((res) => {
        setResponse(res);
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
    updateImageCategories,
    response,
    errorMsg,
    loading,
  };
};
