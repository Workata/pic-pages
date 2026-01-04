import axios from "axios";
import { useState } from "react";

export const useRenameCategory = () => {
  const [loading, setLoading] = useState<boolean>(true);

  const renameCategory = (oldName: string, newName: string, token: string): any => {
    // * returns positive or error response
    const data = { old_name: oldName, new_name: newName };
    const headers = {
      Authorization: `Bearer ${token}`,
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
