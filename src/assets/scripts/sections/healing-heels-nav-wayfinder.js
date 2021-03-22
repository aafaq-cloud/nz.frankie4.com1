import {AbstractComponent} from "../class/AbstractComponent";
import Glide from '@glidejs/glide';

export class HealingHeelsNavWayfinderSection extends AbstractComponent {
    constructor(component) {
        super(component);

        this.tabTitles = this.component.querySelectorAll(".tab-title");
        this.tabContent = this.component.querySelectorAll(".tab-content-item");
        this.initTabs();
        this.initSliderTabs();

    }

    initSliderTabs() {
        const tabGlideElement =  this.component.querySelector('.tab-slider')
        const glideSettings = {
            gap: 20,
            perView: 3,
            swipeThreshold: false,
            dragThreshold: false,
            bound: true,
            breakpoints: {
                480: {
                    perView: 2,
                    swipeThreshold: 80,
                    dragThreshold: 120,
                    bound: true,
                    peek: {before: 0, after: 0}
                },
                600: {
                    perView: 2,
                    swipeThreshold: 80,
                    dragThreshold: 120,
                    bound: true,
                    peek: {before: 0, after: 50}
                },
                900: {
                    perView: 3,
                    swipeThreshold: 80,
                    dragThreshold: 120,
                    bound: true,
                    peek: {before: 0, after: 50}
                }
            }
        };
        const tabGlide = new Glide(tabGlideElement, glideSettings);
        tabGlide.mount();
    }

    /*
    * Add event listener to tab titles to make related content active and mount the slider inside
    */
    initTabs() {
        for (let i = 0; i < this.tabTitles.length; i++) {
            this.tabTitles[i].addEventListener('click', () => {
                this.resetTabTitleActive();

                const index = this.tabTitles[i].getAttribute('data-tab-index');
                this.tabTitles[i].classList.add('active')
                this.toggleTabContent(index);

            });

        }

        // Mount slide if content loaded as active
        for (let i = 0; i < this.tabContent.length; i++) {
            if (this.tabContent[i].classList.contains('active')) {
                this.initTabSliders(this.tabContent[i].querySelector('.slider'));
            }
        }
    }

    resetTabTitleActive(){
        for (let i = 0; i < this.tabTitles.length; i++) {
            this.tabTitles[i].classList.remove('active');
        }
    }

    toggleTabContent(index) {

        for (let i = 0; i < this.tabContent.length; i++) {
            if (this.tabContent[i].getAttribute('data-tab-content-index') === index) {
                this.tabContent[i].classList.add('active');
                const slider =  this.tabContent[i].querySelector('.slider');
                this.initTabSliders(slider);
            } else {
                this.tabContent[i].classList.remove('active');
            }
        };

    }

    initTabSliders(slider) {

        const tabGlideElement = slider;
        const isMounted = tabGlideElement.classList.contains('mounted');
        const tabGlideElements = tabGlideElement.querySelectorAll(".glide__slide");

        const tabGlideSettings = {
            gap: 40,
            perView: 1,
        };

        const tabGlide = new Glide(tabGlideElement, tabGlideSettings);

        if (!isMounted) {
            tabGlide.mount();
            tabGlideElement.classList.add('mounted');
        } else {
            tabGlide.destroy();
            tabGlide.mount();
        }

    }

}
