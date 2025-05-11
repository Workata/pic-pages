import axios from "axios";
import { useState } from "react";
import { Marker } from "models/Marker";

export const useGetMarkers = () => {
  const [markers, setMarkers] = useState<undefined | Marker[]>();
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [loading, setLoading] = useState<Boolean>(true);

  const getMarkers = async () => {
    let headers = {};

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
