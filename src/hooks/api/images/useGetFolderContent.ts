import axios from "axios";
import { useState } from "react";

import { Folder } from "models/Folder";
import { Image } from "models/Image";

export const useGetFolderContent = () => {
  const [images, setImages] = useState<undefined | Image[]>(undefined);
  const [folders, setFolders] = useState<undefined | Folder[]>(undefined);
  const [nextPageToken, setNextPageToken] = useState<null | string>(null)
  const [loading, setLoading] = useState<Boolean>(true);

  const getFolderContent = async (folderId: string, pageToken: null | string) => {
    console.log("get folder content request")
    console.log(`folder id: ${folderId}`)
    console.log(`page token: ${pageToken}`)
    axios
      .get(`/api/v1/gdrive/folder/${folderId}`, {params: {page_token: pageToken}})
      .then((res) => {
        setImages(res.data.images.map((o: any) => new Image(o)));
        setFolders(res.data.folders.map((o: any) => new Folder(o)));
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
    folders,
    nextPageToken,
    loading,
  };
};
