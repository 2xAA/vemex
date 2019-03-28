<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

  export default {
    name: 'vemex',
    async mounted() {
      await this.$store.dispatch('media/getDirectoryPath');
    },
  };
</script>

<style>
  /* CSS */
</style>
