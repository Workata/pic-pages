import axios from "axios";
import { useState } from "react";

export const useDeleteCategory = () => {
  const [loading, setLoading] = useState<Boolean>(true);

  const deleteCategory = (categoryName: string, token: string): any => {
    // * returns positive or error response
    let headers = { Authorization: `Bearer ${token}` };

    return axios
      .delete(`/api/v1/categories/${categoryName}`, { headers: headers })
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
    deleteCategory,
    loading,
  };
};
