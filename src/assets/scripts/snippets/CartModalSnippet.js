/**
 * Search Autocomplete Snippet Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly coupled to the Autocomplete snippet template.
 */

import $ from "jquery";
import {formatMoney} from "@shopify/theme-currency";
import {getSizedImageUrl} from "@shopify/theme-images";
import Vue from "vue";
import VueResource from "vue-resource";
import {MediaQuery} from "foundation-sites";

import {AbstractComponent} from "../class/AbstractComponent";

Vue.use(VueResource);

export class CartModalSnippet extends AbstractComponent {
  constructor(component) {
    component = $(component);

    super(component);

    this.cartQuantityElement = this.component.find(".cart-quantity");

    this.initVue();
    this.initJSToggles();
  }

  /**
   * Initialise the cart modal Vue
   */
  initVue() {
    const instance = this;

    Vue.filter("formatMoney", value => {
      if (!value) {
        return "";
      } else {
        return formatMoney(value, theme.moneyFormat);
      }
    });

    Vue.filter("formatImageSize", (value, size) => {
      if (!value || !size) {
        return "";
      } else {
        return getSizedImageUrl(value, size);
      }
    });

    Vue.component("product-item", {
      template: `
        <li class="popup-product grid-x align-top" :class="{ loading: loading }">
          <div v-if="product.image" class="popup-product-image">
            <a :href="product.url" aria-hidden="true" tabindex="-1"><img :src="product.image | formatImageSize('80x75')"></a>
          </div>
          <div class="product-details grid-y flex-child-auto">
            <h3 class="color-secondary-text text-small m-0"><span class="visually-hidden">Brand: </span>{{product.vendor}}</h3>
            <h2 class="h6"><a :href="product.url">{{ product.product_title }}</a></h2>
            <div class="text-small color-secondary-text">QTY: {{ product.quantity }} | <template v-for="(option, index) in product.variant_options">{{index > 0 ? ' | ' : ''}}{{ option }}</template></div>
          </div>
          <div class="popup-product-right">
            <div class="semibold color-secondary-text">{{ product.price | formatMoney }}</div>
            <button class="popup-product-edit text-small" @click="remove" :aria-label="'Remove' + product.product_title + 'from shopping cart'">
              <svg aria-hidden="true" viewBox="0 0 100 100" class="icon icon-cross">
                <path d="M61.88 50l35.65-35.65A8.401 8.401 0 0 0 85.65 2.47L50
                38.12 14.35 2.46A8.401 8.401 0 0 0 2.47 14.34L38.12 50 2.46 85.65a8.401 8.401
                0 0 0 11.88 11.88L50 61.88l35.65 35.65a8.401 8.401 0 0 0 11.88-11.88L61.88 50z"/>
              </svg>
            </button>
            </div>
        </li>
      `,
      props: ["product"],
      data() {
        return {
          loading: false
        };
      },
      methods: {
        remove() {
          // Let's exit if the product is loading (action is already happening)
          if (this.loading) {
            return;
          }

          this.loading = true;

          // Remove the item from the cart
          window.AppShopifyCart.removeItem(this.product.id).then(() => {
            this.loading = false;
          });
        }
      }
    });

    instance.vm = new Vue({
      el: instance.component.find(".cart-modal-view")[0],
      data: {
        cart: AppShopifyCart.getCart(),
        open: false,
        emptyText: this.component.data("empty-text")
      },
      template: `
        <div class="cart-modal-view" :class="{open: open}" ref="top">
          <div class="inside">
            <div v-if="cart.items.length > 0">
            <div class="totals">
              <div class="total-row grid-x align-justify">
                <h3 class="h6">Total {{ cart.total_price | formatMoney }}</h3>
              </div>
            </div>

            <div class="button-group stacked">
              <a class="button button-primary button-expanded" href="/cart">Checkout</a>
            </div>

          </div>
            <ul v-if="cart.items.length > 0" class="popup-products">

              <product-item is="product-item"
              v-for="(item, index) in cart.items"
              :key="item.key"
              :product="item"
              />

            </ul>

            <div class="details">

              <div v-if="cart.items.length == 0">
                <h5 class="text-center cart-modal-empty mt-40 mb-20">{{ emptyText }}</h5>
              </div>

              <button class="button button-hollow button-expanded" @click="close">Continue Shopping</button>
            </div>
          </div>
        </div>
      `,
      methods: {
        close() {
          instance.closeCart();
        }
      }
    });

    // Trigger a refresh of the vue js cart data when the cart is updated
    window.AppShopifyCart.on("cart.update", () => {
      this.vm.cart = AppShopifyCart.getCart();
      this.cartQuantityElement.html(this.vm.cart.item_count);
    });
  }

  /**
   * Check if the cart modal is open
   */
  isCartOpen() {
    return this.vm.open;
  }

  /**
   * Open the cart modal
   */
  openCart() {
    this.vm.open = true;
    this.vm.$refs.top.focus();

    // Create a click event on the body to close the js selector if user
    // clicks outside js selector element container
    setTimeout(() => {
      $("body")
        .unbind("click.js-cart-modal")
        .bind("click.js-cart-modal", e => {

          // Check if click outside toggle component
          if (
            !$(e.target).parents(".cart-modal-view").length &&
            !$(e.target).hasClass("cart-modal-view") &&
            !$(e.target).hasClass("js-toggle-cart-modal")
          ) {
            this.closeCart();
          }
        });
    });
  }

  /**
   * Close the cart modal
   */
  closeCart() {
    const instance = this;

    instance.vm.open = false;

    instance.jsCartToggles.removeClass("active");

    // Clean up the body binded click event
    $("body").unbind("click.js-cart-modal");
  }

  /**
   * Initialise the cart modal JS Toggles
   */
  initJSToggles() {
    const instance = this;

    this.jsCartToggles = this.component.find(".js-toggle-cart-modal");

    instance.jsCartToggles.bind("click.js-cart-modal", function(e) {
      // if (MediaQuery.atLeast("large")) {
      e.preventDefault();

      instance.jsCartToggles.removeClass("active");

      if (!instance.isCartOpen()) {
        instance.openCart();
        $(this).addClass("active");
      } else {
        instance.closeCart();
      }
      // }
    });
  }
}
