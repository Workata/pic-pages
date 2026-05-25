import { AppContext } from "AppContext";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
// * mui
import { Box, Button } from "@mui/material";
// * components
import ClickableFolder from "components/ClickableFolder";
import AddCommentModal from "components/modals/AddComment";
import SelectCategoryModal from "components/modals/category/SelectCategory";
import ThumbnailImageList from "components/ThumbnailImageList";
// * hooks
import { useGetFolderContent } from "hooks/api/images/useGetFolderContent";
import commentIcon from "icons/comment.svg";
import downloadIcon from "icons/file-download-svgrepo-com.svg";
import categoryIcon from "icons/theatre-svgrepo-com.svg";
// * models
import type { Folder } from "models/Folder";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ImageDownloader } from "utils/imageDownloader";
import { ExtendedImageViewer } from "utils/imageViewer";
import type { ImageToView } from "./shared/imageToView.type";

import LightGallery from 'lightgallery/react';
import "css/album.css";

// import styles
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-fullscreen.css';

import { useRef } from 'react';

// import plugins if you need
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';
import lgFullscreen from 'lightgallery/plugins/fullscreen';

import type { Image } from "models/Image";


const albumContainerStyle: React.CSSProperties = {
    marginTop: "20px",
    flexDirection: "row",
    display: "flex",
    flexWrap: "wrap",
    // gap: "20px 20px" /* row-gap column gap */,
    // gap: "2% 2%",
    columnGap: "2%",
    rowGap: "15px",
    // alignItems: "center",
    // justifyContent: "center",
};

