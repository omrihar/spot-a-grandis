<template lang="pug">
  q-page(padding id="report-page" class="bg-grey-10 text-white")
    div.col-12.q-pa-md.our-form
      .row
        q-btn.col-5.my-custom-toggle(:label="$t('picture')"
           color="primary" icon="photo_camera" size="xl" @click="takePicture")
        .col
        q-btn.col-5.my-custom-toggle(:label="$t('upload_picture')"
           color="primary" icon="camera" size="xl" @click="choosePicture")
      .row(v-if="imageSrc !== ''")
        q-img(:src="imageSrc" width="100%")
          div.absolute-bottom.text-subtitle.text-center.q-pa-xs
            q-btn(@click="removePictue") Remove

      .row
        h5 {{ $t('where') }}
      .row
        q-btn-toggle.my-custom-toggle(v-model="form.where" :options="whereOptions"
          size="lg"  @click="changeWhere" unelevated
          text-color="lightgrey" color="lightgrey"
          toggle-color="primary"
          )
      .row.q-pt-md(v-if="form.where=='manual'")
        q-input.col-5(:label="$t('lat')" outlined type="number"
          v-model.number="form.coordinates.lat")
        div.col
        q-input.col-5(:label="$t('lon')" outlined type="number"
          v-model.number="form.coordinates.lng")
      .row
        h5 {{ $t('when') }}
      .row
        q-input(filled v-model="form.when" dark)
          template(v-slot:prepend="")
            q-icon.cursor-pointer(name="event")
              q-popup-proxy(transition-show="scale" transition-hide="scale")
                q-date(v-model="form.when" mask="YYYY-MM-DD HH:mm")
          template(v-slot:append="")
            q-icon.cursor-pointer(name="access_time")
              q-popup-proxy(transition-show="scale" transition-hide="scale")
                q-time(v-model="form.when" mask="YYYY-MM-DD HH:mm" format24h)
        q-btn.q-ml-md.my-custom-toggle(:label="$t('now')" outline color="lightgrey" @click="setNow")
      .row
        h5 {{ $t('how_many') }}
      .row
        q-btn-toggle.my-custom-toggle.col-12(v-model="form.howMany" :options="countOptions"
          size="lg" unelevated text-color="lightgrey" color="lightgrey" spread)
      .row
        h5 {{ $t('adult_or_juvenile') }}
      .row
        q-btn-toggle.col-12.my-custom-toggle(v-model="form.age"
           :options="form.howMany === '1' ? ageOptionsNoBoth : ageOptions"
           size="lg" unelevated spread text-color="lightgrey" color="lightgrey")
      .row
        h5 {{ $t('comment') }}
      .row
        q-input.col(v-model="form.comment" dark filled type="textarea" :label="$t('comment')")
      .row.q-pt-xl
        q-btn(:label="$t('send')" :color="canSend ? 'primary' : 'black'"
          size="xl" @click="sendReport" :disable="!canSend" type="submit"
          :loading="sending" icon="send")
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
                l-locatecontrol(:options="locationOptions")
                l-marker(:lat-lng="center" :icon="icon")

            q-card-actions(style="bottom:0px; position:fixed; width:100%" clear)
              q-bar(color="primary")
                q-btn.q-mx-md(flat size="md" @click="selectFromMap") Select
                q-btn(flat size="md" @click="cancelSelectFromMap") Cancel

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
      locationOptions: {
        flyTo: true,
        showPopup: false,
        keepCurrentZoomLevel: true,
        icon: 'fa fa-location-arrow',
      },
      icon: L.icon({
        iconUrl: 'statics/gecko.svg',
        iconSize: [32, 37],
        iconAnchor: [16, 37],
      }),
      whereOptions: [
        {label: this.$t('use_google_maps'), value: 'gmaps'},
        {label: this.$t('insert_manually'), value: 'manual'},
      ],

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
      savedImage: false,
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
    //this.checkGPS()
  },

  methods: {
    changeWhere () {
      if (this.form.where === 'gmaps') {
        if (this.haveLocation && (!this.locationFromMap)) {
          this.center = this.coordinates
          this.zoom = 15
        }
        this.showMap = true
      }
    },
    selectFromMap () {
      this.$q.notify("Selected location from map");
      this.form.coordinates = this.center;
      this.locationFromMap = true;
      this.showMap = false;
    },
    cancelSelectFromMap () {
      this.showMap = false;
    },

    checkGPS () {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
          this.haveLocation = true
          this.coordinates = {lat: pos.coords.latitude, lng: pos.coords.longitude}
        });
      }
    },

    savePicture () {
      let image_path = `images/${uid()}.jpg`;
      this.form.image_path = image_path;

      // Store in local storage
      this.$q.localStorage.set(image_path, 'base64' + this.rawImage);
      this.savedImage = true;
    },

    removePictue () {
      let image_path = this.form.image_path;
      this.form.image_path = '';
      this.rawImage = '';
      this.imageSrc = '';
      this.savedImage = false;
      this.$q.localStorage.remove(image_path);
    },

    uploadPicture () {
      if (!this.savedImage) {
        return;
      }
      let s3 = this.$s3;
      let image_path = this.form.image_path;
      this.$q.loading.show({
        delay: 400,
        message: 'Uploading image to server...'
      });

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
      });
    },

    takePicture () {
      let options = {
        quality: 30,
        allowEdit: true,
        correctOrientation: true,
        saveToPhotoAlbum: true,
        sourceType: window.Camera.PictureSourceType.CAMERA,
        destinationType: window.Camera.DestinationType.DATA_URL,
      }
      if (this.$q.platform.is.cordova) {
        navigator.camera.getPicture(data => {
          this.imageSrc = "data:image/jpeg;base64," + data
          this.rawImage = data
          this.savePicture()
        }, err => {
          this.$q.notify(err)
        }, options)
      }
    },

    choosePicture () {
      let options = {
        quality: 30,
        allowEdit: true,
        correctOrientation: true,
        saveToPhotoAlbum: true,
        sourceType: window.Camera.PictureSourceType.PHOTOLIBRARY,
        destinationType: window.Camera.DestinationType.DATA_URL,
      }
      if (this.$q.platform.is.cordova) {
        navigator.camera.getPicture(data => {
          this.imageSrc = "data:image/jpeg;base64," + data
          this.rawImage = data
          this.savePicture()
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
      this.$store.dispatch('sendReport', JSON.parse(JSON.stringify(this.form)))
      this.sending = false
      this.$q.notify(this.$t("sent"))
      this.uploadPicture()
      this.$router.push('/map')
    }
  },

  computed: {
    canSend () {
      return this.form.where !== null && this.howMany !== null
    },
  }
}
</script>

<style lang="stylus">
@import "https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css";
.our-form
  max-width: 600px;

.our-form .q-radio__label
  font-size: 18px;

.my-custom-toggle
  border: 1px solid #60c22b

h5
  color: lightgray;

</style>
