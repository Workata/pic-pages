import ImageViewer from "components/imageViewer/imageViewer";

export class ExtendedImageViewer extends ImageViewer {
  constructor(parameters: any) {
    super(parameters);
    this.nextPageUrl = parameters.nextPageUrl;
  }
  getCurrentSelected(): number {
    return this.currentSelected;
  }
  updateComment(imgId: number, newComment: string): any {
    const imgIdx = this.images.findIndex((e: any) => e.id === imgId);

    if (!this.images[imgIdx].description?.includes("-")) {
      this.images[imgIdx].description = `${this.images[imgIdx].description} - ${newComment}`;
    } else {
      this.images[imgIdx].description = this.images[imgIdx].description?.replace(/ - .*/, ` - ${newComment}`);
    }
  }
}
