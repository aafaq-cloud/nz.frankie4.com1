import "../scss/theme.scss";

import $ from "jquery";

// import "lazysizes/plugins/object-fit/ls.object-fit";
// import "lazysizes/plugins/parent-fit/ls.parent-fit";
import "lazysizes/plugins/rias/ls.rias";
import "lazysizes/plugins/unveilhooks/ls.unveilhooks";
// import "lazysizes/plugins/bgset/ls.bgset";
import "lazysizes";
// import "lazysizes/plugins/respimg/ls.respimg";

import {Autoloader} from "class/Autoloader";
import {ShopifyCart} from "class/ShopifyCart";
import MicroModal from "micromodal";
// import {QuickView} from "class/Quickview";
import {ShopifyCurrency} from "class/Currency";
import {ProductList} from "class/ProductList";

window.slate = window.slate || {};
window.theme = window.theme || {};

$(document).ready(() => {

    MicroModal.init({
        'disableScroll': true
    });

    // Initialise the core application
    window.AppCurrency = new ShopifyCurrency();
    window.AppShopifyCart = new ShopifyCart();
    // window.AppQuickview = new QuickView();
    window.AppProductList = new ProductList();

    // Autoload Classes
    Autoloader.registerAutoloadClasses();


    // Apply a specific class to the html element for browser support of cookies.
    if (navigator.cookieEnabled) {
        document.documentElement.className = document.documentElement.className.replace(
            "supports-no-cookies",
            "supports-cookies"
        );
    }
});
