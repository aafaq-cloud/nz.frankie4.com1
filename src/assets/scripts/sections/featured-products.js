/**
 * Featured Products Section Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly coupled to the Featured Products section template.
 */

import {AbstractComponent} from "../class/AbstractComponent";
import Glide from '@glidejs/glide';
import {throttledResize} from "../helpers/throttledResize";

export class FeaturedProductsSection extends AbstractComponent {
  constructor(component) {
    super(component);

    this.initSlider();
  }

  /**
   * Initialise the slider
   */
  initSlider() {
    this.glideActive = true;
    this.glideElement = this.component.querySelector(".glide");

    this.glideSettings = {
      type: 'carousel',
      startAt: 0,
      perView: 5,
      gap: 20,
      breakpoints: {
        850: {
          perView: 3
        },
        1024: {
          perView: 4
        }
      }
    };

    this.glide = new Glide(this.glideElement, this.glideSettings).mount();


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
    if (window.innerWidth < 640 && this.glideActive) {
      if (this.glide) {
        console.log('destroyed');
        this.glide.destroy();
        this.glideActive = false;
      }
      // Remove slider if medium or larger viewport
    } else if (window.innerWidth >= 640 && !(this.glideActive)) {
      this.glide = new Glide(this.glideElement,this.glideSettings).mount();
      this.glideActive = true;
    }
  }
}
