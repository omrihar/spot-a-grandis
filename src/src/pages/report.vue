<template lang="pug">
  q-page(padding id="report-page")
    div.column.q-pa-md.our-form
      .row
        q-btn.full-width(:label="$q.platform.is.cordova ? $t('picture') : $t('upload_picture')"
          outline color="primary" icon="camera" size="xl" @click="takePicture")
      .row(v-if="form.imageSrc !== ''")
        img(:src="form.imageSrc" width="100%")
      .row
        h5 {{ $t('where') }}
      .row
        q-btn-toggle(v-model="form.where" :options="whereOptions" size="md"
          unelevated @change="checkGPS")
      .row.q-pt-md(v-if="form.where=='manual'")
        q-input.col-5(:label="$t('lat')" outlined type="number"
          v-model.number="form.lat")
        div.col
        q-input.col-5(:label="$t('lon')" outlined type="number"
          v-model.number="form.lon")
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
        q-btn-toggle(v-model="form.count" :options="countOptions" size="lg" unelevated)
      .row.q-pt-xl
        q-btn(:label="$t('send')" color="primary" size="xl")
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
      haveLocation: false,
      contraints: {video: true},
      form: {
        lat: 0.0,
        lon: 0.0,
        count: '1',
        when: date.formatDate(new Date(), 'YYYY-MM-DD HH:mm'),
        where: 'gps',
        imageSrc: '',
        fname: '',
        rawImage: '',
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
          this.form.lat = pos.coords.latitude
          this.form.lon = pos.coords.longitude
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
      let fname = `images/${uid()}.jpg`
      this.form.fname = fname
      this.$q.loading.show({
        delay: 400,
        message: 'Uploading to server...'
      })
      s3.upload({
        Key: fname,
        Body: this.form.rawImage,
        ACL: 'private',
        ContentType: 'image/jpeg;base64'
      }, (err, data) => {
        this.$q.loading.hide()
        if (err) {
          this.$q.notify(`Failed to upload picture! ${err}`)
          console.log(err)
        } else {
          console.log(data)
          this.$q.notify(`Uploaded file to ${fname}`)
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
          this.form.imageSrc = "data:image/jpeg;base64," + data
          this.form.rawImage = data
          this.uploadPicture()
        }, err => {
          this.$q.notify(err)
        }, options)
      }
    },

    setNow () {
      this.when = date.formatDate(new Date(), 'YYYY-MM-DD HH:mm')
    }
  },

  computed: {
     hasGetUserMedia() {
       if (this.$q.platform.is.cordova) {
         return true
       }
       return !!(navigator.mediaDevices &&
         navigator.mediaDevices.getUserMedia);
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

</style>
