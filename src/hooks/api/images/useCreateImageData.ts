import axios from "axios";
import { Category } from "models/Category";
import { useState } from "react";

export const useCreateImageData = () => {
  const [response, setResponse] = useState<any>();
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [loading, setLoading] = useState<Boolean>(true);

  const createImageData = async (
    imgId: string,
    name: string,
    categories: Category[],
    comment: string,
    token: string,
  ) => {
    let data = {
      id: imgId,
      name: name,
      categories: categories,
      comment: comment,
    };
    let headers = {
      Authorization: `Bearer ${token}`,
      "ngrok-skip-browser-warning": "69420",
    };

    axios
      .post("/api/v1/images", data, { headers: headers })
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
    createImageData,
    response,
    errorMsg,
    loading,
  };
};
