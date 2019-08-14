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
  background-image: url('~assets/background_vertical.png');
  background-position: center center;
  background-repeat: no repeat;
  background-attachment: fixed;
  background-size: cover;
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
  name: "PageIndex"
};
</script>
