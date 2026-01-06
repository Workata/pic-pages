import axios from "axios";
import type { Folder } from "models/Folder";
import type { Image } from "models/Image";
import { useState } from "react";

export const useGetFolderContent = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [nextPageToken, setNextPageToken] = useState<null | string>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const getFolderContent = async (folderId: string, pageToken: null | string) => {
    const headers = {};

    axios
      .get(`/api/v1/gdrive/folder/${folderId}`, {
        params: { page_token: pageToken },
        headers: headers,
      })
      .then((res) => {
        setImages(res.data.images);
        // years: 2025, 2024, 2023 ...
        // locations: Venezuela, Georgia, Armenia
        setFolders(res.data.folders.sort((a: Folder, b: Folder) => (a.name < b.name ? 1 : -1)));
        setNextPageToken(res.data.nextPageToken);
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
    getFolderContent,
    images,
    setImages,
    folders,
    nextPageToken,
    loading,
  };
};
