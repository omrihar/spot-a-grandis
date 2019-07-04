<template lang="pug">
  q-page(padding)
    q-form
      q-btn.full-width(:label="$t('picture')" color="primary" icon="camera" size="xl")
      q-input(label="fill me" v-model="text")
</template>

<script>
export default {
  name: 'Report',
  data () {
    return {
      text: '',
    }
  }
}
</script>

<style>
</style>
