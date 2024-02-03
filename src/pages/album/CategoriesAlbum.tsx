// TODO update URL based on current pic variable
import { useState, useEffect, useContext } from "react";

import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

// * models
import { ImageToView } from "./shared/imageToView.type";

// * components
import { ExtendedImageViewer } from "utils/imageViewer";
import { Box } from "@mui/material";
import SelectCategoryModal from "components/modals/category/SelectCategory";
import AddCommentModal from "components/modals/AddComment";
import ThumbnailImageList from "components/ThumbnailImageList";

import categoryIcon from "icons/theatre-svgrepo-com.svg";
import commentIcon from "icons/comment.svg";
import { useGetCategoryContent } from "hooks/api/categories/useGetCategoryContent";
import { AppContext } from "AppContext";

export default function CategoriesAlbum() {
  const { currentCategory, currentImgId } = useParams();
  const [viewer, setViewer] = useState<ExtendedImageViewer>();
  const [openCategoriesDialogWindow, setOpenCategoriesDialogWindow] =
    useState(false);
  const [openCommentDialogWindow, setOpenCommentDialogWindow] = useState(false);
  const { getCategoryContent, images } = useGetCategoryContent();
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
      navigate(`../categories/${currentCategory}/${imgId}`, { replace: true });
  };

  const getImgIdFromIdx = (idx: number): string => {
    if (images) {
      return images[idx].id;
    }
    return "";
  };

  const clearUrlFromImg = () => {
    navigate(`../categories/${currentCategory}`, { replace: true });
  };

  // * open image viewer
  const viewImage = (idx: number) => {
    if (!images) {
      console.log("No images!");
      return;
    }

    let data: ImageToView[] = images.map((img) => ({
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
    if (currentCategory) getCategoryContent(currentCategory);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCategory]);

  useEffect(() => {
    if (currentImgId && images && viewerIsClosed()) {
      console.log(`Currently selected img ID ${currentImgId}`);
      viewImage(images.findIndex((el) => el.id === currentImgId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images, currentImgId]);

  return (
    <>
      {/* Assumption is that categories should contain only images (without folders) */}
      <Box
        sx={{
          width: "100%",
        }}
      >
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
      />

      <AddCommentModal
        openDialogWindow={openCommentDialogWindow}
        setOpenDialogWindow={setOpenCommentDialogWindow}
        imgId={currentImgId}
      />
    </>
  );
}
