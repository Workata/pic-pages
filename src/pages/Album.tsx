// TODO switch URL img ID dynamically when viewing images
// TODO change img index for image id

import React, {useState, useEffect} from "react";

import { useNavigate } from 'react-router-dom';

// * services
import { getFolderContent } from "../services/folderContent";
import { useParams} from 'react-router-dom';
import { Folder } from '../models/Folder';
import { Image } from '../models/Image';
import { ImageList, ImageListItem } from '@mui/material';
import SelectCategoryModal from "../components/modals/SelectCategory";

// * components
import ClickableFolder from "../components/ClickableFolder";
import ImageViewer from 'awesome-image-viewer';
import {
  Box
} from "@mui/material";

import categoryIcon from '../icons/theatre-svgrepo-com.svg';

declare type imageToView = {
  mainUrl: string;
  thumbnailUrl?: string;
  description?: string;
};

export default function Album() {

  const { folderId, imgId } = useParams();
  const [folders, setFolders] = useState<Folder[]>();
  const [images, setImages] = useState<Image[]>();
  const [viewer, setViewer] = useState<ImageViewer>();
  const [openDialogWindow, setOpenDialogWindow] = useState(false);
  const navigate = useNavigate();

  const myElement: HTMLElement = document.getElementsByClassName("arrowButton rightButton")[0] as HTMLElement;
  if(myElement){
  
    myElement.onclick = () => {
    console.log("ON CLICK")
    console.log(viewer?.currentSelected)
    if (viewer?.currentSelected){
      insertImgIdToUrl(Number(viewer.currentSelected))
    }
  };
}
  const fetchFolderContent = (folderId: any) => {
    console.log("Fetch folder content...")
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

  const viewerIsClosed = () => {
    return document.getElementsByClassName('imageViewer visible').length === 0;
  }

  const insertImgIdToUrl = (idx: number) => {
    if(!imgId || Number(imgId) != idx) navigate(`../album/${folderId}/${idx}`, { replace: true });
  }

  // * open image viewer
  const viewImage = (idx: number) => {
    if(!images) {console.log("No images!"); return;}

    let data: imageToView[] = images.map(
      (img) => ({
        "mainUrl": img.imageUrl,
        "thumbnailUrl": img.thumbnailUrl,
        "description": `${img.name}`
      })
    );
      
    console.log("Image Viewer is opening...")
    setViewer(new ImageViewer({
      images: data,
      currentSelected: idx,
      buttons: [
        {
          name: 'Categorize',
          iconSrc: categoryIcon,
          iconSize: '18px',
          onSelect: () => setOpenDialogWindow(true)
        }
      ]
    }))
  }

  useEffect(() => {
    console.log(`Current selected: ${viewer?.currentSelected}`)
  }, [viewer?.currentSelected]);

  useEffect(() => {
    if (folderId) fetchFolderContent(folderId);
  }, [folderId]);

  useEffect(() => {
    if (imgId && images && viewerIsClosed()) {
      console.log(`Currently selected img ID ${imgId}`);
      viewImage(Number(imgId));
    }
  }, [images, imgId]);

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
                  onClick={() => {
                    if (imgId && Number(imgId) === idx && viewerIsClosed()) {
                      viewImage(Number(imgId));
                      return
                    }
                    insertImgIdToUrl(idx)
                  }
                }
                  // style={{boxShadow: "2px 2px 5px #ccc"}}
                />
              </ImageListItem>
            ))}
          </ImageList>
        }
        </Box>
      </Box>

      <SelectCategoryModal
        openDialogWindow={openDialogWindow}
        setOpenDialogWindow={setOpenDialogWindow}
      />
    </>
  );
}
