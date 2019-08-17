// import something here
import { LMap, LTileLayer, LMarker, LIcon, LPopup } from 'vue2-leaflet'
import { Icon } from 'leaflet'
import Vue2LeafletLocatecontrol from 'vue2-leaflet-locatecontrol'
import 'leaflet/dist/leaflet.css'

delete Icon.Default.prototype._getIconUrl

Icon.Default.mergeOptions({
  iconRetinaUrl: 'assets/images/marker-icon-2x.png',
  iconUrl: 'assets/images/marker-icon.png',
  shadowUrl: 'assets/images/marker-shadow.png'
});

// "async" is optional
export default async ({ Vue }) => {
  Vue.component('l-map', LMap)
  Vue.component('l-tile-layer', LTileLayer)
  Vue.component('l-marker', LMarker)
  Vue.component('l-icon', LIcon)
  Vue.component('l-popup', LPopup)
  Vue.component('l-locatecontrol', Vue2LeafletLocatecontrol)
}
