/**
 * Foot Health Hub Road Testers
 * ------------------------------------------------------------------------------
 * Handles the slider elements for the Foot Health Hub Slider Section
 */

import {AbstractComponent} from "../class/AbstractComponent";
import Glide from '@glidejs/glide';

export class FootHealthHubRoadTestersSection extends AbstractComponent {
    constructor(component) {
        super(component);

        this.initSliders();

    }

    /**
     * Initialise the slider
     */
    initSliders() {

        this.imageGlideElement = this.component.querySelector(".glide.image-slider");
        this.glideSettings = {
            type: 'carousel',
            perView: 2,
            peek: {before: 0, after: 100},
            breakpoints: {
                1200: {
                    perView: 1,

                }
            }

        };


        this.imageGlide = new Glide(this.imageGlideElement, this.glideSettings);
        this.imageGlide.mount();


    }

}
