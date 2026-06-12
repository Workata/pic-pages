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

// * hooks
import { useGetFolderContent } from "hooks/api/images/useGetFolderContent";
import commentIcon from "icons/comment.svg";
import downloadIcon from "icons/file-download-svgrepo-com.svg";
import categoryIcon from "icons/theatre-svgrepo-com.svg";

// * models
import type { Folder } from "models/Folder";
import { useContext, useEffect, useState, useMemo } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";

import LightGallery from "lightgallery/react";
import "css/album.css";

import { ImageDownloader } from "utils/imageDownloader";

// import styles
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";
import "lightgallery/css/lg-fullscreen.css";

import { useRef } from "react";

// import plugins if you need
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgFullscreen from "lightgallery/plugins/fullscreen";

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



  const customButtonClsName: string = "lg-custom-btn"

  const addDownloadButton = (lg: any) => {
    const toolbar = lg.outer.find(".lg-toolbar").get();
    const downloadButtonId: string = "downloadButton"
    if (toolbar.querySelector(`#${downloadButtonId}`)) return;

    const downloadButton = document.createElement("button");
    downloadButton.className = customButtonClsName;
    downloadButton.innerHTML = `
      <img src="${downloadIcon}" alt="download" id="${downloadButtonId}"/>
    `;

    downloadButton.onclick = () => new ImageDownloader().downloadImage();
    toolbar.appendChild(downloadButton);
  };

  const addCommentButton = (lg: any) => {
    const toolbar = lg.outer.find(".lg-toolbar").get();
    const commentButtonId: string = "commentButton"
    if (toolbar.querySelector(`#${commentButtonId}`)) return;

    const commentButton = document.createElement("button");
    commentButton.className = customButtonClsName;
    commentButton.id = commentButtonId;
    commentButton.innerHTML = `
      <img src="${commentIcon}" alt="comment"/>
    `;
    
    commentButton.onclick = () => setOpenCommentDialogWindow(true);
    toolbar.appendChild(commentButton);
  }

  const addCategoryButton = (lg: any) => {
    const toolbar = lg.outer.find(".lg-toolbar").get();
    const categoryButtonId: string = "categoryButton"
    if (toolbar.querySelector(`#${categoryButtonId}`)) return;

    const categoryButton = document.createElement("button");
    categoryButton.className = customButtonClsName;
    categoryButton.innerHTML = `
      <img src="${categoryIcon}" alt="category" id="${categoryButtonId}"/>
    `;

    categoryButton.onclick = () => setOpenCategoriesDialogWindow(true);
    toolbar.appendChild(categoryButton);
  }


  const onGalleryInit = (detail: any) => {
    const lg = detail.instance;
    galleryRef.current = lg;

    addDownloadButton(lg);
    // comment token value if check for testing
    if (tokenValue){
      addCommentButton(lg);
      addCategoryButton(lg);
    }
  };

  const onGalleryClose = (detail: any) => {
    // clear url
    const page = searchParams.get("page");
    const url = page === null ? `#/album/${currentFolderId}` : `#/album/${currentFolderId}?page=${page}`;
    window.history.replaceState(null, "", url);
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

    const index = images.findIndex((img) => img.id === currentImgId);

    if (index === -1) return;

    galleryRef.current.openGallery(index);
  }, [currentImgId, images]);


    const memoizedGallery = useMemo(() => {
    // This block will ONLY run once (or when the images array reference changes)
    return (
images.length > 0 && <LightGallery
            licenseKey="LIG-34EA249B-F46A-4AD8-A666-D99AEB4C9865"
            speed={500}
            plugins={[lgThumbnail, lgFullscreen]}
            preload={1} // change for 0 if there will be a problem with 'too many requests'
            download={false}
            closeOnTap={false}
            swipeToClose={false}
            // closable={false}
            toggleThumb={true}
            numberOfSlideItemsInDom={3}
            onInit={onGalleryInit}
            onAfterClose={onGalleryClose}
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
          >
            {/* data-sub-html={image.name} - image comment */}
            {images.map((image: Image) => (
              <a
                key={image.id}
                href={image.imageUrl}
                data-src={image.imageUrl}
                data-sub-html={image.comment}
                referrerPolicy="no-referrer"
              >
                <img alt={image.name} src={image.thumbnailUrl} loading="lazy" referrerPolicy="no-referrer" />
              </a>
            ))}
          </LightGallery>
    );
  }, [images]);

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

        {images.length > 0 && memoizedGallery}
      </Box>

      {/* MODALS */}
      <AddCommentModal
        openDialogWindow={openCommentDialogWindow}
        // viewer={viewer}
        setOpenDialogWindow={setOpenCommentDialogWindow}
        imgId={currentImgId}
        imgName={images?.find((e) => e.id === currentImgId)?.name}
        images={images}
        setImages={setImages}
      />
      <SelectCategoryModal
        openDialogWindow={openCategoriesDialogWindow}
        setOpenDialogWindow={setOpenCategoriesDialogWindow}
        imgId={currentImgId}
        imgName={images?.find((e) => e.id === currentImgId)?.name}
      />
    </>
  );
}
