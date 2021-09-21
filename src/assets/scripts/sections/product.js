/**
 * Product Section Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly coupled to the Product section template.
 */

import {AbstractComponent} from "../class/AbstractComponent";
import {Product} from "../class/Product";
import Glide from '@glidejs/glide';
import {throttledResize} from "../helpers/throttledResize";
import {scroller} from "../helpers/scroller";

export class ProductSection extends AbstractComponent {
  constructor(component) {
    super(component);

    this.initProduct();
    this.initSlider();
    this.initThumbnails();
  }

  /**
   * Initialise the product
   */
  initProduct() {
    // Get the product data in JSON format
    this.productObject = JSON.parse(
      this.component.querySelector("[data-product-json]").innerHTML,
    );

    const options = {
      container: this.component,
      product: this.productObject,
    };

    // Create a new product this which handles all our variant logic
    this.product = new Product(options);

    // wishlist update
    // let wishlistAdd = this.component.querySelector("[data-shopify-wishlist-add]");
    // this.product.on('variant-change', (variant) => {
    //   let wishlistHandle = options.product.handle + '_variant_' + variant.id;
    //   wishlistAdd.setAttribute('data-shopify-wishlist-product-handle', wishlistHandle);
    //   if (typeof window.ShopifyWishlistInstace != 'undefined') {
    //       window.ShopifyWishlistInstace.updateAddToWishlistButtons();
    //   }
    // });
  }


  /**
   * Initialise the slider
   */
  initSlider() {
    this.glideActive = false;
    this.glideElement = this.component.querySelector(".glide");

    // Ensure it runs on load
    // this.resizeHandler();

    // Bind resize handler to window resize
    // throttledResize.add(() => this.resizeHandler());

    if (!this.glideActive) {
      this.glide = new Glide(this.glideElement, {
      }).mount();
      this.glideActive = true;
    }
  }

  /**
   * Handle the adding and removing of the slider based on breakpoint
   */
  // resizeHandler() {
  //   if(this.component.classList.contains('is-quickview')) {
  //     this.mountGlide();
  //   } else if (window.innerWidth < 640) {
  //     this.mountGlide();
  //   } else if (window.innerWidth >= 640) {
  //     this.mountGlide();
  //   }
  // }

  // mountGlide() {
  //   if (!this.glideActive) {
  //     this.glide = new Glide(this.glideElement,{
  //     }).mount();
  //     this.glideActive = true;
  //   }
  // }


  // dismountGlide() {
  //   if (this.glideActive) {
  //     if (this.glide) {
  //       this.glide.destroy();
  //     }
  //     this.glideActive = false;
  //   }
  // }

  /**
   * Initialise the scroll to image on thumbnail click
   */
  initThumbnails() {
    const thumbnails = this.component.querySelectorAll("[data-thumbnail]");
    const images = this.component.querySelectorAll("[data-image]");

    for (let i = 0; i < thumbnails.length; i++) {
      thumbnails[i].addEventListener("click", (e) => {
        e.preventDefault();

        const imageIndex = thumbnails[i].getAttribute("data-image-index");
        var product_images = document.getElementById("product_images").children;
        for (let i = 0; i< product_images.length; i++) {
          if (i != imageIndex) {
            document.getElementById("product_images").children[i].style.display = "none";
          } else {
            document.getElementById("product_images").children[i].style.display = "block";
          }
        }

        for (let j = 0; j < images.length; j++) {
          if (images[j].getAttribute("data-image-index") === imageIndex) {

            let offset = 20;
            const header = document.querySelector("header");

            if (header !== null) {
              offset += header.offsetHeight;
            }

            scroller.scroll(images[j], 600, offset);
            break;
          }
        }
      });
    }

  }
}
