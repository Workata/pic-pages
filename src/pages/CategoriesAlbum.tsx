// TODO update URL based on current pic variable

import React, {useState, useEffect} from "react";

import { useNavigate } from 'react-router-dom';

// * services
import { getCategoryContent } from "../services/images";
import { useParams} from 'react-router-dom';
import { Folder } from '../models/Folder';
import { Image } from '../models/Image';
import { ImageList, ImageListItem } from '@mui/material';


// * components
import ClickableFolder from "../components/ClickableFolder";
import ImageViewer from 'awesome-image-viewer';
import {
  Box
} from "@mui/material";
import SelectCategoryModal from "../components/modals/SelectCategory";
import AddCommentModal from "../components/modals/AddComment";

import categoryIcon from '../icons/theatre-svgrepo-com.svg';
import commentIcon from '../icons/comment.svg';
// import CommentIcon from '@mui/icons-material/Comment';

declare type imageToView = {
  mainUrl: string;
  thumbnailUrl?: string;
  description?: string;
};

export default function CategoriesAlbum() {
  const { currentCategory, currentImgId } = useParams();
  const [folders, setFolders] = useState<Folder[]>();
  const [images, setImages] = useState<Image[]>();
  const [viewer, setViewer] = useState<ImageViewer>();
  const [openCategoriesDialogWindow, setOpenCategoriesDialogWindow] = useState(false);
  const [openCommentDialogWindow, setOpenCommentDialogWindow] = useState(false);
  const navigate = useNavigate();

  // const gallery = new Viewer(document.getElementById('images')!);

  const rightImgButton: HTMLElement = document.getElementsByClassName("arrowButton rightButton")[0] as HTMLElement;
  const leftImgButton: HTMLElement = document.getElementsByClassName("arrowButton leftButton")[0] as HTMLElement;
  const closeImgButton: HTMLElement = document.getElementsByClassName("defaultButton closeButton")[0] as HTMLElement;

  if(rightImgButton){
    let idxPrev = Number(viewer?.currentSelected);
    rightImgButton.onclick = () => {
      if (idxPrev>=images!.length-1) return;
      if (viewer?.currentSelected) insertImgIdToUrl(getImgIdFromIdx(idxPrev+1));
    };
  };

  if(leftImgButton){
    let idxPrev = Number(viewer?.currentSelected);
    leftImgButton.onclick = () => {
      if (idxPrev<=0) return;
      insertImgIdToUrl(getImgIdFromIdx(idxPrev-1));
    };
  };

  if(closeImgButton){
    closeImgButton.onclick = () => {clearUrlFromImg();};
  };

  const fetchCategoryContent = (categoryName: string) => {
    getCategoryContent(categoryName, (res: any) => {
      console.log(res)
      let imagesList: Image[] = res.data.map(
        (o: any) => new Image(o)
      );
      setImages(imagesList);
    }, (err: any) => {
      console.log(err);
    });
  }

  const viewerIsClosed = () => {
    return document.getElementsByClassName('imageViewer visible').length === 0;
  }

  const insertImgIdToUrl = (imgId: string) => {
    if(!currentImgId || currentImgId !== imgId) navigate(`../categories/${currentCategory}/${imgId}`, { replace: true });
  }

  const getImgIdFromIdx = (idx: number): string => {
    if(images) {
      return images[idx].id
    }
    return ""
  }

  const clearUrlFromImg = () => {
    navigate(`../categories/${currentCategory}`, { replace: true });
  }

  // * open image viewer
  const viewImage = (idx: number) => {
    if(!images) {console.log("No images!"); return;}

    let data: imageToView[] = images.map(
      (img) => ({
        "mainUrl": img.imageUrl,
        "thumbnailUrl": img.thumbnailUrl,
        "description": img.comment === '' ? img.name : `${img.name} - ${img.comment}`
      })
    );

      
    console.log("Image Viewer is opening...");
    console.log("Data for image viewer:")
    console.log(data);
    console.log("Current selected idx in img viewer:")
    console.log(idx)
    // indexes should start from 0
    setViewer(new ImageViewer({
      images: data,
      currentSelected: idx,
      showThumbnails: false, // TODO thumnbanils and arrow links need to be fixed 
      buttons: [
        {
          name: 'Categorize',
          iconSrc: categoryIcon,
          iconSize: '18px',
          onSelect: () => setOpenCategoriesDialogWindow(true)
        },
        {
          name: 'Comment',
          iconSrc: commentIcon,
          iconSize: '18px',
          onSelect: () => setOpenCommentDialogWindow(true)
        }
      ]
    }))
  }

  useEffect(() => {

    if (currentCategory) fetchCategoryContent(currentCategory);
  }, [currentCategory]);

  useEffect(() => {
    if (currentImgId && images && viewerIsClosed()) {
      console.log(`Currently selected img ID ${currentImgId}`);
      viewImage(
        images.findIndex(el => el.id === currentImgId)
      );
    }
  }, [images, currentImgId]);

  return (
    <>
      <Box
        sx={{
          width: "100%",
        }}
      >
        {/* Folders container */}
        <Box sx={{display: 'flex', columnGap: '20px'}}> 
          {folders && folders.map(folder => <ClickableFolder key={folder.id} name={folder.name} link={`/categories/${folder.id}`}/>)}
        </Box>

        {/* Images container */}
        <Box
          sx={{
            width: "100%",
          }}
        >
        {
          images &&
          <ImageList
            // ? https://mui.com/material-ui/react-image-list/
            variant="masonry"
            cols={11} // number of columns reflects images (thumbnails) size
            gap={12}
            id="images"
          >
            {images.map((img: Image) => (
              <ImageListItem key={img.id} sx={{
                  cursor: "pointer",
                  // TODO fix scroll bar on hover
                  // transition: 'transform .2s',
                  // '&:hover': {
                  //   transform: 'scale(1.1)'
                  // }
                }}
              >
                <img
                  src={img.thumbnailUrl}
                  alt={img.name}
                  loading="lazy"
                  onClick={() => {
                    insertImgIdToUrl(img.id);
                  }}
                  // style={{boxShadow: "2px 2px 5px #ccc"}}
                />
              </ImageListItem>
            ))}
          </ImageList>
        }
        </Box>
      </Box>

      {/* MODALS */}
      <SelectCategoryModal
        openDialogWindow={openCategoriesDialogWindow}
        setOpenDialogWindow={setOpenCategoriesDialogWindow}
        imgId={currentImgId}
      />

      <AddCommentModal
        openDialogWindow={openCommentDialogWindow}
        setOpenDialogWindow={setOpenCommentDialogWindow}
        imgId={currentImgId}
      />

    </>
  );
}
