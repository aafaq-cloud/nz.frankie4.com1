import Vue from 'vue';

export default Vue.component('spinner', {
  template:
    '<div :style="style" class="spinner" title="Loading, please wait"></div>',
  props: ['size', 'color'],
  computed: {
    style() {
      return {
        'font-size': this.size,
        color: this.color,
      };
    },
  },
});
