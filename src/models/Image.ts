export class Image {
  id: string;
  name: string;
  comment: string;
  thumbnailUrl: string;
  imageUrl: string;

  constructor({ id = "", name = "", comment = "", thumbnail_url = "", image_url = "" }) {
    this.id = id;
    this.name = name;
    this.comment = comment;
    this.thumbnailUrl = thumbnail_url;
    this.imageUrl = image_url;
  }
}
