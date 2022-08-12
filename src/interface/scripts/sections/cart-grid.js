import Vue from 'vue';

export default Vue.component('cart-grid', {
  template: `
  <div class="grid-y cart-grid">
   <div class="grid-x cart-headings hide-for-small-only">
        <div class="cell auto product-heading">
            Product
        </div>
        <div class="cell auto">
            Price
        </div>
        <div class="cell auto">
            Quantity
        </div>
        <div class="cell auto">
            Total
        </div>
    </div>
    <cart-product v-for="(product, key) in cart.items" :line_id="key + 1" :product="product" :id="product.id" :key="product.id"/>
    <div v-if="cart.items.length < 1" class="text-center cart-product grid-x align-center">
      <h2>Your cart is empty.</h2>
    </div>
  </div>
  `,
  props: ['cart'],
});
