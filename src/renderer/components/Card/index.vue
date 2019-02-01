<template>
  <article class="article" :class="{ 'article-wide': wide }" :data-article-id="itemData.id">
    <div class="article-containerupper">
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
          <div class="article-linktitle">{{ domain }}</div>
        </div>
      </electron-link>
      <header v-else class="article-title">{{ title }}</header>

      <div class="article-typecontainer">
        <a
          class="article-type"
          :href="`#type-${type}`"
          v-if="icon"
          @click.prevent="toggleFilter('type', type)"
        >
          <icon :title="type" :icon="icon" class="textIcon article-typeicon" />
        </a>
        <a class="article-type" href="#done-false" @click.prevent="handleDone">
          <icon title="false" :icon="doneIcon" class="textIcon article-typeicon" />
        </a>
      </div>
    </div>

    <div class="article-containerlower">
      <div class="article-row">
        <icon title="date" :icon="['fas', 'clock']" class="textIcon article-icon" />
        <div class="article-rowtext">{{ formattedDate }}</div>
      </div>

      <div class="article-row" v-if="tags.length">
        <icon title="tags" :icon="['fas', 'tags']" class="textIcon article-icon" />
        <div class="article-rowtext">
          <span v-for="(tag, index) in tags">
            <a
              class="article-taglink"
              :href="`#tag-${tag}`"
              @click.prevent="toggleFilter('tag', tag)"
            >{{ tag }}</a
            >{{ outputComma(index, tags.length) }}
          </span>
        </div>
      </div>

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
        v-for="item in items"
        :is="item.type"
        :itemData="item.data"
      />
    </div>
  </article>
</template>

<script>
import contextMenu from 'electron-context-menu';

import ElectronLink from '../ElectronLink';
import store from '../../store';
import quote from './Quote';
import note from './Note';
import term from './Term';

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
          store.commit('cards/remove', { index });
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
  },

  props: {
    itemData: {
      default: () => {},
      required: true,
    },
  },

  computed: {
    ...metaComputed,
    domain() {
      const { itemData } = this;
      const matches = itemData.url.match(/^https?:\/\/([^/?#]+)(?:[/?#]|$)/i);
      return (matches && matches[1]) || itemData.url;
    },

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
  },

  methods: {
    outputComma(index, length) {
      return index < length - 1 ? ', ' : '';
    },

    handleDone() {
      this.$store.commit('cards/update', {
        index: this.itemData.id,
        card: {
          done: !this.done,
        },
      });
    },

    toggleFilter(type, value) {
      const cap = `${type.charAt(0).toUpperCase()}${type.slice(1).toLowerCase()}`;
      const obj = {};
      obj[type] = value;

      this.$store.commit(`filters/toggle${cap}`, obj);
    },
  },
};
</script>
