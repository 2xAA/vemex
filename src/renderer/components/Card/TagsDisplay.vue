<template>
  <div class="article-row" v-if="tags.length">
    <icon title="tags" :icon="['fas', 'tags']" class="textIcon article-icon" />
    <div class="article-rowtext">
      <span v-for="(tag, index) in orderedTags" :key="tag">
        <a
          class="article-taglink"
          :href="`#tag-${tag}`"
          @click.prevent="toggleFilter('tag', tag)"
        >{{ tag }}</a
        >{{ outputComma(index, tags.length) }}
      </span>
    </div>
  </div>
</template>

<script>
import toggleFilter from '@/components/mixins/toggle-filter';

export default {
  name: 'TagsDisplay',

  mixins: [toggleFilter],

  props: {
    tags: {
      type: Array,
      default: () => [],
    },
  },

  methods: {
    outputComma(index, length) {
      return index < length - 1 ? ', ' : '';
    },
  },

  computed: {
    orderedTags() {
      return [...this.tags].sort((a, b) => a > b);
    },
  },
};
</script>

