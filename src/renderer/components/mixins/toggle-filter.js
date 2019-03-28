export default {
  methods: {
    toggleFilter(type, value) {
      const cap = `${type.charAt(0).toUpperCase()}${type.slice(1).toLowerCase()}`;
      const obj = {};
      obj[type] = value;

      this.$store.commit(`filters/toggle${cap}`, obj);
    },
  },
};

