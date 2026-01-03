import axios from "axios";
import { useState } from "react";

import { ChainedGoogleDriveFolder } from "models/Folder";

export const useGetFolderPath = () => {
  const [chainedFolders, setChainedFolders] = useState<ChainedGoogleDriveFolder[]>([]);
  const [loading, setLoading] = useState<Boolean>(true);

  const getFolderPath = async (folderId: string) => {
    let headers = {};

    axios
      .get(`/api/v1/gdrive/folder/path/${folderId}`, {
        headers: headers,
      })
      .then((res) => {
        setChainedFolders(
          res.data.sort((a: ChainedGoogleDriveFolder, b: ChainedGoogleDriveFolder) => (a.level < b.level ? 1 : -1)),
        );
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
