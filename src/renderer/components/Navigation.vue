<template>
  <nav>
    <div class="nav-itemgroup">
      <a href="#" class="nav-item" title="total"
        ><div class="nav-itemcount">{{ items.length }}</div>
        <icon :icon="['fas', 'asterisk']" class="nav-itemicon"
      /></a>
    </div>

    <div class="nav-itemgroup">
      <a href="#add" @click.prevent="showOverlay" class="nav-item"><b>a</b>dd</a>
    </div>

    <div class="nav-itemgroup">
      <a href="#done-true" class="nav-item" @click.prevent="filterDone(1)" title="done"
        ><div class="nav-itemcount">{{ this.$store.getters['cards/done'].length }}</div>
        <icon :icon="['fas', 'check']" class="nav-itemicon"/></a
      ><a href="#done-false" class="nav-item" @click.prevent="filterDone(0)" title="not done"
        ><div class="nav-itemcount">{{ this.$store.getters['cards/notDone'].length }}</div>
        <icon :icon="['fas', 'times']" class="nav-itemicon"/></a>
    </div>

    <div class="nav-itemgroup">
      <a
        :href="`#type-${type}`"
        v-for="(count, type) in orderedTypes"
        :key="type"
        @click.prevent="filterType(type)"
        class="nav-item"
        :title="type"
      ><div class="nav-itemcount">{{ count }}</div><icon
        :icon="icons[type].icon"
        class="nav-itemicon"
      /></a>
    </div>
    <!--
      <div class="nav-itemgroup">
        <a href="#term" class="nav-item"
          ><div class="nav-itemcount">68</div>
          <i title="terms" class="nav-itemicon fas fa-ribbon"></i
        ></a>
      </div>
    -->
    <div class="nav-itemgroup">
      <div class="nav-tagcontainer">
        <icon :icon="['fas', 'tag']" class="nav-tagicon" />
        <a
          class="nav-tag"
          :href="`#tag-${tag}`"
          v-for="(count, tag) in orderedTags"
          :key="tag"
          @click.prevent="filterTag(tag)"
        >
          <div class="nav-tagcount">{{ count }}</div>
          <div class="nav-taglabel">{{ tag }}</div>
        </a>
      </div>
    </div>

    <div class="nav-itemgroup">
      <div class="nav-tagcontainer">
        <icon :icon="['fas', 'leaf']" class="nav-tagicon" />
        <a
          class="nav-tag"
          :href="`#tag-${project}`"
          v-for="(count, project) in orderedProjects"
          :key="project"
          @click.prevent="filterProject(project)"
        >
          <div class="nav-tagcount">{{ count }}</div>
          <div class="nav-taglabel">{{ project }}</div>
        </a>
      </div>
    </div>
  </nav>
</template>


<script>
import icons from '@/types';

export default {
  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      icons,
    };
  },
  computed: {
    orderedTags() {
      const tags = this.$store.getters['cards/tags'];
      return Object.keys(tags)
        .sort((a, b) => tags[b] - tags[a] || a.localeCompare(b))
        .reduce((obj, key) => {
          obj[key] = tags[key];
          return obj;
        }, {});
    },

    orderedTypes() {
      const types = this.$store.getters['cards/types'];
      return Object.keys(types)
        .sort((a, b) => types[b] - types[a] || a.localeCompare(b))
        .reduce((obj, key) => {
          obj[key] = types[key];
          return obj;
        }, {});
    },

    orderedProjects() {
      const projects = this.$store.getters['cards/projects'];
      return Object.keys(projects)
        .sort((a, b) => projects[b] - projects[a] || a.localeCompare(b))
        .reduce((obj, key) => {
          obj[key] = projects[key];
          return obj;
        }, {});
    },
  },
  methods: {
    filterTag(tag) {
      this.$store.commit('filters/toggleTag', { tag });
    },

    filterType(type) {
      this.$store.commit('filters/toggleType', { type });
    },

    filterProject(project) {
      this.$store.commit('filters/toggleProject', { project });
    },

    filterDone(done) {
      if (done === this.$store.state.filters.done) {
        this.$store.commit('filters/setDone', { done: -1 });
      } else {
        this.$store.commit('filters/setDone', { done });
      }
    },

    showOverlay() {
      this.$emit('showOverlay');
    },
  },
};
</script>

<style>
/* NAV */
nav {
  padding-top: var(--size-grid-gutter);
  background: var(--color-bg);
  opacity: var(--alpha-idle);
  width: var(--size-menu);
  position: fixed;
  height: 100%;
  z-index: 100;
  left: 0px;
  top: 0px;
  overflow-y: scroll; /*allow menu to scroll on small screens*/
}
nav:hover {
  opacity: var(--alpha-ascent);
}
nav::-webkit-scrollbar {
  display: none;
}
.nav-itemgroup {
  padding-bottom: var(--size-menu-itemgroup-sepv);
  width: 100%;
  float: left;
}
.nav-item {
  padding-bottom: calc(var(--size-menu-item-sepv) / 2);
  padding-top: calc(var(--size-menu-item-sepv) / 2);
  font-size: var(--size-font-menutypes);
  opacity: var(--alpha-idle);
  color: var(--color-menu);
  text-align: center;
  margin: 0px auto;
  width: 100%;
  float: left;
}
.nav-item:hover {
  color: var(--color-menuascent);
  opacity: var(--alpha-ascent);
}
.nav-itemcount {
  padding-right: calc(var(--size-menu-item-seph) / 2);
  display: inline-block;
  text-align: right;
  float: left;
  width: 50%;
}
.nav-itemicon {
  margin-left: calc(var(--size-menu-item-seph) / 2);
  margin-top: calc(var(--size-font-bodytypes) / 10);
  width: calc(var(--size-font-bodytypes) * 1.25);
  display: inline-block;
  text-align: center;
  float: left;
}
.nav-tagcontainer {
  margin: 0 auto;
  display: table;
}
.nav-tagicon {
  padding-bottom: calc(var(--size-menu-item-sepv) / 2);
  padding-top: calc(var(--size-menu-item-sepv) / 2);
  font-size: var(--size-font-menutags);
  opacity: var(--alpha-idle);
  color: var(--color-menu);
  display: table-row;
  text-align: center;
  width: 100%;
  height: unset;
  margin: 0 auto;
  display: block;
}
.nav-tag {
  padding-bottom: calc(var(--size-menu-tag-sepv) / 2);
  padding-top: calc(var(--size-menu-tag-sepv) / 2);
  font-size: var(--size-font-body);
  opacity: var(--alpha-idle);
  color: var(--color-menu);
  width: 100%;
  float: left;
  clear: left;
}
.nav-tagcount {
  padding-right: var(--size-menu-tag-sepv);
  text-align: right;
  float: left;
}
.nav-taglabel {
  text-align: left;
  float: left;
}
.nav-tag:hover {
  opacity: var(--alpha-ascent);
}
.nav-tag:hover .nav-taglabel {
  background-color: var(--color-itemascent);
  color: var(--color-menubg);
}
.nav-tag:hover .nav-tagcount {
  color: var(--color-itemascent);
}
</style>
