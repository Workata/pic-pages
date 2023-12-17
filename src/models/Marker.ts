import { Coords } from "models/Coords";


export class Marker {
    coords: Coords;
    url: string;

    constructor ({coords = new Coords({}), url = ''}){
       this.coords = coords;
       this.url = url;
    }
}
