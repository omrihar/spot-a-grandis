<template lang="pug">
  q-layout(view="lHh Lpr lFf")
    q-drawer(v-model="leftDrawerOpen" bordered content-class="bg-grey-2")
      q-list
        q-item-label(header) Menu

        q-item(clickable tag="a" to="/")
          q-item-section(avatar)
            q-icon( name="home")
          q-item-section
            q-item-label Home

        q-item(clickable tag="a" to="/report")
          q-item-section(avatar)
            q-icon( name="send")
          q-item-section
            q-item-label Report
            q-item-label(caption) Report a new sighting<

        q-item(clickable tag="a" to="/map")
          q-item-section(avatar)
            q-icon(name="map")
          q-item-section
            q-item-label View Map
            q-item-label(caption) See map with known sightings

    q-page-container
      router-view
</template>

<script>
import { openURL } from "quasar";

export default {
  name: "MyLayout",
  data() {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop
    };
  },
  methods: {
    openURL
  }
};
</script>

<style></style>
