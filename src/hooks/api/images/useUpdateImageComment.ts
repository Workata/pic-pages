import axios from "axios";
import { useState } from "react";

export const useUpdateImageComment = () => {
  const [response, setResponse] = useState<any>();
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const updateImageComment = async (imgId: string, comment: string, token: string) => {
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    axios
      .patch(`/api/v1/images/${imgId}/comment`, { comment: comment }, { headers: headers })
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
