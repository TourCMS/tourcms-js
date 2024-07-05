import TourCMS from "./src/tourcms.js";

let tourCMS = new TourCMS(0, 'abc');
tourCMS.listBookings().catch((e) => console.error(e))
console.log('CARGADO')

export { tourCMS };
