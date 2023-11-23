import { getImageData } from "../services/images";
import { ImageData } from "../models/ImageData";


/**
 * Make request for image data and set a state related with them
 * @param setImageData
 * @return {void}
 */
export const fetchImageData = (imgId: string, setImageData: any): void => {
  getImageData(imgId, (res: any) => {
    setImageData(new ImageData(res.data));
  }, (err: any) => {
    if(err.response) {
      if(err.response.status === 404) setImageData(null);
    }
    console.log(err);
  });
}