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
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";

// * components
import ClickableFolder from "components/ClickableFolder";
import SelectCategoryModal from "components/modals/category/SelectCategory";
import AddCommentModal from "components/modals/AddComment";
import ThumbnailImageList from "components/ThumbnailImageList";

import { ExtendedImageViewer } from "utils/imageViewer";

import categoryIcon from "icons/theatre-svgrepo-com.svg";
import commentIcon from "icons/comment.svg";

// * hooks
import { useGetFolderContent } from "hooks/api/images/useGetFolderContent";

import { AppContext } from "AppContext";

export default function Album() {
  const { currentFolderId, currentImgId } = useParams();
  const [searchParams] = useSearchParams();
  const [viewer, setViewer] = useState<ExtendedImageViewer>();
  const [openCategoriesDialogWindow, setOpenCategoriesDialogWindow] =
    useState(false);
  const [openCommentDialogWindow, setOpenCommentDialogWindow] = useState(false);
  const { getFolderContent, images, setImages, folders, nextPageToken } =
    useGetFolderContent();
  const navigate = useNavigate();
  const { tokenValue } = useContext(AppContext);

  const rightImgButton: HTMLElement = document.getElementsByClassName(
    "arrowButton rightButton",
  )[0] as HTMLElement;
  const leftImgButton: HTMLElement = document.getElementsByClassName(
    "arrowButton leftButton",
  )[0] as HTMLElement;
  const closeImgButton: HTMLElement = document.getElementsByClassName(
    "defaultButton closeButton",
  )[0] as HTMLElement;

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
      if (searchParams.get("page") === null)
        navigate(`../album/${currentFolderId}/${imgId}`, { replace: true });
      else
        navigate(
          `../album/${currentFolderId}/${imgId}?page=${searchParams.get(
            "page",
          )}`,
          { replace: true },
        );
  };

  const getImgIdFromIdx = (idx: number): string => {
    if (images) {
      return images[idx].id;
    }
    return "";
  };

  const clearUrlFromImg = () => {
    let pageQueryParam = searchParams.get("page");
    if (pageQueryParam === null)
      navigate(`../album/${currentFolderId}`, { replace: true });
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
      description:
        img.comment === "" ? img.name : `${img.name} - ${img.comment}`,
    }));

    let buttons: any;
    if (tokenValue)
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
      ];
    else buttons = [];

    setViewer(
      new ExtendedImageViewer({
        images: data,
        currentSelected: idx,
        showThumbnails: false, // TODO thumnbanils and arrow links need to be fixed
        buttons: buttons,
      }),
    );
  };

  useEffect(() => {
    if (currentFolderId)
      getFolderContent(currentFolderId, searchParams.get("page"));
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
        <Box
          id="buttons-container"
          sx={{
            position: "fixed",
            display: "flex",
            columnGap: "20px",
            marginBottom: "10px",
            width: "100%",
            backgroundColor: "#202124",
            paddingTop: "10px",
            paddingBottom: "10px",
            marginTop: "-37px",
            // borderStyle: 'dotted',
            // borderColor: 'red',
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

        <Box
          id="folders-container"
          sx={{
            display: "flex",
            columnGap: "20px",
            marginTop: "20px",
            paddingTop: "22px",
          }}
        >
          {folders &&
            folders.map((folder: Folder) => (
              <ClickableFolder
                key={folder.id}
                name={folder.name}
                link={`/album/${folder.id}`}
              />
            ))}
        </Box>

        {/* Images container */}
        <Box
          sx={{
            width: "100%",
          }}
        >
          {images && (
            <ThumbnailImageList
              images={images}
              insertImgIdToUrl={insertImgIdToUrl}
            />
          )}
        </Box>
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
