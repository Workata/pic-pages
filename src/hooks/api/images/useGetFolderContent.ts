import axios from "axios";
import { useState } from "react";

import { Folder } from "models/Folder";
import { Image } from "models/Image";

export const useGetFolderContent = () => {
  const [images, setImages] = useState<undefined | Image[]>(undefined);
  const [folders, setFolders] = useState<undefined | Folder[]>(undefined);
  const [nextPageToken, setNextPageToken] = useState<null | string>(null);
  const [loading, setLoading] = useState<Boolean>(true);

  const getFolderContent = async (folderId: string, pageToken: null | string) => {
    let headers = {};

    axios
      .get(`/api/v1/gdrive/folder/${folderId}`, {
        params: { page_token: pageToken },
        headers: headers,
      })
      .then((res) => {
        setImages(res.data.images.map((o: any) => new Image(o)));
        // years: 2025, 2024, 2023 ...
        // locations: Venezuela, Georgia, Armenia
        setFolders(
          res.data.folders.map((o: any) => new Folder(o)).sort((a: Folder, b: Folder) => (a.name < b.name ? 1 : -1)),
        );
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
