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
              <a :href="product.url" aria-hidden="true" tabindex="-1"><img :src="product.image | formatImageSize('100x100@2x')"></a>
            </div>
            <div class="product-details-container">
              <div class="product-details grid-y flex-child-auto">
                <h6 class="product-details-price mb-10" v-html="formatMoneyValue(product.line_price)"></h6>
                <div class="product-details-title"><a :href="product.url">{{ product.product_title }}</a></div>
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
           <img :src="product.featured_image | formatImageSize('100x100@2x')">
          </div>
          <div>
            <div class="mb-10">{{ product.title}}</div>
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
        clickAndCollect: theme.cart.clickAndCollect,
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
            <div class="cart-heading">
               
                    <h4 class="m-0">My Bag</h4>
                
                    <button type="button" @click="close" class="cart-modal-close" ref="close-button">
                      <span class="show-for-sr">Close cart popup</span>
                       <svg aria-hidden="true" viewBox="0 0 100 100" class="icon icon-cross"><path d="M61.88 50l35.65-35.65A8.401 8.401 0 0 0 85.65 2.47L50 38.12 14.35 2.46A8.401 8.401 0 0 0 2.47 14.34L38.12 50 2.46 85.65a8.401 8.401 0 0 0 11.88 11.88L50 61.88l35.65 35.65a8.401 8.401 0 0 0 11.88-11.88L61.88 50z"/></svg>
                    </button>
               
            </div>
            
            <div class="cart-additional-information" v-html="additionalInformation"></div>
          
            <div v-if="cart.items.length == 0">
                <h5 class="text-center cart-modal-empty mt-40 mb-40">{{ emptyText }}</h5>
            </div>
       
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
            
            
            <div class="click-and-collect mb-20">
                <div class="grid-x grid-margin-x align-center">
                  <div class="cell shrink">
                    <svg width="29" height="30" viewBox="0 0 29 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M28.4419 7.969C28.7852 8.545 28.977 9.19869 28.9994 9.869C29.0245 11.3416 28.2503 12.7122 26.9767 13.45V28.5C26.9767 29.3284 26.3057 30 25.478 30H3.4975C2.6698 30 1.99883 29.3284 1.99883 28.5V13.459C1.96124 13.4373 1.92402 13.415 1.88718 13.3921C0.0139003 12.2281 -0.561964 9.7645 0.601068 7.8895C0.601925 7.88821 0.603336 7.88729 0.604666 7.88643C0.606434 7.88527 0.608061 7.88421 0.608061 7.8825L2.04329 2.8625C2.10461 2.648 2.30044 2.50012 2.52336 2.5H3.99706V1.5C3.99706 0.671562 4.66803 0 5.49573 0H23.4798C24.3075 0 24.9785 0.671562 24.9785 1.5V2.5H26.5021C26.725 2.50012 26.9209 2.648 26.9822 2.8625L28.4419 7.969ZM5.49573 1C5.21985 1 4.99617 1.22388 4.99617 1.5V2.5H23.9794V1.5C23.9794 1.22388 23.7557 1 23.4798 1H5.49573ZM10.9909 18.5V29H17.9847V18.5C17.9847 18.2239 17.761 18 17.4851 18H11.4904C11.2145 18 10.9909 18.2239 10.9909 18.5ZM25.478 29C25.7539 29 25.9776 28.7761 25.9776 28.5V13.8735C25.6887 13.9499 25.392 13.9923 25.0934 14H25.0094C23.5442 14.0007 22.1954 13.201 21.4921 11.9145C21.1277 12.5839 20.5797 13.1349 19.9128 13.5029C17.9812 14.5684 15.5523 13.8648 14.4878 11.9315C14.1233 12.5936 13.5788 13.1386 12.9173 13.5033C10.9861 14.5682 8.55796 13.8645 7.49396 11.9315C6.61917 13.5357 4.76319 14.3349 2.99794 13.8675V28.5C2.99794 28.7761 3.22162 29 3.4975 29H9.99175V18.5C9.99175 17.6716 10.6627 17 11.4904 17H17.4851C18.3128 17 18.9838 17.6716 18.9838 18.5V29H25.478ZM25.0729 13C25.4835 12.9913 25.8873 12.8929 26.2558 12.7115C27.3384 12.1985 28.0216 11.0997 28.0033 9.901C27.9859 9.37781 27.8308 8.86844 27.5537 8.4245C27.5277 8.38163 27.5084 8.33512 27.4962 8.2865L26.1275 3.5H2.89803L1.52974 8.293C1.50639 8.36831 1.4653 8.43694 1.40985 8.493C1.14121 8.94969 0.99959 9.47006 0.999715 10C1.00103 11.655 2.34115 12.9963 3.99469 12.9976C5.65003 12.9989 6.99309 11.6569 6.9944 10C6.9944 9.72388 7.21808 9.5 7.49396 9.5C7.76984 9.5 7.99352 9.72388 7.99352 10C7.99352 11.6569 9.33545 13 10.9909 13C12.6463 13 13.9882 11.6569 13.9882 10C13.9882 9.72388 14.2119 9.5 14.4878 9.5C14.7636 9.5 14.9873 9.72388 14.9873 10C14.9873 11.6569 16.3293 13 17.9847 13C19.6401 13 20.982 11.6569 20.982 10C20.982 9.72388 21.2057 9.5 21.4816 9.5H21.4941H21.5065C21.7824 9.5 22.0061 9.72388 22.0061 10C22.0061 10.0234 22.0064 10.0469 22.0069 10.0703C22.0453 11.7267 23.4179 13.0384 25.0729 13ZM12.0007 23H13.0007V24H12.0007V23Z" fill="black"/>
                     </svg>
                  </div>
                  <div class="cell auto">
                    <div><strong>{{ clickAndCollect.title }}</strong></div>
                    <div class="mb-10">{{  clickAndCollect.content }}</div>
                    <a :href="clickAndCollect.page" target="_blank">Learn More</a>
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
              
              <div class="grid-x grid-margin-x grid-margin-y">
                <div class="cell medium-6 small-order-2 medium-order-1">
                 <button class="button button-hollow button-expanded" @click="close">Continue Shopping</button>
                </div>
                <div class="cell medium-6 small-order-1 medium-order-2">
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
        close(e) {
          e.preventDefault();
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
              url: "/recommendations/products",
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

      mounted() {
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
