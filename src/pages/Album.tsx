import React, {useState, useEffect, useContext} from "react";
import {
  Box,
  Typography,
  Button
} from "@mui/material";
// import { Link } from "react-router-dom";

// * services
import { getFolderContent } from "../services/folderContent";
import { useParams} from 'react-router-dom';
import { Folder } from '../models/Folder';
import { Image } from '../models/Image';
import { ImageList, ImageListItem } from '@mui/material';


export default function Album() {

  const { folderId } = useParams();
  const [folders, setFolders] = useState<Folder[]>();
  const [images, setImages] = useState<Image[]>();

  const fetchFolderContent = (folderId: any) => {
    getFolderContent(folderId, (res: any) => {
      let imagesList: Image[] = res.data.images.map(
        (o: any) => new Image(o)
      );
      setImages(imagesList);
      let folderList: Folder[] = res.data.folders.map(
        (o: any) => new Folder(o)
      );
      setFolders(folderList);
    }, (err: any) => {
      console.log(err);
    });
  }

  useEffect(() => {
    if (folderId) fetchFolderContent(folderId);
  }, [folderId]);

  return (
    <>
      <Box>
        Album <br/>
        Images <br/>
        {images && images.map(o => <div key={o.name}>{o.name}</div>)}

        {images &&
          <ImageList sx={{ width: 500, height: 450 , borderStyle: 'solid'}} cols={3} rowHeight={164}>
            {images.map((item) => (
              <ImageListItem key={item.thumbnailUrl}>
                <img
                  src={`${item.thumbnailUrl}`}
                  // srcSet={`${item.thumbnailUrl}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                  alt={item.thumbnailUrl}
                  loading="lazy"
                />
              </ImageListItem>
            ))}
          </ImageList>
        }

        Folders <br/>
        {folders && folders.map(o => <div key={o.name}>{o.name}</div>)}
      </Box>
    </>
  );
}
