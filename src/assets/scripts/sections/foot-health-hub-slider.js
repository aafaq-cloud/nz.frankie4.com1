/**
 * Foot Health Hub Slider
 * ------------------------------------------------------------------------------
 * Handles the slider elements for the Foot Health Hub Slider Section
 */

import {AbstractComponent} from "../class/AbstractComponent";
import Glide from '@glidejs/glide';

export class FootHealthHubSliderSection extends AbstractComponent {
    constructor(component) {
        super(component);

        this.initSliders();

    }

    /**
     * Initialise the slider
     */
    initSliders() {

        this.contentGlideElement = this.component.querySelector(".glide.content-slider");
        this.imageGlideElement = this.component.querySelector(".glide.image-slider");
        this.glideSettings = {
            type: 'carousel',
            peek: {
                before: 0,
                after: 100
            }
        };
        this.contentGlideSettings = {
            dragThreshold: false,
            swipeThreshold: false
        };

        this.imageGlide = new Glide(this.imageGlideElement, this.glideSettings);
        this.contentGlide = new Glide(this.contentGlideElement, this.contentGlideSettings);

        this.imageGlide.on("run", () => {
            this.contentGlide.go(`=${this.imageGlide.index}`);
        });

        this.imageGlide.mount();
        this.contentGlide.mount();

    }

}
