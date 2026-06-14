import type { Image } from "models/Image";
import ThumbnailImage from "components/ThumbnailImage";


interface ThumbnailImageListProps {
  images: Image[];
}

export default function ThumbnailImageList({images}: ThumbnailImageListProps) {
  return (
    // css for images container is in `css/album.css` -> lg-react-element
    <>
      {images.map(
        (image: Image) => <ThumbnailImage image={image} key={image.id}/>
      )}
    </>
  );
}
