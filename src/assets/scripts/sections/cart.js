import Vue from "vue";
import {formatMoney} from "@shopify/theme-currency";
import {getSizedImageUrl} from "@shopify/theme-images";
import $ from "jquery";

import {AbstractComponent} from "../class/AbstractComponent";

import CartProduct from "./cart-product";
import CartGrid from "./cart-grid";
import Spinner from "./spinner";

export class CartSection extends AbstractComponent {
  constructor(component) {
    component = $(component);

    super(component);


    this.cart = {};
    this.totalDOM = this.component.find(".cart-total-price");
    this.total = this.totalDOM.text();
    this.initCart();
  }

  initCart() {
    this.component.find("#update-cart-button").hide();
    this.cart = window.AppShopifyCart.getCart();
    Vue.filter("formatMoney", value => {
      if (value) {
        return formatMoney(value, theme.moneyFormat);
      } else {
        return "";
      }
    });

    Vue.filter("formatImageSize", (value, size) => {
      if (!value || !size) {
        return "";
      } else {
        return getSizedImageUrl(value, size);
      }
    });

    this.vm = new Vue({
      el: this.component.find(".cart-grid")[0],
      components: {
        "cart-product": CartProduct,
        "cart-grid": CartGrid,
        spinner: Spinner,
      },
      template: "<cart-grid :cart=\"cart\" />",
      data: {
        cart: this.cart,
      },
    });

    window.AppShopifyCart.on("cart.update", () => {
      this.cart = window.AppShopifyCart.getCart();
      this.vm.cart = this.cart;
      this.total = formatMoney(this.cart.total_price, theme.moneyFormat);
      this.totalDOM.html(this.total);
    });
  }
}
