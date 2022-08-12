/**
 * Banner Section Script
 * ------------------------------------------------------------------------------
 *
 */

import {AbstractComponent} from "../class/AbstractComponent";
import Glide from '@glidejs/glide';


export class BannerEditorialSection extends AbstractComponent {
  constructor(component) {
    super(component);

    this.initSlider();
  }


  initSlider() {
    this.glideElement = this.component.querySelector(".slider");
    this.glideElements = this.glideElement.querySelectorAll(".glide__slide");

    if (window.screen.width > 650) {
      this.glideSettings = {
        type: 'carousel',
        gap: 22,
        perView: 2,
        autoplay: 4000
      };  
    } else {
      this.glideSettings = {
        type: 'carousel',
        gap: 10,
        perView: 1,
        autoplay: 4000
      };  
    }

    this.glide = new Glide(this.glideElement, this.glideSettings);

    if (this.glideElements.length > 1) {
      this.glide.mount();
    }

  }

}
