import "../../styles/theme.scss";

import $ from "jquery";
import {cookiesEnabled} from "@shopify/theme-cart";
// import {MediaQuery} from "foundation-sites";

// import "lazysizes/plugins/object-fit/ls.object-fit";
// import "lazysizes/plugins/parent-fit/ls.parent-fit";
import "lazysizes/plugins/rias/ls.rias";
// import "lazysizes/plugins/bgset/ls.bgset";
import "lazysizes";
// import "lazysizes/plugins/respimg/ls.respimg";

import {Autoloader} from "../class/Autoloader";
import {ShopifyCart} from "../class/ShopifyCart";
import {QuickView} from "../class/Quickview";

window.slate = window.slate || {};
window.theme = window.theme || {};

$(document).ready(() => {
  // Initialise Foundation
  // MediaQuery._init();

  // Initialise the core application
  window.AppShopifyCart = new ShopifyCart();
  window.AppQuickview = new QuickView();

  // Autoload Classes
  Autoloader.registerAutoloadClasses();

  // Apply a specific class to the html element for browser support of cookies.
  if (cookiesEnabled()) {
    document.documentElement.className = document.documentElement.className.replace(
      "supports-no-cookies",
      "supports-cookies"
    );
  }
});
