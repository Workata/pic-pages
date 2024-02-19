import ImageViewer from "components/imageViewer/imageViewer";

export class ExtendedImageViewer extends ImageViewer {
  getCurrentSelected(): number {
    return this.currentSelected;
  }
  updateComment(imgId: number, newComment: string): any {
    let imgIdx = this.images.findIndex((e: any) => e.id === imgId);

    if (!this.images[imgIdx].description?.includes("-")) {
      this.images[imgIdx].description =
        `${this.images[imgIdx].description} - ${newComment}`;
    } else {
      this.images[imgIdx].description = this.images[
        imgIdx
      ].description?.replace(new RegExp(" - .*"), ` - ${newComment}`);
    }
  }
}
