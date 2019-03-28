<template>
  <form @submit.prevent @drop.prevent="drop">
    <div class="row">
      <!-- <div class="key">Type</div> -->
      <select v-model="formData.type" :disabled="!!formData.image">
        <option v-for="(type, key) in types" :value="key" :key="key">{{ key }}</option>
      </select>
    </div>

    <div class="row">
      <div class="key">Title</div>
      <input type="text" placeholder="title" v-model="formData.title">
    </div>

    <div class="row">
      <div class="key">Link</div>
      <input type="text" placeholder="link" v-model="formData.url">
    </div>

    <div class="row">
      <div class="key">Project</div>
      <input type="text" placeholder="project" v-model="formData.project">
    </div>

    <!-- <div class="row">
      <div class="key">Wide</div>
      <input type="checkbox">
    </div> -->

    <div class="row">
      <div class="key">Tags</div>
      <input
        type="text"
        placeholder="tag (enter to add)"
        v-model="tag"
        @keypress.enter.prevent="addTag"
      >
    </div>
    <div class="row">
      <div class="key"></div>
      <div class="tag-container">
        <span
          class="tag"
          v-for="(tag, index) in formData.tags"
          :key="tag"
          @click="deleteTag(index)"
        >{{ tag }}</span>
      </div>
    </div>

    <div class="row" v-for="(addable, index) in formData.addables" :key="`${addable.key}-${index}`">
      <div class="key">{{ addable.key }}</div>
      <input
        v-if="addables[addable.key].element === 'input'"
        type="text"
        v-model="formData.addables[index].value"
      >
      <textarea
        v-if="addables[addable.key].element === 'textarea'"
        v-model="formData.addables[index].value"
      ></textarea>
    </div>

    <div class="row" v-if="formData.image">
      <div class="key">Image</div>
      <figure>
        <img :src="image">
        <caption>{{ formData.image }}</caption>
      </figure>
    </div>

    <div class="row">
      <div class="key">Add:</div>
      <select v-model="addable">
        <option v-for="(type, key) in addables" :value="key" :key="key">{{ key }}</option>
      </select>
      <button @click="addAddable">Add to item</button>
    </div>
    <br>
    <button @click="submit">Save</button>
  </form>

<!-- <div class="page-overlay" id="overlay" style="
    z-index: 1000;
    display: block;
    visibility: visible;
    opacity: 1;
">
    <div class="content">
        <div class="content-menu">
            <a href="javascript:void(0);" id="escape">
                <div class="content-menu-option"><b>Esc</b></div>
            </a>
        </div>
        <form>
            <div class="row">
                <div class="key" id="keyTitle" style="visibility: visible;">TITLE</div>
                <input placeholder="Title" id="Title">
            </div>
            <div class="row">
                <div class="key" id="keyDate" style="visibility: visible;">DATE</div>
                <input placeholder="Date" id="Date">
            </div>
            <div class="row">
                <div class="key" id="keyType" style="visibility: visible;">TYPE</div>
                <input placeholder="Type" id="Type">
            </div>
            <div class="row">
                <div class="key" id="keyLink" style="visibility: visible;">LINK</div>
                <input placeholder="Link" id="Link">
            </div>
            <div class="row">
                <div class="key" id="keyPerson" style="visibility: visible;">PERS</div>
                <input placeholder="Person" id="Person">
            </div>
            <div class="row">
                <div class="key" id="keySource" style="visibility: visible;">SRCE</div>
                <input placeholder="Source" id="Source">
            </div>
            <div class="row">
                <div class="key" id="keyProject" style="visibility: visible;">PROJ</div>
                <input placeholder="Project" id="Project">
            </div>
            <div class="row">
                <div class="key" id="keyTags" style="visibility: hidden;">TAGS</div>
                <input placeholder="Tags" id="Tags">
            </div>
            <div class="row">
                <div class="key" id="keyProgress" style="visibility: hidden;">PROG</div>
                <input placeholder="Progress" id="Progress">
            </div>
            <div class="row">
                <div class="key" id="keyNote" style="visibility: hidden;">NOTE</div>
                <input placeholder="Note" id="Note">
            </div>
            <div class="row">
                <div class="key" id="keyQuote" style="visibility: hidden;">QOTE</div>
                <input placeholder="Quote" id="Quote">
            </div>
            <div class="row">
                <div class="key" id="keyTerms" style="visibility: hidden;">TERM</div>
                <input placeholder="Terms" id="Terms">
            </div>
        </form>
        <div class="display" id="display">NICE<br>&nbsp;&nbsp;DATE : let's go<br>&nbsp;&nbsp;TYPE : yes, this<br>&nbsp;&nbsp;LINK : ok<br>&nbsp;&nbsp;PERS : righto<br>&nbsp;&nbsp;SRCE : Okokokokkokok<br>&nbsp;&nbsp;PROJ : wwwwwwwhat</div>
        <div class="content-enter">
            <a href="javascript:void(0);" id="enter">
                <div class="content-menu-option"><b>Enter</b></div>
            </a>
        </div>
    </div>
