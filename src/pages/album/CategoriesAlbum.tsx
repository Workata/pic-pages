import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { AppContext } from "AppContext";

// * icons
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import commentIcon from "icons/comment.svg";
import downloadIcon from "icons/file-download-svgrepo-com.svg";
import categoryIcon from "icons/theatre-svgrepo-com.svg";

// * api
import { useGetCategoryContent } from "hooks/api/categories/useGetCategoryContent";

// * utils
import { ImageDownloader } from "utils/imageDownloader";
import { ExtendedImageViewer } from "utils/imageViewer";

// * components
import AddCommentModal from "components/modals/AddComment";
import SelectCategoryModal from "components/modals/category/SelectCategory";
import ThumbnailImageList from "components/ThumbnailImageList";
import { Box, Button } from "@mui/material";

// * models
import type { ImageToView } from "./shared/imageToView.type";

export default function CategoriesAlbum() {
  const { currentCategory, currentImgId } = useParams();
  const [searchParams] = useSearchParams();
  const [viewer, setViewer] = useState<ExtendedImageViewer>();
  const [openCategoriesDialogWindow, setOpenCategoriesDialogWindow] = useState(false);
  const [openCommentDialogWindow, setOpenCommentDialogWindow] = useState(false);
  const { getCategoryContent, images, setImages, previousPage, nextPage } = useGetCategoryContent();
  const navigate = useNavigate();
  const { tokenValue } = useContext(AppContext);

  const rightImgButton: HTMLElement = document.getElementsByClassName("arrowButton rightButton")[0] as HTMLElement;
  const leftImgButton: HTMLElement = document.getElementsByClassName("arrowButton leftButton")[0] as HTMLElement;
  const closeImgButton: HTMLElement = document.getElementsByClassName("defaultButton closeButton")[0] as HTMLElement;

  // TODO arrows will not till image will be focused (clicked) - auto focus when image shows?
  if (rightImgButton) {
    const idxPrev = Number(viewer?.getCurrentSelected());
    rightImgButton.onclick = () => {
      if (idxPrev >= images.length - 1) return;
      insertImgIdToUrl(getImgIdFromIdx(idxPrev + 1));
    };
  }

  if (leftImgButton) {
    const idxPrev = Number(viewer?.getCurrentSelected());
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
    if (currentCategory) {
      if (searchParams.get("page") === null) {
        getCategoryContent(currentCategory);
      } else {
        getCategoryContent(currentCategory, Number(searchParams.get("page")!));
      }
    }
  }, [currentCategory, searchParams.get("page")]);

  useEffect(() => {
    if (currentImgId && images.length !== 0 && viewerIsClosed()) {
      console.log(`Currently selected img ID ${currentImgId}`);
      viewImage(images.findIndex((el) => el.id === currentImgId));
    }
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
            to={`/categories/${currentCategory}`}
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
            disabled={previousPage === null}
            component={Link}
            to={`/categories/${currentCategory}?page=${previousPage}`}
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
            disabled={nextPage === null}
            component={Link}
            to={`/categories/${currentCategory}?page=${nextPage}`}
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
          sx={{
            width: "100%",
          }}
        >
          {images && <ThumbnailImageList images={images} insertImgIdToUrl={insertImgIdToUrl} />}
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
