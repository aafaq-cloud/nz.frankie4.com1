/**
 * Banner Section Script
 * ------------------------------------------------------------------------------
 *
 */

import {AbstractComponent} from "../class/AbstractComponent";
import Glide from '@glidejs/glide';


export class BannerSection extends AbstractComponent {
  constructor(component) {
    super(component);

    this.initSlider();
  }


  initSlider() {
    this.glideElement = this.component.querySelector(".slider");
    this.glideElements = this.glideElement.querySelectorAll(".glide__slide");

    this.glideSettings = {
      type: 'carousel',
      gap: 0,
      perView: 1,
      autoplay: 12000
    };

    this.glide = new Glide(this.glideElement, this.glideSettings);

    if (this.glideElements.length > 1) {
      this.glide.mount();
    }

  }

}
