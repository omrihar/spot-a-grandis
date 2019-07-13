<template lang="pug">
  q-page(padding)
    div.column.q-pa-md.our-form
      .row
        q-btn.full-width(:label="$t('picture')" :disable="!hasGetUserMedia"
          outline color="primary" icon="camera" size="xl" @click="takePicture")
      .row
        h5 {{ $t('where') }}
      .row
        q-btn-toggle(v-model="form.where" :options="whereOptions" size="md" unelevated)
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


    q-dialog(v-model="openPictureDialog" @hide="stopVideo")
      q-card(style="width: 640px;min-width: 640px;")
        video(autoplay ref="videoStream" style="width: 640px; height: 480px;")
        q-card-section
          q-btn.full-width(color="teal" size="lg" icon="camera" :label="$t('picture')")
</template>

<script>
import { date } from 'quasar'

export default {
  name: 'Report',
  data () {
    return {
      openPictureDialog: false,
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
      }
    }
  },

  mounted () {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        this.haveLocation = true
        this.form.lat = pos.coords.latitude
        this.form.lon = pos.coords.longitude
      });
    }
  },

  methods: {
    async takePicture () {
      let stream = null;
      try {
        this.openPictureDialog = true
        stream = await navigator.mediaDevices.getUserMedia(this.contraints)
        this.$refs.videoStream.srcObject = stream
      } catch(err) {
        this.$q.notify({color: 'red', message: this.$t('camera_failed')})
      }
    },
    stopVideo () {

    },
    setNow () {
      this.when = date.formatDate(new Date(), 'YYYY-MM-DD HH:mm')
    }
  },

  computed: {
     hasGetUserMedia() {
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
