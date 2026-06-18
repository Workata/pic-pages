import { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";

// * icons
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";

// * api
import { useGetCategoryContent } from "hooks/api/categories/useGetCategoryContent";

// * components
import AddCommentModal from "components/modals/AddComment";
import SelectCategoryModal from "components/modals/category/SelectCategory";
import ImageGallery from "components/ImageGallery";
import { Box, Button } from "@mui/material";

import { BeforeSlideDetail, InitDetail, BeforeCloseDetail, AfterCloseDetail} from "lightgallery/lg-events";



export default function CategoriesAlbum() {
  const { currentCategory, currentImgId } = useParams();
  const [searchParams] = useSearchParams();
  const [openCategoriesDialogWindow, setOpenCategoriesDialogWindow] = useState(false);
  const [openCommentDialogWindow, setOpenCommentDialogWindow] = useState(false);
  const { getCategoryContent, images, setImages, previousPage, nextPage } = useGetCategoryContent();
  const navigate = useNavigate();
  const galleryRef = useRef<any>(null);


  const onGalleryInit = (detail: InitDetail) => {
    const lg = detail.instance;
    galleryRef.current = lg;
  };


  // TODO onBeforeClose doesnt work with next page
  // const onBeforeClose = (detail: BeforeCloseDetail) => {
  //   // clear url
  //   // if(closeWithoutHook) return;
  //   //  if (silentCloseRef.current) {
  //   //   silentCloseRef.current = false; // reset
  //   //   return;
  //   // }

  //   console.log("on before close")

  //   const page = searchParams.get("page");
  //   const url = page === null ? `#/categories/${currentCategory}` : `#/categories/${currentCategory}?page=${page}`;
  //   window.history.replaceState(null, "", url);
  //   // const url = page === null ? `/categories/${currentCategory}` : `/categories/${currentCategory}?page=${page}`;
  //   // navigate(url);
  // };

    const onAfterClose = (detail: AfterCloseDetail) => {

    console.log("on before close")

    const page = searchParams.get("page");
    const url = page === null ? `#/categories/${currentCategory}` : `#/categories/${currentCategory}?page=${page}`;
    window.history.replaceState(null, "", url);
    // const url = page === null ? `/categories/${currentCategory}` : `/categories/${currentCategory}?page=${page}`;
    // navigate(url);
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

    if (prevIndex + 1 === images.length && index === 0 && nextPage !== null) {
      galleryRef.current.closeGallery();
      const url = `/categories/${currentCategory}?page=${nextPage}`;
      navigate(url);
      return;
    }

    const url =
      page === null
        ? `#/categories/${currentCategory}/${image.id}`
        : `#/categories/${currentCategory}/${image.id}?page=${page}`;

    window.history.replaceState(null, "", url);
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


  {/* Assumption is that categories should contain only images (without folders) */}
  return (
    <>
      <Box
        sx={{
          width: "100%",
        }}
      >
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

          <ImageGallery
            images={images}
            onGalleryInit={onGalleryInit}
            // onBeforeClose={onBeforeClose}
            onAfterClose={onAfterClose}
            onBeforeSlide={onBeforeSlide}
            setOpenCategoriesDialogWindow={setOpenCategoriesDialogWindow}
            setOpenCommentDialogWindow={setOpenCommentDialogWindow}
          />
        </Box>
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
