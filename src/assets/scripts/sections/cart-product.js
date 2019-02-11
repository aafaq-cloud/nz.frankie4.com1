// This should be kept in sync with snippets/cart-product.liquid to ensure consistent experience between JS and non-JS cart
import Vue from "vue";
import { formatMoney } from "@shopify/theme-currency";

export default Vue.component("cart-product", {
  template: `
  <article class="grid-x cart-product">
    <div class="error" v-if="errorMessage">{{errorMessage}}</div>
    <div class="cell medium-auto column-product">
        <div class="grid-x align-middle">
            <div class="cell shrink column-image hide-for-small-only" v-if="product.image">
              <a :href="product.url" class="cart-product-image-wrapper" tabindex="-1">
                <img class="lazyload cart-product-image" :data-src="product.image | formatImageSize('147x220')" />
              </a>
            </div>
            <div class="cell grow column-details">
              <h4>
                <a :href="product.url">{{product.product_title}}</a>           
              </h4>
              <template v-if="product.variant_title != null"><template v-for="(option, index) in product.variant_options">{{index > 0 ? ' | ' : ''}}{{ option }}</template></template>
            </div>
        </div>
    </div>
    <div class="cell medium-auto column-price">
     <label class="show-for-small-only">Price:</label>
      <span class="cart-line-price" v-html="formatMoneyValue(product.price)"></span>
    </div>

    <div class="cell medium-auto column-quantity">
      <label class="show-for-small-only">Quantity:</label>
      <div class="component-quantity-selector" data-autoload-class="ComponentQuantitySelector">

        <button type="button" :disabled="loading ? true : false" class="js-quantity-remove" @click="subtract">-</button>
        <input data-quantity-selector
        type="number"
        :id="'updates_' + line_id"
        name="updates[]"
        :value="product.quantity"
        min="0"
        aria-label="Item Quantity"
        v-if="!loading">
        <spinner v-if="loading" size="24px" />
        <button type="button" :disabled="loading" class="js-quantity-add" @click="add">+</button>
      </div>
    </div>
    <div class="cell medium-auto column-total">
      <label class="show-for-small-only">Line total: </label>
      <output v-html="formatMoneyValue(product.line_price)"></output>
    </div>
  </article>`,
  props: ["product", "id", "line_id"],
  data() {
    return {
      errorMessage:'',
      loading: false,
    };
  },
  methods: {
    remove(e) {
      e.preventDefault();
      // Let's exit if the product is loading (action is already happening)
      if (this.loading) {
        return;
      }

      this.loading = true;
      window.AppShopifyCart.removeItem(this.id).then(() => {
        this.loading = false;
      });
    },
    add() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      window.AppShopifyCart.addItem(this.id, 1, {}).then(() => {
        this.loading = false;
      }).catch((error) => {
        this.loading = false;
        let self = this;
        // this.errorMessage = error.description;
         this.errorMessage = error.description;
        setTimeout(()=> {   self.errorMessage = '';

        }, 3000);

      });
    },
    formatMoneyValue(value) {
      if (!value) {
        return "";
      } else {
        return formatMoney(value, theme.moneyFormat);
      }
    },
    subtract() {
      this.errorMessage = '';

      if (this.loading) {
        return;
      }
      this.loading = true;
      window.AppShopifyCart.updateItem(this.id, this.product.quantity - 1).then(
        () => {
          this.loading = false;
        },
      );
    },
  },
});
