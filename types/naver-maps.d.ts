declare namespace naver.maps {
  export class LatLng {
    constructor(lat: number, lng: number);
  }

  export interface MapOptions {
    center: LatLng;
    zoom: number;
  }
  
  export class Size {
    constructor(width: number, height: number);
  }

  export class Map {
    // 타입만 선언하고 구현은 제거합니다.
    constructor(element: HTMLElement | string, options: MapOptions);
  }
}
