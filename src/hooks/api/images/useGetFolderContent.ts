import axios from 'axios';
import { useState } from 'react';

import { Folder } from 'models/Folder';
import { Image } from 'models/Image';


export const useGetFolderContent = () => {
  const [images, setImages] = useState<undefined | Image[]>(undefined);
  const [folders, setFolders] = useState<undefined | Folder[]>(undefined);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [loading, setLoading] = useState<Boolean>(true);

  const getFolderContent = async (folderId: string) => {
    axios.get(
      `/api/v1/gdrive/folder/${folderId}`
    ).then( (res) => {
      setImages(
        res.data.images.map(
          (o: any) => new Image(o)
        )
      );
      setFolders(
        res.data.folders.map(
          (o: any) => new Folder(o)
        )
      );
      setErrorMsg('');
    }).catch( err => {
      setErrorMsg(err.response.data.detail);
    }).finally( () => {
      setLoading(false);
    });
  }

  return {
    getFolderContent,
    images,
    folders,
    errorMsg,
    loading
  }
}
