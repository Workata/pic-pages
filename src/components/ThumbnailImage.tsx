import type { Image } from "models/Image";

interface ThumbnailImageProps {
  image: Image;
}

export default function ThumbnailImage({image}: ThumbnailImageProps) {
  return (
    <a
      /* data-sub-html={image.name} - image comment */
      key={image.id}
      href={image.imageUrl}
      data-src={image.imageUrl}
      data-sub-html={image.comment}
      referrerPolicy="no-referrer"
      style={{
        
      }}
    >
      <img alt={image.name} src={image.thumbnailUrl} loading="lazy" referrerPolicy="no-referrer" />
    </a>
  );
}
