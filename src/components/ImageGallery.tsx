import type { Image } from "models/Image";
import ThumbnailImageList from "components/ThumbnailImageList";
import LightGallery from "lightgallery/react";
import { BeforeSlideDetail, AfterSlideDetail, AfterCloseDetail, InitDetail, BeforeCloseDetail} from "lightgallery/lg-events";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgFullscreen from "lightgallery/plugins/fullscreen";
import { useMemo, useContext } from "react";
import { AppContext } from "AppContext";

// * icons
import commentIcon from "icons/comment.svg";
import downloadIcon from "icons/file-download-svgrepo-com.svg";
import categoryIcon from "icons/theatre-svgrepo-com.svg";

// * utils
import { ImageDownloader } from "utils/imageDownloader";

interface ImageGalleryProps {
  images: Image[];
  onGalleryInit?: (detail: InitDetail) => void;
  onBeforeClose?: (detail: BeforeCloseDetail) => void;
  onAfterClose?: (detail: AfterCloseDetail) => void;
  onAfterSlide?: (detail:  AfterSlideDetail) => void;
  onBeforeSlide?: (detail: BeforeSlideDetail) => void;
  setOpenCommentDialogWindow: (value: React.SetStateAction<boolean>) => void;
  setOpenCategoriesDialogWindow: (value: React.SetStateAction<boolean>) => void
}

export default function ImageGallery(
  { images, onGalleryInit, onAfterClose, onAfterSlide, onBeforeSlide, setOpenCommentDialogWindow,
    setOpenCategoriesDialogWindow, onBeforeClose

  }: ImageGalleryProps) {


  const { tokenValue } = useContext(AppContext);
  const customButtonClsName: string = "lg-custom-btn";
  const licenseKey: string = "LIG-34EA249B-F46A-4AD8-A666-D99AEB4C9865";

  const addDownloadButton = (lg: any) => {
    const toolbar = lg.outer.find(".lg-toolbar").get();
    const downloadButtonId: string = "downloadButton";
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
    const commentButtonId: string = "commentButton";
    if (toolbar.querySelector(`#${commentButtonId}`)) return;

    const commentButton = document.createElement("button");
    commentButton.className = customButtonClsName;
    commentButton.id = commentButtonId;
    commentButton.innerHTML = `
      <img src="${commentIcon}" alt="comment"/>
    `;

    commentButton.onclick = () => setOpenCommentDialogWindow(true);
    toolbar.appendChild(commentButton);
  };

  const addCategoryButton = (lg: any) => {
    const toolbar = lg.outer.find(".lg-toolbar").get();
    const categoryButtonId: string = "categoryButton";
    if (toolbar.querySelector(`#${categoryButtonId}`)) return;

    const categoryButton = document.createElement("button");
    categoryButton.className = customButtonClsName;
    categoryButton.innerHTML = `
      <img src="${categoryIcon}" alt="category" id="${categoryButtonId}"/>
    `;

    categoryButton.onclick = () => setOpenCategoriesDialogWindow(true);
    toolbar.appendChild(categoryButton);
  };

  const onGalleryInitWrapper = (detail: any) => {
    const lg = detail.instance;
    if (onGalleryInit) onGalleryInit(detail);

    addDownloadButton(lg);
    // comment token value if check for testing
    if (tokenValue) {
      addCommentButton(lg);
      addCategoryButton(lg);
    }
  };

  const memoizedGallery = useMemo(() => {
  // This block will ONLY run once (or when the images array reference changes)
  return (
    images.length > 0 && (
      <LightGallery
        licenseKey={licenseKey}
        speed={500}
        plugins={[lgThumbnail, lgFullscreen]}
        preload={1} // change for 0 if there will be a problem with 'too many requests'
        download={false}
        closeOnTap={false}
        swipeToClose={false}
        toggleThumb={true}
        numberOfSlideItemsInDom={3}
        onInit={onGalleryInitWrapper}
        onBeforeClose={onBeforeClose}
        onAfterClose={onAfterClose}
        onAfterSlide={onAfterSlide}
        onBeforeSlide={onBeforeSlide}
      >
        <ThumbnailImageList images={images} />
      </LightGallery>
    )
  );
  }, [images]);

  return (
    <>
      {images.length > 0 && memoizedGallery}
    </>
  );
}
