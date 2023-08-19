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

import categoryIcon from '../icons/theatre-svgrepo-com.svg';
// import { ReactComponent as categoryIcon } from '../icons/theatre-svgrepo-com.svg';

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
  const viewImage = (idx: number) => {
    if(!images) return;

    let data: imageToView[] = images.map(
      (img) => ({
        "mainUrl": img.imageUrl,
        "thumbnailUrl": img.thumbnailUrl,
        "description": `${img.name}`
      })
    );

    new ImageViewer({
      images: data,
      currentSelected: idx,
      buttons: [
        {
          name: 'Categorize',
          iconSrc: categoryIcon,
          iconSize: '18px',
          onSelect: () => alert("XDD")
        }
      ]
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
          {folders && folders.map(folder => <ClickableFolder key={folder.id} name={folder.name} link={`/album/${folder.id}`}/>)}
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
            {images.map((item, idx: number) => (
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
                  src={item.thumbnailUrl}
                  alt={item.name}
                  loading="lazy"
                  onClick={() => viewImage(idx)}
                  // style={{boxShadow: "2px 2px 5px #ccc"}}
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
