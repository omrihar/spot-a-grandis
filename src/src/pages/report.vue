<template lang="pug">
  q-page(padding id="report-page")
    div.column.q-pa-md.our-form
      .row
        q-btn.full-width(:label="$q.platform.is.cordova ? $t('picture') : $t('upload_picture')"
          outline color="primary" icon="camera" size="xl" @click="takePicture")
      .row(v-if="imageSrc !== ''")
        q-img(:src="imageSrc" width="100%")
      .row
        h5 {{ $t('where') }}
      .row
        q-btn-toggle(v-model="form.where" :options="whereOptions"
          size="md" unelevated @click="changeWhere")
      .row.q-pt-md(v-if="form.where=='manual'")
        q-input.col-5(:label="$t('lat')" outlined type="number"
          v-model.number="form.coordinates.lat")
        div.col
        q-input.col-5(:label="$t('lon')" outlined type="number"
          v-model.number="form.coordinates.lng")
      .row
        h5 {{ $t('when') }}
      .row
        q-input(filled v-model="form.when")
          template(v-slot:prepend="")
            q-icon.cursor-pointer(name="event")
              q-popup-proxy(transition-show="scale" transition-hide="scale")
                q-date(v-model="form.when" mask="YYYY-MM-DD HH:mm")
          template(v-slot:append="")
            q-icon.cursor-pointer(name="access_time")
              q-popup-proxy(transition-show="scale" transition-hide="scale")
                q-time(v-model="form.when" mask="YYYY-MM-DD HH:mm" format24h)
        q-btn.q-ml-md(:label="$t('now')" outline color="primary" @click="setNow")
      .row
        h5 {{ $t('how_many') }}
      .row
        q-btn-toggle(v-model="form.howMany" :options="countOptions" size="lg" unelevated)
      .row
        h5 {{ $t('adult_or_juvenile') }}
      .row
        q-btn-toggle(v-model="form.age"
           :options="form.howMany === '1' ? ageOptionsNoBoth : ageOptions" size="lg" unelevated)
      .row
        h5 {{ $t('comment') }}
      .row
        q-input.col(v-model="form.comment" filled type="textarea" :label="$t('comment')")
      .row.q-pt-xl
        q-btn(:label="$t('send')" :color="canSend ? 'primary' : 'black'" size="xl" @click="sendReport" :disable="!canSend" type="submit" :loading="sending")
          template(v-slot:loading)
            q-spinner-facebook
        q-btn(:label="$t('back')" color="primary" flat class="q-ml-sm"
        size="xl" to="/")
        q-dialog(v-model="showMap"
          persistent :maximized="true" transition-show="slide-up"
          transition-hide="slide-down"
        )
          q-card(class="bg-primary text-white")
            q-bar
              div Position the Gecko where you spotted it.
              q-space
              q-btn(dense flat icon="close" v-close-popup)
            q-card-section(style="padding: 0px;")
              l-map.fixed(:center="center", :zoom="zoom" @update:center="c => center = c" @update:zoom="z => zoom = z")
                l-tile-layer(:url="url")
                l-locatecontrol
                l-marker(:lat-lng="center" :icon="icon")

            q-card-actions(style="bottom:0px; position:fixed; width:100%" clear)
              q-bar(color="primary")
                q-btn.q-mx-md(flat size="md" @click="selectFromMap") Select
                q-btn(flat size="md") Cancel

</template>

<script>

import { date, uid } from 'quasar'
import L from 'leaflet'

