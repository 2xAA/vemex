<template>
  <div class="active-filters">
    <div
      class="active-filters__filter"
      v-if="$store.state.filters.done > -1"
      @click="clearDoneFilter"
    >
      <span class="active-filters__filter-text" v-if="$store.state.filters.done === 1">
        <icon :icon="types.true.icon" /> Done
      </span>
      <span class="active-filters__filter-text" v-else>
        <icon :icon="types.false.icon" /> Not done
      </span>
    </div>

    <div
      class="active-filters__filter"
      v-for="type in $store.state.filters.type"
      @click="removeFilter('type', type)"
    >
      <span class="active-filters__filter-text">
        <icon :icon="types[type].icon" /> {{ type }}
      </span>
    </div>

    <div
      class="active-filters__filter"
      v-for="tag in $store.state.filters.tag"
      @click="removeFilter('tag', tag)"
    >
      <span class="active-filters__filter-text">
        <icon :icon="types.tags.icon" /> {{ tag }}
      </span>
    </div>

    <div
      class="active-filters__filter"
      v-for="project in $store.state.filters.project"
      @click="removeFilter('project', project)"
    >
      <span class="active-filters__filter-text">
        <icon :icon="types.project.icon" /> {{ project }}
      </span>
    </div>
  </div>
</template>

<script>
import types from '../types';

export default {
  name: 'FilterDisplay',
  data() {
    return {
      types,
    };
  },

  methods: {
    clearDoneFilter() {
      this.$store.commit('filters/setDone', { done: -1 });
    },

    removeFilter(type, value) {
      const cap = `${type.charAt(0).toUpperCase()}${type.slice(1).toLowerCase()}`;
      const obj = {};
      obj[type] = value;

      this.$store.commit(`filters/toggle${cap}`, obj);
    },
  },
};
</script>

<style scoped>
.active-filters {
  padding: var(--size-item-elem-padding);
}

.active-filters__filter {
  display: inline-block;
  cursor: pointer;

  border-radius: var(--size-item-corner);
  padding: var(--size-item-elem-padding);
  font-size: var(--size-font-menutags);
  background: var(--color-itembg);
  margin-bottom: var(--size-item-elem-sep);
}

.active-filters__filter:not(last-child) {
  margin-right: var(--size-item-elem-sep);
}

.active-filters__filter-text {
  color: var(--color-item);
  opacity: var(--alpha-idle);
}


.active-filters__filter:hover .active-filters__filter-text {
  opacity: var(--alpha-enabled);
}
</style>
