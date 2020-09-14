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
import VueGlide from 'vue-glide-js';
//import 'vue-glide-js/dist/vue-glide.css';
import { Glide, GlideSlide } from 'vue-glide-js';
import {MediaQuery} from "foundation-sites";

import {AbstractComponent} from "../class/AbstractComponent";

Vue.use(VueResource,VueGlide);

export class CartModalSnippet extends AbstractComponent {
  constructor(component) {
    component = $(component);

    super(component);

    this.cartQuantityElement = this.component.find(".cart-quantity");
    this.shippingMessage = this.component.find(".cart-additional-information");

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
        <li class="popup-product" :class="{ loading: loading }">
          <div class=" grid-x">
            <div v-if="product.image" class="popup-product-image">
              <a :href="product.url" aria-hidden="true" tabindex="-1"><img :src="product.image | formatImageSize('100x100')"></a>
            </div>
            <div class="product-details-container">
              <div class="product-details grid-y flex-child-auto">
                <h6 class="mb-10 semibold" v-html="formatMoneyValue(product.line_price)"></h6>
                <div><a :href="product.url">{{ product.product_title }}</a></div>
                <div class="text-small color-secondary-text">
                  <template v-if="product.variant_title != null">
                    <template v-for="(option, index) in product.variant_options">{{index > 0 ? ' | ' : ''}}{{ option }}</template>
                  </template>
                </div>
              </div>
              <div class="product-quantity-selector-container flex-child-shrink mt-10 mb-10">
                <label class="show-for-sr">Quantity:</label>
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
            </div>
            <div class="popup-product-right">
              <div class="flex-container flex-dir-column align-bottom">
                <button type="button" class="popup-product-edit text-small mb-20" @click="remove" :aria-label="'Remove ' + product.product_title + ' from shopping cart'">
                  <svg aria-hidden="true" viewBox="0 0 100 100" class="icon icon-cross">
                    <path d="M61.88 50l35.65-35.65A8.401 8.401 0 0 0 85.65 2.47L50
                      38.12 14.35 2.46A8.401 8.401 0 0 0 2.47 14.34L38.12 50 2.46 85.65a8.401 8.401
                      0 0 0 11.88 11.88L50 61.88l35.65 35.65a8.401 8.401 0 0 0 11.88-11.88L61.88 50z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div class="error" v-if="errorMessage">{{errorMessage}}</div>
        </li>
      `,
      props: ["product", "id", "line_id"],
      data() {
        return {
          loading: false,
          errorMessage:'',
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
        },
        formatMoneyValue(value) {
          if (!value) {
            return "";
          } else {
            return formatMoney(value, theme.moneyFormat);
          }
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

      }
    });

    Vue.component("product-item-small", {
      template: `
        <a :href="product.url" class="recommended-product grid-x align-top">
         
          <div v-if="product.featured_image" class="popup-product-image">
           <img :src="product.featured_image | formatImageSize('100x100')">
          </div>
          <div>
            <div class="mb-10"><strong>{{ product.title}}</strong></div>
            <div v-html="formatMoneyValue(product.price)"></div>
          </div>
       
        </a>
      `,
      props: ["product"],
      data() {
        return {
          loading: false
        };
      },
      methods: {
        formatMoneyValue(value) {
          if (!value) {
            return "";
          } else {
            return formatMoney(value, theme.moneyFormat);
          }
        },
      }
    });

    instance.vm = new Vue({
      components: {
        [Glide.name]: Glide,
        [GlideSlide.name]: GlideSlide
      },
      el: instance.component.find(".cart-modal-view")[0],
      data: {
        cart: AppShopifyCart.getCart(),
        open: false,
        emptyText: this.component.data("empty-text"),
        recommendedProducts: [],
        additionalInformation: instance.shippingMessage.html()
      },
      watch: {
        cart(newCart, oldCart){

          if (newCart.items.length > 0) {
            if (oldCart.items.length == 0) {
              this.updateRecommendations();
            }
            else if (oldCart.items[0].product_id != newCart.items[0].product_id) {
              this.updateRecommendations();
            }
          }

        }
      },
      template: `
        <div class="cart-modal-view" :class="{open: open}" ref="top">
         <div v-if="open" tabindex="0" @focus="() => $refs['checkout-button'].focus()"></div>
         <form action="/cart" method="post">
          <div class="inside">
            <div class="cart-heading grid-x align-justify">
                <div class="cell shrink">
                    <h4>My Bag</h4>
                </div> 
                 <div class="cell shrink">
                    <button type="button" @click="close" class="cart-modal-close" ref="close-button">
                      <span class="show-for-sr">Close cart popup</span>
                       <svg aria-hidden="true" viewBox="0 0 100 100" class="icon icon-cross"><path d="M61.88 50l35.65-35.65A8.401 8.401 0 0 0 85.65 2.47L50 38.12 14.35 2.46A8.401 8.401 0 0 0 2.47 14.34L38.12 50 2.46 85.65a8.401 8.401 0 0 0 11.88 11.88L50 61.88l35.65 35.65a8.401 8.401 0 0 0 11.88-11.88L61.88 50z"/></svg>
                    </button>
                </div>
            </div>
            
            <div class="cart-additional-information" v-html="additionalInformation"></div>
          
       
            <ul v-if="cart.items.length > 0" class="popup-products">

              <product-item is="product-item"
              v-for="(item, index) in cart.items"
              :key="item.key"
              :product="item"
              :line_id="index + 1"     
              :id="item.id" 
              
              />

            </ul>
            
            <div v-if="cart.items.length > 0">
              <div class="totals mt-20 mb-20">
                <div class="total-row grid-x align-right">
                  <h3 class="h6" v-html="formatTotalMoneyValue(cart.total_price)"></h3>
                </div>
              </div>
            </div>
            
            <div id="product-recommendations" class="product-recommendations mb-20" v-if="cart.items.length > 0">
            <h5>You may also like</h5>
     
              <vue-glide v-if="recommendedProducts.length > 0" :breakpoints={768:{peek:0}} type="carousel" :perView=1 :peek={before:0,after:100} >
              
                <template slot="control">
                  <button data-glide-dir="<" class="prev">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path d="M12.953 10.012l-5.047 5.047-.835-.835 4.223-4.212-4.247-4.236.835-.835z"/></svg>
                  </button>
                  <button data-glide-dir=">" class="next">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path d="M12.953 10.012l-5.047 5.047-.835-.835 4.223-4.212-4.247-4.236.835-.835z"/></svg>
                  </button>
                </template>
                  
                  
               <vue-glide-slide v-for="(item, index) in recommendedProducts" :key="item.key"v>
                  <product-item-small    
                  :product="item"     
                  />
                </vue-glide-slide>
                
                
            
              </vue-glide>
            </div>
            <div class="details">

              <div v-if="cart.items.length == 0">
                <h5 class="text-center cart-modal-empty mt-40 mb-20">{{ emptyText }}</h5>
              </div>
              
              <div class="grid-x grid-margin-x grid-margin-y">
                <div class="cell medium-6 small-order-2">
                 <button class="button button-hollow button-expanded" @click="close">Continue Shopping</button>
                </div>
                <div class="cell medium-6">
                   <button type="submit" name="checkout" class="button button-primary button-expanded" ref="checkout-button">Checkout</button>
                </div>
              </div>

              
            </div>
          </div>
          </form>
          <div class="cart-modal-overlay" @click="close" @focus="() => $refs['close-button'].focus()" tabindex="0"/>
        </div>
      `,
      methods: {
        close() {
          instance.closeCart();
        },
        formatTotalMoneyValue(value) {
          if (!value) {
            return "";
          } else {
            return "Total " + formatMoney(value, theme.moneyFormat);
          }
        },
        updateRecommendations() {

          if (this.cart.items.length > 0) {
            let self = this;
            $.ajax({
              type: "get",
              url: "/recommendations/products.js",
              dataType: "json",
              data: {
                'section_id': 'product-recommendations',
                'limit': 3,
                'product_id': self.cart.items[0].product_id
              },
              success(response) {
                self.recommendedProducts = response.products;
              },
            });
          }
        }
      },

      created() {
        this.updateRecommendations();
      }


    });

    // Trigger a refresh of the vue js cart data when the cart is updated
    window.AppShopifyCart.on("cart.update", () => {
      this.vm.cart = AppShopifyCart.getCart();
      this.cartQuantityElement.html(this.vm.cart.item_count);

      setTimeout(() => {
        document.body.dispatchEvent(
          new Event("shopify-currency.refresh")
        );
      }, 10);
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
    document.body.classList.add("fixed-scroll");

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
    document.body.classList.remove("fixed-scroll");

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


    // Oepn cart modal when product is added to cart
    AppShopifyCart.on('cart.add', function() {

      //instance.jsCartToggles.removeClass('active');

      if (!instance.isCartOpen()) {
        instance.openCart();
        instance.jsCartToggles.addClass('active');
      }
      else {
        //instance.closeCart();
      }
    });


  }
}
