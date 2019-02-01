<template>
  <a @click.prevent="open">
    <slot></slot>
  </a>
</template>

<script>
export default {
  name: 'ElectronLink',
  props: {
    href: {
      default: '',
      required: true,
    },
  },

  methods: {
    open() {
      this.$electron.shell.openExternal(this.href);
    },
  },
};
</script>

<style scoped>
  a {
    cursor: pointer;
  }
</style>
