import axios from "axios";
import { Marker } from "models/Marker";
import { useState } from "react";

export const useGetMarkers = () => {
  const [markers, setMarkers] = useState<undefined | Marker[]>();
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const getMarkers = async () => {
    const headers = {};

    axios
      .get("/api/v1/map/marker", { headers: headers })
      .then((res) => {
        setMarkers(res.data.map((o: any) => new Marker(o)));
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
    getMarkers,
    markers,
    errorMsg,
    loading,
  };
};
