import axios from "axios";
import type { ChainedFolder } from "models/Folder";
import { useState } from "react";

export const useGetFolderPath = () => {
  const [chainedFolders, setChainedFolders] = useState<ChainedFolder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const getFolderPath = async (folderId: string) => {
    const headers = {};

    axios
      .get(`/api/v1/gdrive/folder/path/${folderId}`, {
        headers: headers,
      })
      .then((res) => {
        setChainedFolders(res.data.sort((a: ChainedFolder, b: ChainedFolder) => (a.level < b.level ? 1 : -1)));
        return res;
      })
      .catch((err) => {
        return err.response;
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return {
    getFolderPath,
    chainedFolders,
    loading,
  };
};
