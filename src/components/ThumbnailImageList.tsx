import { Image } from "models/Image";
import { ImageList, ImageListItem } from "@mui/material";

export default function ThumbnailImageList(props: any) {
  return (
    <ImageList
      // ? https://mui.com/material-ui/react-image-list/
      variant="masonry"
      cols={11} // number of columns reflects images (thumbnails) size
      gap={12}
      id="images"
    >
      {props.images.map((img: Image) => (
        <ImageListItem
          key={img.id}
          sx={{
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
            referrerPolicy="no-referrer"
            // this is different depending of what is choosen: default album/categories
            onClick={() => props.insertImgIdToUrl(img.id) }
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
}
