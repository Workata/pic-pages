export class Coords {
  longitude: number;
  latitude: number;

  constructor({ longitude = 0.0, latitude = 0.0 }) {
    this.longitude = longitude;
    this.latitude = latitude;
  }
}
