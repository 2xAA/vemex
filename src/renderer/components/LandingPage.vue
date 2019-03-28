<template>
  <div>
    <navigation :items="items" @showOverlay="showOverlay" />

    <div class="container">
      <filter-display />
      <main v-masonry v-bind="masonryOptions">
        <div
          v-masonry-tile
          class="item"
          v-for="(item, index) in items"
          :key="`${item.title}-${index}`"
        >
          <card :itemData="item"></card>
        </div>
      </main>
    </div>

    <div class="page-overlay" :class="{ show: overlayVisible }">
      <div class="content-menu">
        <a
          href="javascript:void(0);"
          @click.prevent="showOverlay"
          id="escape"
        >
          <div class="content-menu-option"><b>Esc</b></div>
        </a>
      </div>
      <div class="content">
        <add :visible="overlayVisible"></add>
      </div>
    </div>

    <Lightbox />
  </div>
</template>

<script>
import Card from '@/components/Card';
import Add from '@/components/Add';
import FilterDisplay from '@/components/FilterDisplay';
import Navigation from '@/components/Navigation';
import Lightbox from '@/components/Lightbox';

function filterAgainst(source, comparisonArray, comparison) {
  return source.filter((item) => {
    for (let i = 0; i < comparisonArray.length; i += 1) {
      const comparisonItem = comparisonArray[i];

      if (comparison(item, comparisonItem)) {
        return true;
      }
    }

    return false;
  });
}

export default {
  name: 'App',
  data() {
    return {
      filter: '',
      overlayVisible: false,

      masonryOptions: {
        'item-selector': '.item',
        'column-width': 350,
        gutter: 20,
        'fit-width': true,
        'transition-duration': 0,
      },
    };
  },
  computed: {
    items() {
      let cards = this.$store.state.cards
        .slice()
        .map((card, index) => ({ ...card, id: index }))
        .sort((a, b) => new Date(b.date) - new Date(a.date));

      const {
        tag,
        type,
        done,
        project,
      } = this.$store.state.filters;

      if (tag.length) {
        cards = filterAgainst(
          cards.filter(item => item.tags && Array.isArray(item.tags)),
          tag,
          (a, b) => a.tags.includes(b),
        );
      }

      if (type.length) {
        cards = filterAgainst(cards, type, (a, b) => a.type === b);
      }

      if (done > -1) {
        cards = cards.filter((a) => {
          if (done) {
            return a.done;
          }

          return !a.done;
        });
      }

      if (project.length) {
        cards = filterAgainst(cards, project, (a, b) => a.project === b);
      }

      return cards;
    },
  },
  components: {
    Card,
    Add,
    FilterDisplay,
    Navigation,
    Lightbox,
  },

  methods: {
    showOverlay() {
      this.overlayVisible = !this.overlayVisible;

      if (this.overlayVisible) {
        window.addEventListener('keyup', this.handleEsc);
      } else {
        window.removeEventListener('keyup', this.handleEsc);
      }
    },

    handleEsc(e) {
      if (e.key === 'Escape') {
        this.showOverlay();
      }
    },
  },

  watch: {
    '$store.state.cards': {
      deep: true,
      handler() {
        this.$nextTick(() => {
          this.$redrawVueMasonry();
        });
      },
    },
  },
};
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

:root {
  --color-bg: var(--background);

  --color-menu: var(--f_high);
  --color-menubg: var(--b_low);
  --color-menuascent: var(--f_med);

  --color-item: var(--f_high);
  --color-itembg: var(--b_low);
  --color-itemascent: var(--f_med);

  --color-image: #fff; /*Text overlaying an image item*/
  --color-imagedarken: #000; /*Overlay on image as text background */

  --color-page-bg: #000;
  --color-page-input: #111;
  --color-page-i: #222; /*idle*/
  --color-page-e: #333; /*enabled*/
  --color-page-a: #666; /*ascent*/

  --alpha-darken: 0.6;
  --alpha-idleicon: 0.2;
  --alpha-idle: 0.4;
  --alpha-enabledicon: 0.4;
  --alpha-enabled: 1;
  --alpha-ascent: 1;

  --size-menu: 200px;
  --size-menu-item-sepv: 14px; /*vertical space between menu items*/
  --size-menu-item-seph: 10px; /*horizontal space between menu item count and icon*/
  --size-menu-itemgroup-sepv: 30px; /*vertical space between menu types (types to terms, terms to tags)*/
  --size-menu-tag-sepv: 10px; /*space between tag items*/

  --size-grid-gutter: 20px;
  --size-grid-column: 350px;

  --size-item-corner: 10px;
  --size-item-elem-padding: 1em; /*vertical space between grid item internal elements (tags, notes, quotes etc)*/
  --size-item-elem-sep: 0.75em; /*horizontal space between item element icon and element text (tag icon and tags)*/

  --size-font-title: 1em;
  --size-font-body: 0.8em;
  --size-font-menutypes: 1em;
  --size-font-menutags: 0.8em;
  --size-font-bodytypes: 1em; /*font size of type icon/count*/

  --cursor-expandImage: zoom-in;
  --cursor-minimizeImage: zoom-out;
}

* {
  box-sizing: border-box;
}
html {
  font-family: "Monaco", "Andale Mono", "Deja Vu Sans Mono", "Consolas",
    monospace;
  background: var(--background);
  padding: 0em;
  margin: 0;
  overflow-y: scroll;
}
body {
  background: var(--background);
  padding: 0em;
  margin: 0;
}
::selection {
  background: var(--color-itemascent);
  color: var(--color-itembg);
}

