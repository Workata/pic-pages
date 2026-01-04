import axios from "axios";
import { Category } from "models/Category";
import { useState } from "react";

export const useGetCategories = () => {
  const [categories, setCategories] = useState<undefined | Category[]>();
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const getCategories = async () => {
    const headers = {};

    axios
      .get("/api/v1/categories", { headers: headers })
      .then((res) => {
        const categories = res.data.map((obj: any) => new Category(obj));
        setCategories(categories);
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
    getCategories,
    categories,
    errorMsg,
    loading,
  };
};
