import ImageViewer from "components/imageViewer/imageViewer";

export class ExtendedImageViewer extends ImageViewer {
  getCurrentSelected(): number {
    return this.currentSelected;
  }
  updateComment(imgId: number, newComment: string): any{
    let imgIdx = this.images.findIndex((e: any) => e.id === imgId);
    this.images[imgIdx].description = this.images[imgIdx].description?.replace(new RegExp(" - .*"), ` - ${newComment}`);
  }
}
