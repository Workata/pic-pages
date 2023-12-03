import { Category } from "../models/Category";


export class ImageData {
    id: string;
    categories: Array<Category>;
    comment: string;

    constructor ({id = '', categories = [], comment = ''}){
        this.id = id;
        this.categories = categories;
        this.comment = comment;
     }
}
