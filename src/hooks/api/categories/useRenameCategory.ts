import axios from "axios";
import { useState } from "react";

export const useRenameCategory = () => {
  const [loading, setLoading] = useState<Boolean>(true);

  const renameCategory = (
    oldName: string,
    newName: string,
    token: string,
  ): any => {
    // * returns positive or error response
    let data = { old_name: oldName, new_name: newName };
    let headers = {
      Authorization: `Bearer ${token}`,
      "ngrok-skip-browser-warning": "69420",
    };

    return axios
      .patch("/api/v1/categories", data, { headers: headers })
      .then((res) => {
        // 201 - created
        return res;
      })
      .catch((err) => {
        // 401 etc
        return err.response;
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return {
    renameCategory,
    loading,
  };
};