</div> -->
</template>

<script>
import unfurl from 'unfurl.js';
import callAgent from '@/call-agent';
import types from '../types';

const defaultFormData = {
  title: '',
  url: '',
  type: 'article',
  project: '',
  image: false,
  tags: [],
  addables: [],
};

File.prototype.toObject = function toObject() {
  return Object({
    lastModified: parseInt(this.lastModified, 10),
    lastModifiedDate: String(this.lastModifiedDate, 10),
    name: String(this.name),
    size: parseInt(this.size, 10),
    type: String(this.type),
    path: String(this.path),
  });
};

export default {
  name: 'Add',

  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      types,
      addables: {
        note: { element: 'textarea' },
        term: { element: 'textarea' },
        quote: { element: 'input', type: 'text' },
        image: { element: 'image' },
      },

      formData: {
        title: '',
        url: '',
        type: 'article',
        project: '',
        image: false,
        tags: [],
        addables: [],
      },

      tag: '',
      addable: '',
    };
  },

  computed: {
    image() {
      if (this.formData.image.indexOf('http') > -1) {
        return this.formData.image;
      }
      return `file://${this.$store.state.media.directoryPath}/${this.formData.image}`;
    },
  },

  methods: {
    addTag() {
      const split = this.tag.split(',');

      split.forEach((item) => {
        const trimmed = item.toLowerCase().trim().replace(/\s+/g, '-');
        if (!trimmed.length) return;

        if (this.formData.tags.indexOf(trimmed) < 0) {
          this.formData.tags.push(trimmed);
        }
      });

      this.tag = '';
    },

    deleteTag(index) {
      this.formData.tag = this.formData.tags.splice(index, 1);
    },

    addAddable() {
      this.formData.addables.push({ key: this.addable, value: '' });
    },

    async submit() {
      const { formData } = this;

      const itemKeys = Array.from(new Set(formData.addables.map(addable => addable.key)));
      const items = {
        date: new Date(),
      };

      itemKeys.forEach((key) => {
        items[key] = formData.addables
          .filter(addable => addable.key === key)
          .map(addable => addable.value.trim());
      });
      delete formData.addables;

      const card = Object.assign(formData, items);
      await this.$store.dispatch('cards/add', card);

      this.formData = Object.assign({}, this.formData, defaultFormData);
    },

    async drop(event) {
      const files = [...event.dataTransfer.files].map(file => file.toObject());
      const response = JSON.parse(await callAgent('addFile', JSON.stringify(files)));

      response.forEach((file) => {
        this.formData.image = file;
      });

      this.formData.type = 'image';
    },
  },

  watch: {
    visible() {
      this.formData = Object.assign({}, this.formData, defaultFormData);
    },

    'formData.url': async function watcher(value) {
      if (!value.length) return;
      let data;

      try {
        data = await unfurl(value);
      } catch (e) {
        // eslint-disable-next-line
        console.error(e);
        return;
      }

      if (
        !this.formData.title.length &&
        ((data.open_graph && data.open_graph.title) || (data.title && data.title.length))
      ) {
        this.formData.title = (data.open_graph && data.open_graph.title) ||
          (data.title);
      }

      if (
        (data.open_graph && data.open_graph.description) ||
        (data.description && data.description.length)
      ) {
        this.formData.addables.push({
          key: 'note',
          value: (data.open_graph && data.open_graph.description) || (data.description),
        });
      }

      if (data.open_graph && data.open_graph.type && data.open_graph.type in types) {
        this.formData.type = data.open_graph.type;
      }

      if (data.open_graph && data.open_graph.images) {
        // eslint-disable-next-line
        this.formData.image = data.open_graph.images[0].url;
        this.formData.type = 'image';
      }
    },
  },
};
</script>

<style scoped>
  .tag-container {
    width: 400px;
    margin-bottom: 10px;
    display: inline-block;
  }

  .tag-container .tag {
    background-color: var(--color-page-input);
    color: #fff;
    cursor: default;
    font-size: var(--size-font-body);
    border-width: 0px;
    border-radius: var(--size-item-corner);
    opacity: var(--alpha-idle);
    padding: var(--size-item-elem-padding);
    margin: var(--size-item-elem-sep);
  }

  .tag-container .tag:hover {
    opacity: var(--alpha-enabled);
  }

  .page-overlay .content .row .key {
    text-transform: uppercase;
    visibility: visible;
  }

  figure {
    width: 400px;
    margin-bottom: 10px;
    display: inline-block;
  }

  figure img {
    width: 100%;
    max-width: 50px;
    display: inline-block;
  }

  figure caption {
    text-align: left;
    display: inline-block;
    font-size: var(--size-font-body);
    color: #fff;
  }
</style>
