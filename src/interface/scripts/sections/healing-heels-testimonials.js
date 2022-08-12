import {AbstractComponent} from "../class/AbstractComponent";
import Glide from '@glidejs/glide';


export class HealingHeelsTestimonialsSection extends AbstractComponent {
    constructor(component) {
        super(component);


        this.initSlider();
    }

    initSlider() {
        this.glideElement = this.component.querySelector(".glide");
        this.glideElements = this.glideElement.querySelectorAll(".glide__slide");

        this.glideSettings = {
            type: 'carousel',
            perView: 1
        };

        this.glide = new Glide(this.glideElement, this.glideSettings);

        if (this.glideElements.length > 1) {
            this.glide.mount();
        }

    }


}
