import ImageViewer from "components/imageViewer/imageViewer";

export class ExtendedImageViewer extends ImageViewer {
  getCurrentSelected(): number {
    return this.currentSelected;
  }
}
