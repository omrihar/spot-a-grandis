<template lang="pug">
  q-page
    l-map(:center="center", :zoom="zoom" id="mymap" @update:center="c => center = c" @update:zoom="z => zoom = z")
      l-tile-layer(:url="url")
</template>
<script>

export default {
   name: 'Map',

  data () {
    return {
      center: [-20.250279813039555 , 57.674102783203125],
      zoom: 11,
      url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
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
