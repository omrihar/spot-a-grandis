<template lang="pug">
  q-page(padding)
    q-form(class="q-pa-md q-gutter-md")
      q-btn.full-width(:label="$t('picture')" flat color="primary" icon="camera" size="xl")
      q-btn-toggle(v-model="where", :options="whereOptions")
      div(style="max-width: 300px")
        q-input(filled v-model="when")
          template(v-slot:prepend="")
            q-icon.cursor-pointer(name="event")
              q-popup-proxy(transition-show="scale" transition-hide="scale")
                q-date(v-model="when" mask="YYYY-MM-DD HH:mm")
          template(v-slot:append="")
            q-icon.cursor-pointer(name="access_time")
              q-popup-proxy(transition-show="scale" transition-hide="scale")
                q-time(v-model="when" mask="YYYY-MM-DD HH:mm" format24h)
</template>

<script>
import { date } from 'quasar'

export default {
  name: 'Report',
  data () {
    return {
      where: 'gps',
      whereOptions: [
        {label: this.$t('use_google_maps'), value: 'gmaps'},
        {label: this.$t('use_gps'), value: 'gps'}
      ],
      when: date.formatDate(new Date(), 'YYYY-MM-DD HH:mm'),
    }
  }
}
</script>

<style>
</style>
