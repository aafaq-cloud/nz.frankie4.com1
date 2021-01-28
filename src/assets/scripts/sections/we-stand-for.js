/**
 * Sneaker Guide Tabs Section Script
 * ------------------------------------------------------------------------------
 *
 */

import {AbstractComponent} from "../class/AbstractComponent";
import Glide from '@glidejs/glide';


export class WeStandForSection extends AbstractComponent {
    constructor(component) {
        super(component);


        this.tabTitles = this.component.querySelectorAll(".tab-title");
        this.tabContent = this.component.querySelectorAll(".tab-content-item");
        this.initTabs();

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
            console.log(this.tabContent[i].classList.contains('active'));
            // if (this.tabContent[i].classList.contains('active')) {
            //     console.log('contains');
            //     console.log(this.tabContent[i].getAttribute('data-tab-content-index'));
            // }
            if (this.tabContent[i].classList.contains('active')) {
                this.initTabSliders(this.tabContent[i]);
            }
        }
    }

    resetTabTitleActive(){
        console.log(this.tabTitles);
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
            autoplay: 5000
        };

        const tabGlide = new Glide(tabGlideElement, tabGlideSettings);

        if (!isMounted) {
            tabGlide.mount();
            tabGlideElement.classList.add('mounted');
        }

    }

}
