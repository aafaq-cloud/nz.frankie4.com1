/**
 * Sneaker Guide Tabs Section Script
 * ------------------------------------------------------------------------------
 *
 */

import {AbstractComponent} from "../class/AbstractComponent";
import Glide from '@glidejs/glide';


export class SimpleGlideAutoplaySection extends AbstractComponent {

    constructor(component) {
        super(component);

        this.initSlider();
    }


    initSlider() {
        this.glideElement = this.component.querySelector(".glide2");
        this.glideElements = this.glideElement.querySelectorAll(".glide__slide2");

        this.glideSettings = {
            type: 'carousel',
            gap: 0,
            perView: 1,
            autoplay: 4000
        };

        new Glide(this.glideElement, this.glideSettings).mount();
    }

}
