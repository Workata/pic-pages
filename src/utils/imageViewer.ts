import ImageViewer from "awesome-image-viewer";

export class ExtendedImageViewer extends ImageViewer {
  getCurrentSelected(): number {
    return this.currentSelected;
  }
}
