import axios from "axios";
import { useState } from "react";

export const useUpdateImageComment = () => {
  const [response, setResponse] = useState<any>();
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [loading, setLoading] = useState<Boolean>(true);

  const updateImageComment = async (
    imgId: string,
    comment: string,
    token: string,
  ) => {
    let headers = {
      Authorization: `Bearer ${token}`,
      "ngrok-skip-browser-warning": "69420",
    };

    axios
      .patch(
        `/api/v1/images/${imgId}/comment`,
        { comment: comment },
        { headers: headers },
      )
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
    updateImageComment,
    response,
    errorMsg,
    loading,
  };
};
