// import something here
import { LMap, LTileLayer, LMarker } from 'vue2-leaflet'
import { Icon } from 'leaflet'
import 'leaflet/dist/leaflet.css'

delete Icon.Default.prototype._getIconUrl

Icon.Default.mergeOptions({
  iconRetinaUrl: '~leaflet/dist/images/marker-icon-2x.png',
  iconUrl: '~leaflet/dist/images/marker-icon.png',
  shadowUrl: '~leaflet/dist/images/marker-shadow.png'
});

// "async" is optional
export default async ({ Vue }) => {
  Vue.component('l-map', LMap)
  Vue.component('l-tile-layer', LTileLayer)
  Vue.component('l-marker', LMarker)
}
