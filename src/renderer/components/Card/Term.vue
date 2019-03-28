<template>
  <div class="article-row">
    <icon :icon="['fas', 'ribbon']" class="textIcon article-icon" />
    <div class="article-rowtext" v-html="output"></div>
  </div>
</template>

<script>
export default {
  name: 'Term',
  props: {
    itemData: {
      default: '',
      required: true,
    },
  },

  computed: {
    output() {
      const { itemData } = this;
      const string = String(itemData);
      const term = string.match(/^(.*):/);
      if (!term) return string;

      const restOfTheString = string.slice(term[1].length, string.length);

      return `<b>${term[1]}</b>${restOfTheString}`;
    },
  },
};
</script>
