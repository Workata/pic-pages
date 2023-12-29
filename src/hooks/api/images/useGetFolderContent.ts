import axios from "axios";
import { useState } from "react";

import { Folder } from "models/Folder";
import { Image } from "models/Image";

export const useGetFolderContent = () => {
  const [images, setImages] = useState<undefined | Image[]>(undefined);
  const [folders, setFolders] = useState<undefined | Folder[]>(undefined);
  const [loading, setLoading] = useState<Boolean>(true);

  const getFolderContent = async (folderId: string) => {
    axios
      .get(`/api/v1/gdrive/folder/${folderId}`)
      .then((res) => {
        setImages(res.data.images.map((o: any) => new Image(o)));
        setFolders(res.data.folders.map((o: any) => new Folder(o)));
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
    loading,
  };
};