/* LOADING */
.loading-wave {
  display: inline-block;
  position: fixed;
  margin-left: calc(var(--size-menu) / 2);
  top: 50%;
  left: 50%;
  width: 94px;
  height: 40px;
  transform: translateY(-50%) translateX(-50%);
}
.loading-wave div {
  position: absolute;
  top: 14px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--color-itemascent);
  animation: loading-wave 1.5s infinite;
  transition-timing-function: ease-in-out;
  -webkit-animation-timing-function: ease-in-out;
}
.loading-wave div:nth-child(1) {
  left: 0px;
  animation-delay: 0s;
}
.loading-wave div:nth-child(2) {
  left: 20px;
  animation-delay: -0.1s;
}
.loading-wave div:nth-child(3) {
  left: 40px;
  animation-delay: -0.2s;
}
.loading-wave div:nth-child(4) {
  left: 60px;
  animation-delay: -0.3s;
}
.loading-wave div:nth-child(5) {
  left: 80px;
  animation-delay: -0.4s;
}
@keyframes loading-wave {
  0% {
    transform: translateY(10px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(10px);
  }
}

/* ERROR */
.error {
  position: fixed;
  top: 50%;
  left: 50%;
  font-size: 128px;
  transform: translateY(-50%) translateX(-50%);
  display: none;
  color: var(--color-itemascent);
  font-size: 128px;
  vertical-align: center;
  text-align: center;
  z-index: 500;
  padding: 0;
  background-color: var(--color-bg);
  border-radius: var(--size-item-corner);
  border-color: var(--color-item);
  border-width: 1px;
  border-style: solid;
}
.error:after {
  content: "error";
  margin-left: var(--size-grid-gutter);
  margin-right: var(--size-grid-gutter);
}

/* MAIN */
.container {
  background: var(--background);
  margin-left: calc(var(--size-menu) + var(--size-grid-gutter));
  margin-right: var(--size-grid-gutter);
}
main {
  margin: var(--size-grid-gutter) auto;
}
main:after {
  /* clearfix (reset) */
  display: block;
  content: "";
  clear: both;
}

/* SMALL ICONS */
.textIcon {
  color: #fff;
  margin-right: var(--size-item-elem-sep);
}
article:hover .textIcon {
  color: var(--color-item);
}

/*TODO: refactor below; */

/* PAGE */
.page-overlay {
  /* visual */
  background-color: var(--color-page-bg);
  opacity: 0;
  /*-webkit-transition: opacity var(--animation-time) linear;
  transition: opacity var(--animation-time) linear;*/
  width: 100%;
  height: 100%;
  /* position */
  position: absolute;
  z-index: -100;
  left: 0;
  top: 0;
  /* content */
  display: none;
  align-items: center;
  justify-content: center;
  user-select: none;
  /*noselect stops an unwanted selection visual on button click*/
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome and Opera */
}

.page-overlay.show {
  z-index: 1000;
  visibility: visible;
  opacity: 1;
  display: block;
}

.page-overlay .content-menu {
  width: 100px;
  float: left;
  text-align: center;
  height: 100%;
  padding-top: auto;
  padding-bottom: auto;
  margin-right: 50px;
  border-radius: var(--size-item-corner);
}
.page-overlay .content-menu:hover {
  background-color: var(--color-page-i);
}
.page-overlay .content-menu:hover a {
  color: var(--color-page-a);
}
.page-overlay .content-menu a {
  color: var(--color-page-e);
  text-decoration: none;
}
.page-overlay .content-menu .content-menu-option {
  height: 100px;
  width: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.page-overlay .content form {
  float: left;
}
.page-overlay .content .row .key {
  width: 100px;
  color: var(--color-page-a);
  visibility: hidden;
  float: left;
  padding: 9px 7px 10px 0;
  text-align: right;
  margin-right: 0px;
}
.page-overlay .content .row input {
  padding: 10px;
  width: 400px;
  margin-bottom: 10px;
  background-color: var(--color-page-input);
  color: #fff;
  border-width: 0px;
  border-radius: var(--size-item-corner);
}
.page-overlay .content .row input::placeholder {
  opacity: 1;
  color: var(--color-menu);
}
.page-overlay .content .row input:hover {
  background-color: var(--color-page-i);
}
.page-overlay .content .row input:focus {
  background-color: var(--color-page-e);
}
.page-overlay .content .display {
  float: left;
  height: 100%;
  width: 400px;
  padding: 10px;
  margin-left: 50px;
  color: var(--color-page-e);
}
.page-overlay .content-enter {
  margin-top: 50px;
  float: left;
  width: 100%;
  height: 100px;
  clear: both;
  text-align: center;
  padding-top: auto;
  padding-bottom: auto;
  vertical-align: center;
  border-radius: var(--size-item-corner);
}
.page-overlay .content-enter .content-menu-option {
  height: 100%;
  vertical-align: center;
  padding-top: auto;
  padding-bottom: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}
.page-overlay .content-enter:hover {
  background-color: var(--color-page-i);
}
.page-overlay .content-enter:hover a {
  color: var(--color-page-a);
}
.page-overlay .content-enter a {
  color: var(--color-page-e);
  text-decoration: none;
}
</style>
