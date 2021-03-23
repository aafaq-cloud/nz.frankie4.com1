import {AbstractComponent} from "../class/AbstractComponent";
import Glide from '@glidejs/glide';

export class HealingHeelsNavWayfinderSection extends AbstractComponent {
    constructor(component) {
        super(component);

        this.initSlider();

    }

    initSlider(){
        // Tab Title Slider
        this.glideElement = this.component.querySelector(".tab-slider");
        this.glideElements = this.glideElement.querySelectorAll(".glide__slide");
        this.tabTitles = this.glideElement.querySelectorAll('.tab-title');

        this.glideSettings = {
            gap: 20,
            perView: 3,
            bound: true,
            breakpoints: {
                480: {
                    perView: 2,
                    bound: true,
                    peek: {before: 0, after: 0}
                },
                600: {
                    perView: 2,
                    bound: true,
                    peek: {before: 0, after: 50}
                },
                900: {
                    perView: 3,
                    bound: true,
                    peek: {before: 0, after: 50}
                }
            }
        };
        this.glide = new Glide(this.glideElement, this.glideSettings);

        // Content Slider
        this.contentElement = this.component.querySelector(".slider");
        this.contentElements = this.glideElement.querySelectorAll(".glide__slide");
        this.contentSlider = new Glide(this.contentElement);


        this.contentSlider.on(['run','mount.after'], () => {
            this.resetTabTitleActive();
            this.tabTitles[this.contentSlider.index].classList.add('active');
        });

        for (let i = 0; i < this.tabTitles.length; i++) {
            this.tabTitles[i].addEventListener('click', () => {
                this.resetTabTitleActive();
                const index = this.tabTitles[i].getAttribute('data-tab-index');
                this.tabTitles[i].classList.add('active');
                this.contentSlider.go('=' + index);

            });

        }

        if (this.glideElements.length > 1) {
            this.glide.mount();
        }
        if (this.contentElements.length > 1) {
            this.contentSlider.mount();
        }
    }


    resetTabTitleActive(){
        for (let i = 0; i < this.tabTitles.length; i++) {
            this.tabTitles[i].classList.remove('active');
        }
    }

}
