# vemex

> Vue port of Memex

[**Memex**](https://github.com/kormyen/memex) is a [personal knowledge base](https://scholar.colorado.edu/csci_techreports/931/). I loved the concept but found the original codebase very confusing, so I thought I'd port it to Vue and add some Electron specific niceties.

vemex differs from memex by using a JSON data store instead of [Indental](https://wiki.xxiivv.com/#indental), though I'd like to explore creating a standard library to parse and generate Indental database files in the future.

todo:

- [ ] tidy up codebase (very rough port right now)
- [ ] edit items
- [ ] image items
- [ ] video items
- [ ] lightbox
- [ ] custom types
- [ ] search
- [ ] data synchronisation between devices

#### Data storage

vemex stores its data in a JSON file at these locations:

- **Windows**: `%APPDATA%`
- **OS X**: `~/Library/Application\ Support/`
- **Unix-like**: `$XDG_CONFIG_HOME` or `~/.config`



#### Build Setup

``` bash
# install dependencies
yarn

# serve with hot reload
yarn run dev

# build electron application for production
yarn run build

# lint all JS/Vue component files in `src/`
yarn run lint

```

---

This project was generated with [electron-vue](https://github.com/SimulatedGREG/electron-vue)@[8fae476](https://github.com/SimulatedGREG/electron-vue/tree/8fae4763e9d225d3691b627e83b9e09b56f6c935) using [vue-cli](https://github.com/vuejs/vue-cli). Documentation about the original structure can be found [here](https://simulatedgreg.gitbooks.io/electron-vue/content/index.html).
