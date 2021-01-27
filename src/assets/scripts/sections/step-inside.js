/**
 * Sneaker Guide Tabs Section Script
 * ------------------------------------------------------------------------------
 *
 */

import {AbstractComponent} from "../class/AbstractComponent";
import Glide from '@glidejs/glide';


export class StepInsideSection extends AbstractComponent {
    constructor(component) {
        super(component);

        this.initSlider();
    }

    initSlider() {
        this.glideElement = this.component.querySelector(".slider");
        this.glideElements = this.glideElement.querySelectorAll(".glide__slide");

        this.glideSettings = {
            type: 'carousel',
            gap: 40,
            perView: 2,
            peek: {
              before: 300,
              after: 300
            },
            breakpoints: {
                600: {
                    perView: 1,
                    gap: 20,
                    peek: {
                        before: 50,
                        after: 50
                    },
                },
                850: {
                    perView: 1,
                    gap: 20,
                    peek: {
                        before: 150,
                        after: 150
                    },
                },
                1024: {
                    perView: 2,
                    gap: 30,
                    peek: {
                        before: 100,
                        after: 100
                    },
                },
                1400: {
                    perView: 2,
                    gap: 30,
                    peek: {
                        before: 200,
                        after: 200
                    },
                }
            }
        };

        this.glide = new Glide(this.glideElement, this.glideSettings);


        if (this.glideElements.length > 1) {
            this.glide.mount();
        }

    }


}
