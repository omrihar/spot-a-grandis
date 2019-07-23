<template lang="pug">
  q-page(padding id="report-page")
    div.column.q-pa-md.our-form
      .row
        q-btn.full-width(:label="$q.platform.is.cordova ? $t('picture') : $t('upload_picture')"
          outline color="primary" icon="camera" size="xl" @click="takePicture")
      .row(v-if="imageSrc !== ''")
        img(:src="imageSrc" width="100%")
      .row
        h5 {{ $t('where') }}
      .row
        q-btn-toggle(v-model="form.where" :options="whereOptions" size="md" unelevated)
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

</template>

<script>
import { date, uid } from 'quasar'
import AWS from 'aws-sdk'

export default {
  name: 'Report',
  data () {
    return {
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
      aws: {
        region: 'eu-central-1',
        identityPoolId: 'eu-central-1:9db6d4e1-6350-451d-abad-6fdc69fa1bd1',
        bucket: 'spot-a-grandis',
        s3: null,
      }
    }
  },

  mounted () {
    this.checkGPS()
    this.initializeAWS()
  },

  methods: {
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

    initializeAWS () {
      // Initialize the Amazon Cognito credentials provider
      AWS.config.region = this.aws.region; // Region
      AWS.config.credentials = new AWS.CognitoIdentityCredentials({
          IdentityPoolId: this.aws.identityPoolId
      })
      this.aws.s3 = new AWS.S3({
        apiVersion: '2006-03-01',
        params: {Bucket: this.aws.bucket}
      })
    },

    uploadPicture () {
      let s3 = this.aws.s3
      let image_path = `images/${uid()}.jpg`
      this.form.image_path = image_path
      this.$q.loading.show({
        delay: 400,
        message: 'Uploading to server...'
      })
      s3.upload({
        Key: image_path,
        Body: this.rawImage,
        ACL: 'private',
        ContentType: 'image/jpeg;base64'
      }, (err, data) => {
        this.$q.loading.hide()
        if (err) {
          this.$q.notify(`Failed to upload picture! ${err}`)
          console.log(err)
        } else {
          console.log(data)
          this.$q.notify(`Uploaded file to ${image_path}`)
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
      console.log(JSON.parse(JSON.stringify(this.form)))
      this.sending = false
      this.$q.notify(this.$t("sent"))
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
.our-form
  max-width: 600px;

.our-form .q-radio__label
  font-size: 18px;

h5
  color: teal

</style>
