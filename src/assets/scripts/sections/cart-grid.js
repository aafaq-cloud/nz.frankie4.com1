import Vue from 'vue';

export default Vue.component('cart-grid', {
  template: `
  <div class="grid-y cart-grid">
    <cart-product v-for="(product, key) in cart.items" :line_id="key + 1" :product="product" :id="product.id" :key="product.id"/>
    <div v-if="cart.items.length < 1" class="text-center cart-product grid-x align-center">
      <h2>Your cart is empty.</h2>
    </div>
  </div>
  `,
  props: ['cart'],
});
