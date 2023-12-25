import axios from "axios";
import { useState } from "react";

export const useCreateCategory = () => {
  const [loading, setLoading] = useState<Boolean>(true);

  const createCategory = (categoryName: string, token: string): any => {
    // * returns positive or error response
    let data = { name: categoryName };
    let headers = { Authorization: `Bearer ${token}` };

    return axios
      .post("/api/v1/categories", data, { headers: headers })
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
    createCategory,
    loading,
  };
};
