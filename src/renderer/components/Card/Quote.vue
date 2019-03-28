<template>
  <div class="article-row">
    <icon :icon="['fas', 'comment']" class="textIcon article-icon" />
    <div class="article-rowtext">{{ itemData }}</div>
  </div>
</template>

<script>
export default {
  name: 'Quote',
  props: {
    itemData: {
      default: '',
      required: true,
    },
  },
};
</script>
