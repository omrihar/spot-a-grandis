<template>
  <q-page padding>
    <img :src="one"  width="500px" height="500px"/>
    <img :src="two" width="500px" height="500px"/>
    <img :src="three" width="500px" height="500px"/>
    <img :src="four" width="500px" height="500px"/>
  </q-page>
</template>

<script>
export default {
   name: 'Test',
  data () {
    return {
      one: '',
      two: '',
      three: '',
      four: ''
    }
  },

  mounted () {
    this.$s3.getObject({Key: 'images/159aacab-7847-1d77-f64c-2833946bfcb7.jpg'},
      (err, data) => {
        console.log(err);
        this.one = data.Body;
      }
    )
  }
}
</script>

<style>
</style>
