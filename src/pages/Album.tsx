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

// * components
import ClickableFolder from "../components/ClickableFolder";
import ImageViewer from 'awesome-image-viewer';

declare type imageToView = {
  mainUrl: string;
  thumbnailUrl?: string;
  description?: string;
};

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

  // open image viewer
  const viewImage = () => {
    if(!images) return;
    console.log("XD");
    let data: imageToView[] = images.map(
      (img) => ({"mainUrl": img.imageUrl, "thumbnailUrl": img.thumbnailUrl})
    );
    console.log(data);
    new ImageViewer({
      images: data
    })
  }

  return (
    <>
      <Box
        sx={{
          width: "100%",
          // borderColor: 'blue',
          // borderStyle: 'solid'
        }}
      >
        {/* Folders container */}
        <Box sx={{display: 'flex', columnGap: '20px'}}> 
          {folders && folders.map(folder => <ClickableFolder key={folder.id} id={folder.id} name={folder.name}/>)}
        </Box>

        {/* Images container */}
        <Box
          sx={{
            width: "100%",
            // borderColor: 'green',
            // borderStyle: 'solid'
          }}
        >

        {
          images &&
          <ImageList
            // ? https://mui.com/material-ui/react-image-list/
            variant="masonry"
            cols={11} // number of columns reflects images (thumbnails) size
            gap={12}
          >
            {images.map((item) => (
              <ImageListItem key={item.thumbnailUrl} sx={{
                  cursor: "pointer",
                  // TODO fix scroll bar on hover
                  // transition: 'transform .2s',
                  // '&:hover': {
                  //   transform: 'scale(1.1)'
                  // }
                }}
              >
                <img
                  src={`${item.thumbnailUrl}`}
                  alt={item.thumbnailUrl}
                  loading="lazy"
                  onClick={viewImage}
                />
              </ImageListItem>
            ))}
          </ImageList>
        }
        </Box>
      </Box>
    </>
  );
}