/**
 * Sneaker Guide Tabs Section Script
 * ------------------------------------------------------------------------------
 *
 */

import {AbstractComponent} from "../class/AbstractComponent";
import Glide from '@glidejs/glide';


export class StepInsideSliderSection extends AbstractComponent {
    constructor(component) {
        super(component);

        this.initSlider();
    }

    initSlider() {
        this.glideElement = this.component.querySelector(".slider");
        this.glideElements = this.glideElement.querySelectorAll(".glide__slide");

        this.glideSettings = {
            type: 'slider',
            gap: 40,
            perView: 4,
            peek: {
              before: 300,
              after: 300
            },
            breakpoints: {
                480: {
                    perView: 1,
                    gap: 10,
                    peek: {
                        before: 50,
                        after: 50
                    },
                },
                600: {
                    perView: 2,
                    gap: 15,
                    peek: {
                        before: 80,
                        after: 80
                    },
                },
                850: {
                    perView: 2,
                    gap: 20,
                    peek: {
                        before: 100,
                        after: 100
                    },
                },
                1024: {
                    perView: 3,
                    gap: 25,
                    peek: {
                        before: 100,
                        after: 100
                    },
                },
                1240: {
                    perView: 3,
                    gap: 30,
                    peek: {
                        before: 100,
                        after: 100
                    },
                },
                1400: {
                    perView: 3,
                    gap: 30,
                    peek: {
                        before: 100,
                        after: 100
                    },
                },
                1600: {
                    perView: 4,
                    gap: 30,
                    peek: {
                        before: 200,
                        after: 200
                    },
                },
                2000: {
                    perView: 4,
                    gap: 30,
                    peek: {
                        before: 240,
                        after: 240
                    },
                },

            }
        };

        this.glide = new Glide(this.glideElement, this.glideSettings);


        if (this.glideElements.length > 1) {
            this.glide.mount();
        }

    }


}
