import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";

// * models
import { Folder } from "models/Folder";
import { ImageToView } from "./shared/imageToView.type";

// * mui
import { Box } from "@mui/material";
import { Button } from "@mui/material";
import { Link, useSearchParams } from "react-router-dom";

import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";

// * components
import ClickableFolder from "components/ClickableFolder";
import SelectCategoryModal from "components/modals/category/SelectCategory";
import AddCommentModal from "components/modals/AddComment";
import ThumbnailImageList from "components/ThumbnailImageList";

import { ExtendedImageViewer } from "utils/imageViewer";
import { ImageDownloader } from "utils/imageDownloader";

import categoryIcon from "icons/theatre-svgrepo-com.svg";
import downloadIcon from "icons/file-download-svgrepo-com.svg";
import commentIcon from "icons/comment.svg";

// * hooks
import { useGetFolderContent } from "hooks/api/images/useGetFolderContent";

import { AppContext } from "AppContext";

export default function Album() {
  const { currentFolderId, currentImgId } = useParams();
  const [searchParams] = useSearchParams();
  const [viewer, setViewer] = useState<ExtendedImageViewer>();
  const [openCategoriesDialogWindow, setOpenCategoriesDialogWindow] = useState(false);
  const [openCommentDialogWindow, setOpenCommentDialogWindow] = useState(false);
  const { getFolderContent, images, setImages, folders, nextPageToken } = useGetFolderContent();
  const navigate = useNavigate();
  const { tokenValue } = useContext(AppContext);

  const rightImgButton: HTMLElement = document.getElementsByClassName("arrowButton rightButton")[0] as HTMLElement;
  const leftImgButton: HTMLElement = document.getElementsByClassName("arrowButton leftButton")[0] as HTMLElement;
  const closeImgButton: HTMLElement = document.getElementsByClassName("defaultButton closeButton")[0] as HTMLElement;

  const goBack = () => {
    navigate(-1);
  };

  if (rightImgButton) {
    let idxPrev = Number(viewer!.getCurrentSelected());
    rightImgButton.onclick = () => {
      if (idxPrev >= images!.length - 1) return;
      insertImgIdToUrl(getImgIdFromIdx(idxPrev + 1));
    };
  }

  if (leftImgButton) {
    let idxPrev = Number(viewer!.getCurrentSelected());
    leftImgButton.onclick = () => {
      if (idxPrev <= 0) return;
      insertImgIdToUrl(getImgIdFromIdx(idxPrev - 1));
    };
  }

  if (closeImgButton) {
    closeImgButton.onclick = () => {
      clearUrlFromImg();
    };
  }

  const viewerIsClosed = () => {
    return document.getElementsByClassName("imageViewer visible").length === 0;
  };

  const insertImgIdToUrl = (imgId: string) => {
    if (!currentImgId || currentImgId !== imgId)
      if (searchParams.get("page") === null) navigate(`../album/${currentFolderId}/${imgId}`, { replace: true });
      else navigate(`../album/${currentFolderId}/${imgId}?page=${searchParams.get("page")}`, { replace: true });
  };

  const getImgIdFromIdx = (idx: number): string => {
    if (images) {
      return images[idx].id;
    }
    return "";
  };

  const clearUrlFromImg = () => {
    let pageQueryParam = searchParams.get("page");
    if (pageQueryParam === null) navigate(`../album/${currentFolderId}`, { replace: true });
    else
      navigate(`../album/${currentFolderId}?page=${pageQueryParam}`, {
        replace: true,
      });
  };

  // * open image viewer
  const viewImage = (idx: number) => {
    if (!images) {
      console.log("No images!");
      return;
    }

    let data: ImageToView[] = images.map((img) => ({
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

    setViewer(
      new ExtendedImageViewer({
        images: data,
        currentSelected: idx,
        showThumbnails: false, // TODO thumnbanils and arrow links need to be fixed
        buttons: buttons,
        nextPageUrl: nextPageToken ? `/album/${currentFolderId}?page=${nextPageToken}` : null,
      }),
    );
  };

  useEffect(() => {
    if (currentFolderId) {
      getFolderContent(currentFolderId, searchParams.get("page"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFolderId, searchParams.get("page")]);

  useEffect(() => {
    if (currentImgId && images && viewerIsClosed()) {
      console.log(`Currently selected img ID ${currentImgId}`);
      viewImage(images.findIndex((el) => el.id === currentImgId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images, currentImgId]);

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

        {folders.length !== 0 && (
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

        {images.length !== 0 && (
          <Box
            id="images-container"
            sx={{
              width: "100%",
              marginTop: "30px",
            }}
          >
            <ThumbnailImageList images={images} insertImgIdToUrl={insertImgIdToUrl} />
          </Box>
        )}
      </Box>

      {/* MODALS */}
      <SelectCategoryModal
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
      )}
    </>
  );
}
