// TODO check if useRef is still needed - duplicated buttons issue; now useMemo is used
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";

// * mui
import { Box, Button } from "@mui/material";

// * components
import ClickableFolder from "components/ClickableFolder";
import AddCommentModal from "components/modals/AddComment";
import SelectCategoryModal from "components/modals/category/SelectCategory";
import ImageGallery from "components/ImageGallery";

// * hooks
import { useGetFolderContent } from "hooks/api/images/useGetFolderContent";

// * models
import type { Folder } from "models/Folder";
import { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";

// * styles
import "css/album.css";
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";
import "lightgallery/css/lg-fullscreen.css";

import { BeforeSlideDetail, InitDetail, BeforeCloseDetail} from "lightgallery/lg-events";
import { LightGallery } from "lightgallery/lightgallery";


export default function Album() {
  const { currentFolderId, currentImgId } = useParams();
  const [searchParams] = useSearchParams();
  const [openCategoriesDialogWindow, setOpenCategoriesDialogWindow] = useState(false);
  const [openCommentDialogWindow, setOpenCommentDialogWindow] = useState(false);
  const { getFolderContent, images, setImages, folders, nextPageToken } = useGetFolderContent();
  const galleryRef = useRef<any>(null);
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  const onGalleryInit = (detail: InitDetail) => {
    const lg = detail.instance;
    galleryRef.current = lg;
  };

  const onBeforeClose = (detail: BeforeCloseDetail) => {
    // clear url
    const page = searchParams.get("page");
    // const url = page === null ? `#/album/${currentFolderId}` : `#/album/${currentFolderId}?page=${page}`;
    // window.history.replaceState(null, "", url);
    const url = page === null ? `/album/${currentFolderId}` : `/album/${currentFolderId}?page=${page}`;
    navigate(url);
  };

  const onBeforeSlide = (detail: BeforeSlideDetail) => {
    // on slide: 
    // 1) check if there is a need to switch to the next page (TODO possibly I can handle prev page as well)
    // 2) set correct URL

    const prevIndex = detail.prevIndex;
    const index = detail.index;
    const image = images[index];
    if (!image) return;
    const page = searchParams.get("page");

    if (prevIndex + 1 === images.length && index === 0 && nextPageToken !== null) {
      galleryRef.current.closeGallery(); ///manageCloseGallery();
      navigate(`/album/${currentFolderId}?page=${nextPageToken}`);
      return;
    }

    const url =
        page === null
          ? `#/album/${currentFolderId}/${image.id}`
          : `#/album/${currentFolderId}/${image.id}?page=${page}`;

    window.history.replaceState(null, "", url);
  };

  useEffect(() => {
    if (currentFolderId) {
      getFolderContent(currentFolderId, searchParams.get("page"));
    }
  }, [currentFolderId, searchParams.get("page")]);

  return (
    <>
      <Box
        sx={{
          width: "100%",
        }}
      >
        {images.length > 0 && (
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

        <ImageGallery
          images={images}
          onGalleryInit={onGalleryInit}
          onBeforeClose={onBeforeClose}
          onBeforeSlide={onBeforeSlide}
          setOpenCategoriesDialogWindow={setOpenCategoriesDialogWindow}
          setOpenCommentDialogWindow={setOpenCommentDialogWindow}
        />
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