export default function Album() {
  const { currentFolderId, currentImgId } = useParams();
  const [searchParams] = useSearchParams();
  const [openCategoriesDialogWindow, setOpenCategoriesDialogWindow] = useState(false);
  const [openCommentDialogWindow, setOpenCommentDialogWindow] = useState(false);
  const { getFolderContent, images, setImages, folders, nextPageToken } = useGetFolderContent();
  const galleryRef = useRef<any>(null);
  const navigate = useNavigate();
  const { tokenValue } = useContext(AppContext);
  const hasOpenedRef = useRef(false);


  const goBack = () => {
    navigate(-1);
  };


  // * open image viewer
  const viewImage = (idx: number) => {
    if (images.length === 0) {
      console.log("No images in the list");
      return;
    }

    const data: ImageToView[] = images.map((img) => ({
      id: img.id, // * additional (not enforced) data for image searching
      mainUrl: img.imageUrl,
      thumbnailUrl: img.thumbnailUrl,
      description: img.comment === "" ? img.name : `${img.name} - ${img.comment}`,
    }));

    let buttons: any;
    if (tokenValue) {
      buttons = [
        {
          name: "Categorize",
          iconSrc: categoryIcon,
          iconSize: "18px",
          onSelect: () => setOpenCategoriesDialogWindow(true),
        },
        {
          name: "Comment",
          iconSrc: commentIcon,
          iconSize: "18px",
          onSelect: () => setOpenCommentDialogWindow(true),
        },
        {
          name: "Download",
          iconSrc: downloadIcon,
          iconSize: "18px",
          onSelect: () => new ImageDownloader().downloadImage(),
        },
      ];
    } else {
      buttons = [
        {
          name: "Download",
          iconSrc: downloadIcon,
          iconSize: "18px",
          onSelect: () => new ImageDownloader().downloadImage(),
        },
      ];
    }

    // setViewer(
    //   new ExtendedImageViewer({
    //     images: data,
    //     currentSelected: idx,
    //     showThumbnails: false, // TODO thumnbanils and arrow links need to be fixed
    //     button
    // );s: buttons,
    //     nextPageUrl: nextPageToken ? `/album/${currentFolderId}?page=${nextPageToken}` : null,
    //   }),
  };

  useEffect(() => {
    if (currentFolderId) {
      getFolderContent(currentFolderId, searchParams.get("page"));
    }
  }, [currentFolderId, searchParams.get("page")]);


  useEffect(() => {
      if (!galleryRef.current) return;
      if (!currentImgId) return;
      if (images.length === 0) return;

      const index = images.findIndex(
          (img) => img.id === currentImgId
      );

      if (index === -1) return;

      galleryRef.current.openGallery(index);
  }, [currentImgId, images]);

  return (
    <>
      <Box
        sx={{
          width: "100%",
        }}
      >
        {images.length !== 0 && (
          <Box
            id="paginations-buttons-container"
            sx={{
              display: "flex",
              columnGap: "20px",
              width: "100%",
              marginTop: "15px",
            }}
          >
            <Button
              id="starting-page-button"
              variant="contained"
              disabled={searchParams.get("page") === null}
              component={Link}
              to={`/album/${currentFolderId}`}
              sx={{
                textTransform: "none",
                "&.Mui-disabled": {
                  background: "#7a8aa3",
                  color: "#c0c0c0",
                },
              }}
            >
              <KeyboardDoubleArrowLeftIcon sx={{ marginRight: "15px" }} /> start
            </Button>

            <Button
              id="previous-page-button"
              variant="contained"
              onClick={goBack}
              sx={{
                textTransform: "none",
                "&.Mui-disabled": {
                  background: "#7a8aa3",
                  color: "#c0c0c0",
                },
              }}
            >
              <KeyboardArrowLeftIcon sx={{ marginRight: "15px" }} /> prev
            </Button>

            <Button
              id="next-page-button"
              variant="contained"
              disabled={nextPageToken === null}
              component={Link}
              to={`/album/${currentFolderId}?page=${nextPageToken}`}
              sx={{
                textTransform: "none",
                "&.Mui-disabled": {
                  background: "#7a8aa3",
                  color: "#c0c0c0",
                },
              }}
            >
              next <KeyboardArrowRightIcon sx={{ marginLeft: "15px" }} />
            </Button>
          </Box>
        )}

        {folders.length > 0 && (
          <Box
            id="folders-container"
            sx={{
              display: "flex",
              columnGap: "20px",
              marginTop: "10px",
            }}
          >
            {folders.map((folder: Folder) => (
              <ClickableFolder key={folder.id} name={folder.name} link={`/album/${folder.id}`} />
            ))}
          </Box>
        )}

        {images.length > 0 && (
            <LightGallery
                // onInit={onInit}
                speed={500}
                plugins={[lgThumbnail, lgFullscreen]}
                preload={1} // change for 0 if there will be a problem with 'too many requests'
                download={true}
                numberOfSlideItemsInDom={3}
                onInit={(detail) => {
                    // setGalleryInstance(detail.instance);
                    galleryRef.current = detail.instance;
                }}
                onAfterSlide={(event) => {
                  const index = event.index;
                  const image = images[index];

                  if (!image) return;

                  const page = searchParams.get("page");
                  const url =
                      page === null
                          ? `#/album/${currentFolderId}/${image.id}`
                          : `#/album/${currentFolderId}/${image.id}?page=${page}`;

                  window.history.replaceState(null, "", url);
                }}
                onAfterClose={() => {
                    const page = searchParams.get("page");

                    const url =
                        page === null
                            ? `#/album/${currentFolderId}`
                            : `#/album/${currentFolderId}?page=${page}`;

                    window.history.replaceState(null, "", url);
                }}
                // addClass="light-gallery"
            >
              {images.map((image: Image) => (
                <a key={image.id}  href={image.imageUrl} data-src={image.imageUrl} data-sub-html={image.name}>
                    <img alt={image.name} src={image.thumbnailUrl} loading="lazy" />
                </a>
              ))}
            </LightGallery>
        )}
      </Box>

      {/* MODALS */}
      {/* <SelectCategoryModal
        openDialogWindow={openCategoriesDialogWindow}
        setOpenDialogWindow={setOpenCategoriesDialogWindow}
        imgId={currentImgId}
        imgName={images?.find((e) => e.id === currentImgId)?.name}
      />
      {viewer && (
        <AddCommentModal
          openDialogWindow={openCommentDialogWindow}
          viewer={viewer}
          setOpenDialogWindow={setOpenCommentDialogWindow}
          imgId={currentImgId}
          imgName={images?.find((e) => e.id === currentImgId)?.name}
          images={images}
          setImages={setImages}
        />
      )} */}
    </>
  );
}
