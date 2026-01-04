import type { Image } from "models/Image";

// TODO maybe try to round (border radius 5%) all images (even the contained ones)
export default function ThumbnailImageList(props: any) {
  return (
    <div
      id="thumbnailImageList"
      style={{
        marginTop: "20px",
        flexDirection: "row",
        display: "flex",
        flexWrap: "wrap",
        // gap: "20px 20px" /* row-gap column gap */,
        // gap: "2% 2%",
        columnGap: "2%",
        rowGap: "15px",
        // alignItems: "center",
        // justifyContent: "center",
      }}
    >
      {props.images.map((img: Image) => (
        <div
          id="imageContainer"
          style={{
            // width: "200px",
            // height: "200px",
            width: "18%", // 5 images in row

            // margin: "10px 10px 10px 10px",
            // maxWidth: "200px",
            // maxHeight: "200px",
            cursor: "pointer",
          }}
          key={img.name}
        >
          <img
            src={img.thumbnailUrl}
            alt={img.name}
            loading="lazy"
            referrerPolicy="no-referrer"
            style={{
              width: "100%",
              height: "100%",
              // maxWidth: "100%",
              // maxHeight: "100%",
              objectFit: "contain",
              // borderRadius: "5%",
              // width: "auto",
              // height: "auto",
            }}
            // * this is different depending of what is choosen: default album/categories
            onClick={() => props.insertImgIdToUrl(img.id)}
          />
        </div>
      ))}
    </div>
  );
}
