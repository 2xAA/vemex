<template>
  <div class="lightbox" v-if="$store.state.modal.open" @click="closeModal">
    <div class="lightbox-back"></div>
    <img class="lightbox-img" :src="imagePath">
  </div>
</template>


<script>
export default {
  name: 'Lightbox',
  computed: {
    imagePath() {
      const item = this.$store.state.modal.content;

      if (item.indexOf('http') > -1) {
        return item;
      }
      return `file://${this.$store.state.media.directoryPath}/${item}`;
    },
  },
  methods: {
    closeModal() {
      this.$store.dispatch('modal/close');
    },
  },
};
</script>

<style>
.lightbox {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 300;
  width: 100%;
  height: 100%;
  align-items: center;
}

.lightbox-back {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  cursor: var(--cursor-minimizeImage);
}

.lightbox-img {
  position: absolute;
  top: 50%;
  left: 50%;
  max-height: 100vh;
  max-width: 100vw;
  transform: translateY(-50%) translateX(-50%);
  vertical-align: middle;
  cursor: var(--cursor-minimizeImage);
}
</style>
