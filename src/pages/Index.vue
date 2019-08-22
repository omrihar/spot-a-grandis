<template>
  <q-page class="flex flex-center" id="page">
    <q-btn id="report-btn" to="/report" size="xl"
      color="primary">
        Report<br>sighting
    </q-btn>
  </q-page>
</template>

<style>

#page {
  background-image: url('~assets/background_horizontal.png');
  background-position: top center;
  background-repeat: no repeat;
  background-attachment: fixed;
  background-size: cover;
}
@media only screen and (orientation: portrait) {
  #page {
    background-image: url('~assets/background_vertical_scaled_smaller.png');
    background-position: center center;
    background-repeat: no repeat;
    background-attachment: fixed;
    background-size: cover;
  }
}

#report-btn {
  right: 30px;
  bottom: 90px;
  position: fixed;
  padding: 20px;
  font-weight: 300;
}
</style>

<script>
export default {
  name: "PageIndex",

  mounted () {
    this.$store.dispatch('uploadReports');
  }
};
</script>
