import {AbstractComponent} from "../class/AbstractComponent";
import Glide from '@glidejs/glide';


export class HealingHeelsCollectionSliderSection extends AbstractComponent {
    constructor(component) {
        super(component);


        this.initSlider();
    }

    initSlider() {
        this.glideElement = this.component.querySelector(".glide");
        this.glideElements = this.glideElement.querySelectorAll(".glide__slide");

        this.glideSettings = {
            type: 'carousel',
            gap: 40,
            perView: 3,
            peek: {
                before: 300,
                after: 300
            },
            breakpoints: {
                600: {
                    perView: 2,
                    gap: 20,
                    peek: {
                        before: 50,
                        after: 50
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
                    perView: 2,
                    gap: 30,
                    peek: {
                        before: 100,
                        after: 100
                    },
                },
                1240: {
                    perView: 2,
                    gap: 30,
                    peek: {
                        before: 200,
                        after: 200
                    },
                },
                1400: {
                    perView: 2,
                    gap: 30,
                    peek: {
                        before: 200,
                        after: 200
                    },
                },
                1600: {
                    perView: 2,
                    gap: 30,
                    peek: {
                        before: 200,
                        after: 200
                    },
                },
                2000: {
                    perView: 2,
                    gap: 30,
                    peek: {
                        before: 300,
                        after: 300
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
