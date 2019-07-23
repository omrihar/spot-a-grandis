<template lang="pug">
  q-page
    l-map(:center="center", :zoom="zoom" id="mymap" @update:center="c => center = c" @update:zoom="z => zoom = z")
      l-tile-layer(:url="url" :attribution="attribution")
      l-marker(:lat-lng="center" :icon="icon")
</template>
<script>

import L from 'leaflet'

export default {
   name: 'Map',

  data () {
    return {
      center: [-20.250279813039555 , 57.674102783203125],
      zoom: 11,
      url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      attribution: 'Icons made by <a href="https://www.flaticon.com/authors/smashicons" title="Smashicons">Smashicons</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a>',
      icon: L.icon({
        iconUrl: 'assets/images/gecko.svg',
        iconSize: [32, 37],
        iconAnchor: [16, 37],
      }),
    }
  }
}
</script>

<style lang="stylus">
#mymap {
  width: 100%
  height: 100%
  position: fixed
}
</style>
