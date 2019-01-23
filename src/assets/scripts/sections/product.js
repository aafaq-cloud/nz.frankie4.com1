/**
 * Product Section Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly coupled to the Product section template.
 */

import {AbstractComponent} from "../class/AbstractComponent";
import {Product} from "../class/Product";
import Glide from '@glidejs/glide';
import {throttledResize} from "../helpers/throttledResize";

export class ProductSection extends AbstractComponent {
  constructor(component) {
    super(component);

    this.initProduct();
    this.initSlider();
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
  }


  /**
   * Initialise the slider
   */
  initSlider() {
    this.glideActive = false;
    this.glideElement = this.component.querySelector(".glide");

    // Ensure it runs on load
    this.resizeHandler();

    // Bind resize handler to window resize
    throttledResize.add(() => this.resizeHandler());
  }

  /**
   * Handle the adding and removing of the slider based on breakpoint
   */
  resizeHandler() {
    // Add slider if small viewport
    if (window.innerWidth < 640 && !this.glideActive) {
      this.glide = new Glide(this.glideElement).mount();
      this.glideActive = true;
    // Remove slider if medium or larger viewport
    } else if (window.innerWidth >= 640 && this.glideActive) {
      if (this.glide) {
        this.glide.destroy();
        this.glideActive = false;
      }
    }
  }
}
