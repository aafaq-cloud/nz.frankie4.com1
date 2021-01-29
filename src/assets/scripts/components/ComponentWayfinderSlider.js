import {AbstractComponent} from "../class/AbstractComponent";
import Glide from '@glidejs/glide';
import {throttledResize} from "../helpers/throttledResize";

export class ComponentWayfinderSlider extends AbstractComponent {
  constructor(component) {
    super(component);

    this.initSlider();
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
      this.glide = new Glide(this.glideElement, {
        type: "carousel",
        perView: 2,
        peek: {before:0, after:  100},
        gap: 20,
        breakpoints: {
          420: {
            perView: 1,
            peek: {before:0, after:  80},
            gap: 10,
          },
          500: {
            perView: 1,
            peek: {before:0, after:  200},
            gap: 20,
          }
        }
      }).mount();
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
