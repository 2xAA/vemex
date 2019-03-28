<template>
  <article class="article" :class="{ 'article-wide': wide }" :data-article-id="itemData.id">
    <div class="article-containerupper" :class="{ 'article-containerupper-image': isImage }">
      <electron-link
        class="article-link"
        :href="url"
        rel="noopener noreferrer"
        target="_blank"
        v-if="url"
      >
        <header class="article-title">{{ title }}</header>
        <div class="article-linkcontainer">
          <div class="article-linkicon">
            <icon title="link" :icon="['fas', 'link']" class="textIcon article-icon" />
          </div>
          <div class="article-linktitle">{{ itemData.url | domain }}</div>
        </div>
      </electron-link>
      <header v-else class="article-title">{{ title }}</header>

      <div class="article-typecontainer">
        <a class="article-type" href="#done-false" @click.prevent="handleDone">
          <icon title="false" :icon="doneIcon" class="textIcon article-typeicon" />
        </a>
        <a
          class="article-type"
          :href="`#type-${type}`"
          v-if="icon"
          @click.prevent="toggleFilter('type', type)"
        >
          <icon :title="type" :icon="icon" class="textIcon article-typeicon" />
        </a>
      </div>
    </div>

    <div v-if="isImage" class="article-imageType-imgContainer" @click="openModal">
      <div class="image-overlay"></div>
      <img class="article-image-img" :src="imagePath">
      <div class="article-containerlower-image">
        <div class="article-row">
          <i title="author" class="fas fa-user textIcon article-icon"></i>
          <div class="article-rowtext">{{ title }}</div>
        </div>
        
        <tags-display :tags="tags"></tags-display>

        <div class="article-row article-file">
          <i title="file" class="fas fa-folder-open textIcon article-icon"></i>
          <div class="article-rowtext">
            <electron-link class="article-file-link" :href="itemData.image">{{ itemData.image | filename }}</electron-link>
          </div>
        </div>
      </div>
    </div>

    <div class="article-containerlower" v-if="(isImage && items.length > 1) || !isImage">
      <div class="article-row" v-if="!isImage">
        <icon title="date" :icon="['fas', 'clock']" class="textIcon article-icon" />
        <div class="article-rowtext">{{ formattedDate }}</div>
      </div>

      <tags-display :tags="tags" v-if="!isImage"></tags-display>

      <div class="article-row" v-if="project">
        <icon title="project" :icon="['fas', 'leaf']" class="textIcon article-icon" />
        <div class="article-rowtext">
          <a
            class="article-taglink"
            :href="`#proj-${project.toLowerCase()}`"
            @click.prevent="toggleFilter('project', project)"
          >
            {{ project }}
          </a>
        </div>
      </div>
      
      <component
        v-for="(item, index) in items"
        :key="`${item.type}-${index}`"
        :is="item.type"
        :itemData="item.data"
      />
    </div>
  </article>
</template>

<script>
import contextMenu from 'electron-context-menu';

import toggleFilter from '@/components/mixins/toggle-filter';

import ElectronLink from '../ElectronLink';
import store from '../../store';

import quote from './Quote';
import note from './Note';
import term from './Term';
import tagsDisplay from './TagsDisplay';

import types from '../../types';

const cardMetaKeys = [
  'title',
  'tags',
  'date',
  'type',
  'url',
  'project',
  'wide',
  'done',
  'id',
];

const metaComputed = cardMetaKeys.reduce((obj, meta) => {
  obj[meta] = function metaCompute() {
    return this.itemData[meta];
  };

  return obj;
}, {});

function getTargetElement(x, y, selector) {
  const elems = document.elementsFromPoint(x, y).filter(selector) || [];
  return elems;
}

contextMenu({
  prepend(params) {
    const elems = getTargetElement(
      params.x,
      params.y,
      item => item.classList.contains('article'),
    );

    if (!elems[0]) return [];
    const index = parseInt(elems[0].dataset.articleId, 10);
    const card = store.state.cards[index];

    return [
      {
        label: 'Wide',
        type: 'checkbox',
        checked: store.state.cards[index].wide,
        click() {
          store.commit('cards/update', { index, card: { wide: !card.wide } });
        },
      },
      {
        label: 'Delete',
        visible: !!elems.length,
        click() {
          store.dispatch('cards/remove', { index });
        },
      },
    ];
  },
});

