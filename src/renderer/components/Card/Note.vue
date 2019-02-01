<template>
  <div class="article-row note">
    <!-- <i title="note" class="fas fa-sticky-note textIcon article-icon"></i> -->
    <icon :icon="['fas', 'sticky-note']" class="textIcon article-icon" />
    <vue-markdown class="article-rowtext">{{ itemData }}</vue-markdown>
  </div>
</template>

<script>
import VueMarkdown from 'vue-markdown';

export default {
  name: 'Note',
  props: {
    itemData: {
      default: '',
      required: true,
    },
  },

  components: {
    VueMarkdown,
  },
};
</script>

<style>
  .note .article-rowtext p {
    margin: 0;
  }

  .note .article-rowtext > * {
    opacity: var(--alpha-idle);
  }

  article:hover .note .article-rowtext > * {
    opacity: var(--alpha-enabled);
  }
</style>
