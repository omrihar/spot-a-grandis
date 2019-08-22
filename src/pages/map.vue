<template lang="pug">
  q-page
    l-map(:center="center", :zoom="zoom" id="mymap" @update:center="c => center = c" @update:zoom="z => zoom = z")
      l-tile-layer(:url="url" :attribution="attribution")
      l-marker(v-for="report in reports" :lat-lng="report.coordinates" :icon="icon", @click="markerClick(report)")
        l-popup
          q-list
            q-item(v-if="report.image_path !== null")
              q-item-section
                q-img(:src="image")
            q-item
              q-item-section
                q-item-label(caption) {{ $t('when') }}
                q-item-label {{ report.when }}
            q-item
              q-item-section
                q-item-label(caption) {{ $t('age') }}
                q-item-label {{ report.age }}
            q-item
              q-item-section
                q-item-label(caption) {{ $t('how_many') }}
                q-item-label {{ report.howMany }}
            q-item(v-if="report.comment !== null")
              q-item-section
                q-item-label(caption) {{ $t('comment') }}
                q-item-label {{ report.comment }}
      l-locatecontrol(:options="locationOptions")
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
        iconUrl: 'statics/gecko.svg',
        iconSize: [32, 37],
        iconAnchor: [16, 37],
      }),
      imageBase: 'data:image/jpeg;base64,',
      image: 'data:image/jpeg;base64',
      locationOptions: {
        flyTo: true,
        showPopup: false,
        keepCurrentZoomLevel: false,
        icon: 'fa fa-location-arrow',
      }
    }
  },

  mounted () {
    this.$store.dispatch('fetchReports');
    this.$store.dispatch('uploadReports');
  },

  methods: {
    markerClick(report) {
      if (report.image_path !== null) {
        if (this.$q.localStorage.has(report.image_path)) {
          this.image = this.$q.localStorage.getItem(report.image_path);
        } else {
          this.getImage(report.image_path);
        }
      }
    },

    getImage(path) {
      let s3 = this.$s3;
      return s3.getObject({ Key: path }, (err, data) => {
        if (err) {
          this.$q.notify(err)
        } else {
          this.image = data.Body;
          this.$q.localStorage.set(path, data.Body);
        }
      })
    }
  },

  computed: {
    reports () {
      return this.$store.state.reports;
    }
  }
}
</script>

<style lang="stylus">
@import "https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css";
#mymap {
  width: 100%
  height: 100%
  position: fixed
}
</style>