export default {
  name: 'Card',
  components: {
    ElectronLink,
    quote,
    note,
    term,
    tagsDisplay,
  },

  mixins: [toggleFilter],

  props: {
    itemData: {
      default: () => {},
      required: true,
    },
  },

  computed: {
    ...metaComputed,

    items() {
      const { itemData } = this;
      const keys = Object.keys(itemData);
      let items = [];

      for (let i = 0; i < keys.length; i += 1) {
        const key = keys[i];
        // eslint-disable-next-line no-continue
        if (cardMetaKeys.indexOf(key) > -1) continue;

        const datum = itemData[key];

        if (Array.isArray(datum)) {
          items = items.concat(datum.map(item => ({ type: key, data: item })));
        } else {
          items.push({ type: key, data: datum });
        }
      }

      return items;
    },

    icon() {
      if (this.itemData.type in types) return types[this.itemData.type].icon;
      return false;
    },

    formattedDate() {
      const { date } = this;
      const realDate = new Date(date);
      const month = realDate.getUTCMonth() + 1;
      const day = realDate.getUTCDate();
      const year = realDate.getUTCFullYear();

      return `${year}-${month}-${day}`;
    },

    doneIcon() {
      if (this.done) return ['fas', 'check'];
      return ['fas', 'times'];
    },

    isImage() {
      return !!this.itemData.image;
    },

    imagePath() {
      if (this.itemData.image.indexOf('http') > -1) {
        return this.itemData.image;
      }
      return `file://${this.$store.state.media.directoryPath}/${this.itemData.image}`;
    },
  },

  methods: {
    handleDone() {
      this.$store.commit('cards/update', {
        index: this.itemData.id,
        card: {
          done: !this.done,
        },
      });
    },

    openModal() {
      this.$store.dispatch('modal/open', { content: this.itemData.image, type: 'image' });
    },
  },

  filters: {
    domain(value) {
      const matches = value.match(/^https?:\/\/([^/?#]+)(?:[/?#]|$)/i);
      return (matches && matches[1]) || value;
    },

    filename(value) {
      const matches = value.match(/[^/]*$/i);
      return (matches && matches[0]) || value;
    },
  },
};
</script>

<style>
/* GRID ITEM */
.article,
.article-wide {
  border-radius: var(--size-item-corner);
  margin-bottom: var(--size-grid-gutter);
  background: var(--color-itembg);
  width: var(--size-grid-column);
  text-decoration: none;
  position: relative;
  float: left;
  overflow: hidden;
}
@media screen and (min-width: 886px) {
  .article-wide {
    width: calc(var(--size-grid-column) * 2 + var(--size-grid-gutter));
  }
}
article:hover {
  background: var(--color-itembg);
}
article::selection {
  background: var(--b_high);
}
.article-containerupper {
  padding: var(--size-grid-gutter) var(--size-grid-gutter) 0
    var(--size-grid-gutter);
  display: flex;
  z-index: 100;
  width: 100%;
}
.article-containerlower {
  padding: 0 var(--size-grid-gutter) var(--size-grid-gutter);
  display: inline-block;
  z-index: 100;
}

/*IMAGE*/
.article-imageType-imgContainer {
  z-index: 200;
  position: relative;
}
.article-containerupper-image {
  cursor: var(--cursor-expandImage);
  padding: var(--size-grid-gutter) var(--size-grid-gutter) 0
    var(--size-grid-gutter);
  display: none;
  position: absolute;
  width: 100%;
  left: 0;
  z-index: 300;
  top: 0;
}
article:hover .article-containerupper-image {
  display: flex;
}
.article-containerlower-image {
  cursor: var(--cursor-expandImage);
  padding: var(--size-grid-gutter);
  position: absolute;
  bottom: 0;
  z-index: 200;
  left: 0;
}
.article-containerlower-image:empty {
  display: none;
}
article:hover .article-containerlower-image {
  display: inline-block;
}
.article-containerbelow {
  display: table;
  padding-left: var(--size-grid-gutter);
  padding-right: var(--size-grid-gutter);
  padding-top: calc(var(--size-grid-gutter) / 2);
  padding-bottom: var(--size-grid-gutter);
}
.article-containerbelow:empty {
  display: none;
}

.article-image {
  position: absolute;
  top: 0;
  background: transparent;
  padding-bottom: 0;
  overflow: hidden;
}
.article-image-img {
  vertical-align: middle; /* vertical-align css hack removes bottom padding */
  object-fit: cover;
  margin-bottom: 0px;
  width: 100%;
  max-height: 1000px;
  position: relative;
  z-index: 100;
  top: 0;
  left: 0;
}
.article-img {
  vertical-align: middle; /* vertical-align css hack removes bottom padding */
  width: calc(100% + var(--size-grid-gutter) * 2);
  max-height: 1000px;
  margin-left: calc(-1 * var(--size-grid-gutter));
  margin-right: calc(-1 * var(--size-grid-gutter));
  padding-top: var(--size-grid-gutter);
  cursor: var(--cursor-expandImage);
}
.image-overlay {
  background-color: var(--color-imagedarken);
  position: absolute;
  height: 100%;
  width: 100%;
  z-index: 150;
  opacity: 0;
  cursor: var(--cursor-expandImage);
}
.article:hover .image-overlay {
  opacity: var(--alpha-darken);
}
.article-image .article-link {
  display: none;
}
.article-image:hover .article-link {
  display: initial;
  text-shadow: 0 0 3em #000;
}

/* TITLE */
.article-title {
  color: var(--color-item);
  font-size: var(--size-font-title);
  text-decoration: none;
  width: 100%;
}
.article-image .article-title {
  display: none;
}
.article-image:hover .article-title {
  display: initial;
  text-shadow: 0 0 3em #000;
  color: white;
}

/* LINK */
.article-linkcontainer {
  margin-top: var(--size-item-elem-padding);
  float: left;
  clear: both;
}
.article-link {
  width: calc(100% - var(--size-font-bodytypes) * 2);
  float: left;
  clear: both;
  text-decoration: none;
  display: inline-block;
}

.article-linktitle {
  opacity: var(--alpha-idle);
  color: var(--color-item);
  font-size: var(--size-font-body);
  float: left;
}
.article-link:hover .article-linktitle {
  background-color: var(--color-itemascent);
  color: var(--color-itembg);
}
.article-linkicon {
  width: 23px;
  font-size: 15px;
  color: var(--color-item);
  float: left;
}
article:hover .article-linktitle {
  opacity: var(--alpha-enabled);
}
.article-link:hover .article-linktitle {
  opacity: var(--alpha-ascent);
}

/* TYPE */
.article-typecontainer {
  /* position: absolute;
  right: 0px;
  top: 0px;
  margin-right: var(--size-grid-gutter); */
  display: flex;
}
.article-type {
  color: var(--color-item);
  /* padding-bottom: var(--size-grid-gutter); */
  /* padding-top: var(--size-grid-gutter); */
  font-size: var(--size-font-bodytypes);
  vertical-align: top;
  text-align: center;
  /* float: right; */
  text-decoration: none;
  width: 30px;
  padding-left: 10px;
}
.article-image .article-typeicon {
  display: none;
}
.article-image:hover .article-typeicon {
  display: initial;
  color: var(--color-image);
}
.article-typeicon {
  opacity: var(--alpha-idleicon);
}
article:hover .article-typeicon {
  opacity: var(--alpha-enabledicon);
  color: var(--color-item);
}
.article-type:hover .article-typeicon {
  opacity: var(--alpha-ascent);
  color: var(--color-itemascent);
}

/* DATE, NOTE, QUOTE, TERM, TAGS, AUTH, PROG etc */
.article-icon {
  float: left;
  opacity: var(--alpha-idleicon);
}
article:hover .article-icon {
  opacity: var(--alpha-enabledicon);
}
.article-row {
  padding-top: var(--size-item-elem-padding);
  color: var(--color-item);
  font-size: var(--size-font-body);
  float: left;
  clear: both;
  cursor: default;
}
article:hover .article-row {
  color: var(--color-item);
}
.article-image .article-row {
  color: var(--color-image);
}
.article-rowtext {
  display: inline;
  opacity: var(--alpha-idle);
}
article:hover .article-rowtext {
  opacity: var(--alpha-enabled);
}
.article-file {
  word-break: break-all;
}
.article-file-link {
  color: var(--color-item);
  text-decoration: none;
}
.article-file-link:hover {
  background-color: var(--color-itemascent);
  color: var(--color-itembg);
  word-break: break-all;
}

/* IMAGE */
.article-containerlower-image {
  display: none;
}
.article-image:hover .article-containerlower-image {
  display: inline-block;
}
.article-taglink {
  color: var(--color-item);
  text-decoration: none;
}
article:hover .article-taglink {
  color: var(--color-item);
}
article:hover .article-taglink:hover {
  background-color: var(--color-itemascent);
  color: var(--color-itembg);
}
.article-image:hover .article-taglink {
  color: #fff;
}
.article-image:hover .article-taglink:hover {
  color: #fff;
}
</style>
