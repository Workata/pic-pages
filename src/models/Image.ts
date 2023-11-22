
export class Image {
    id: string;
    name: string;
    thumbnailUrl: string;
    imageUrl: string;

    constructor ({id = '', name = '', thumbnail_url = '', image_url = ''}){
        this.id = id;
        this.name = name;
        this.thumbnailUrl = thumbnail_url;
        this.imageUrl = image_url;
     }
}