export default {
  name: 'Report',
  data () {
    return {
      showMap: false,
      center: {lat: -20.250279813039555, lng: 57.674102783203125},
      zoom: 11,
      url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      icon: L.icon({
        iconUrl: 'statics/gecko.svg',
        iconSize: [32, 37],
        iconAnchor: [16, 37],
      }),
      countOptions: [
        {label: this.$t('one_grandis'), value: '1'},
        {label: this.$t('two_to_five'), value: '2-5'},
        {label: this.$t('more_than_five'), value: '>5'}
      ],
      ageOptions: [
        {label: this.$t('adult'), value: 'adult'},
        {label: this.$t('juvenile'), value: 'juvenile'},
        {label: this.$t('both'), value: 'both'},
        {label: this.$t('dunno'), value: 'dont_know'},
      ],
      ageOptionsNoBoth: [
        {label: this.$t('adult'), value: 'adult'},
        {label: this.$t('juvenile'), value: 'juvenile'},
        {label: this.$t('dunno'), value: 'dont_know'},
      ],
      haveLocation: false,
      locationFromMap: false,
      coordinates: {
        lat: null,
        lng: null,
      },
      sending: false,
      imageSrc: '',
      rawImage: '',
      form: {
        coordinates: {
          lat: null,
          lng: null,
        },
        howMany: null,
        when: date.formatDate(new Date(), 'YYYY-MM-DD HH:mm'),
        where: null,
        image_path: null,
        age: null,
        comment: null,
      },
    }
  },

  mounted () {
    this.checkGPS()
  },

  methods: {
    changeWhere () {
      if (this.form.where === 'gmaps') {
        if (this.haveLocation && (!this.locationFromMap)) {
          this.center = this.coordinates
          this.zoom = 15
        }
        this.showMap = true
      } else if (this.form.where === 'gps') {
        this.form.coordinates = this.coordinates
      }
    },
    selectFromMap () {
      this.$q.notify("Selected location from map")
      this.form.coordinates = this.center
      this.locationFromMap = true
      this.showMap = false
    },
    checkGPS () {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
          this.haveLocation = true
          this.coordinates = {lat: pos.coords.latitude, lng: pos.coords.longitude}
          if (this.form.where === 'gps') {
            this.form.coordinates = this.coordinates
          }
        });
      }
    },

    uploadPicture () {
      let s3 = this.$s3
      let image_path = `images/${uid()}.jpg`
      this.form.image_path = image_path
      this.$q.loading.show({
        delay: 400,
        message: 'Uploading to server...'
      })
      // Store in local storage
      this.$q.localStorage.set(image_path, 'base64' + this.rawImage);

      s3.upload({
        Key: image_path,
        Body: 'base64' + this.rawImage,
        ACL: 'private',
        ContentType: 'image/jpeg',
        ContentEncoding: 'base64',
      }, (err, data) => {
        this.$q.loading.hide()
        if (err) {
          this.$q.notify(`Failed to upload picture! ${err}`)
          console.log(err)
        } else {
          console.log(data)
        }
      })
    },

    takePicture () {
      let options = {
        quality: 30,
        allowEdit: false,
        correctOrientation: true,
        saveToPhotoAlbum: true,
        sourceType: window.Camera.PictureSourceType.CAMERA,
        destinationType: window.Camera.DestinationType.DATA_URL,
      }
      if (this.$q.platform.is.cordova) {
        navigator.camera.getPicture(data => {
          this.imageSrc = "data:image/jpeg;base64," + data
          this.rawImage = data
          this.uploadPicture()
        }, err => {
          this.$q.notify(err)
        }, options)
      }
    },

    setNow () {
      this.form.when = date.formatDate(new Date(), 'YYYY-MM-DD HH:mm')
    },

    sendReport () {
      this.sending = true
      if (this.form.where === "gps") {
        this.form.coordinates = this.coordinates
      }
      this.$store.dispatch('sendReport', JSON.parse(JSON.stringify(this.form)))
      this.sending = false
      this.$q.notify(this.$t("sent"))
      this.$router.push('/map')
    }
  },

  computed: {
    canSend () {
      return this.form.where !== null && this.howMany !== null
    },
    whereOptions () {
      if (this.haveLocation) {
        return [
          {label: this.$t('use_gps'), value: 'gps'},
          {label: this.$t('use_google_maps'), value: 'gmaps'},
          {label: this.$t('insert_manually'), value: 'manual'},
        ]
      } else {
        return [
          {label: this.$t('use_google_maps'), value: 'gmaps'},
          {label: this.$t('insert_manually'), value: 'manual'},
        ]
      }
    }
  }
}
</script>

<style lang="stylus">
@import "https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css";
.our-form
  max-width: 600px;

.our-form .q-radio__label
  font-size: 18px;

h5
  color: teal

</style>
