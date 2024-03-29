import axios from "axios";
import { useState } from "react";

export const useCreateMarker = () => {
  const [response, setResponse] = useState<any>();
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [loading, setLoading] = useState<Boolean>(true);

  const createMarker = async (
    lat: number,
    lon: number,
    url: string,
    token: string,
  ) => {
    let data = {
      latitude: lat,
      longitude: lon,
      url: url,
    };
    let headers = {
      Authorization: `Bearer ${token}`,
      "ngrok-skip-browser-warning": "69420",
    };

    axios
      .post("/api/v1/map/marker", data, { headers: headers })
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
    createMarker,
    response,
    errorMsg,
    loading,
  };
};
