/**
 * Sneaker Guide Tabs Section Script
 * ------------------------------------------------------------------------------
 *
 */

import {AbstractComponent} from "../class/AbstractComponent";
import Glide from '@glidejs/glide';


export class SneakerGuideTabsSection extends AbstractComponent {
    constructor(component) {
        super(component);

        this.initSlider();
    }


    initSlider() {
        this.glideElement = this.component.querySelector(".sneaker-guide-nav-slider");
        this.glideElements = this.glideElement.querySelectorAll(".glide__slide");

        this.glideSettings = {
            type: 'carousel',
            gap: 0,
            focusAt: 1,
            perView: 6,
            breakpoints: {
                600: {
                    perView: 3
                },
                850: {
                    perView: 4
                },
                1024: {
                    perView: 5
                }
            }
        };

        this.glide = new Glide(this.glideElement, this.glideSettings);

        // Handle changing active slide on click
        this.slideContent = this.component.querySelectorAll(".sneaker-guide-content");

        // When Nav Slide changes active slide, hide/show related content
        this.glide.on(['run','mount.after'], () => {
            
            for (let i = 0; i < this.slideContent.length; i++) {
                if (this.slideContent[i].getAttribute('data-content-index') ==  this.glide.index){
                    this.slideContent[i].classList.add('active');
                    this.initTabSliders(this.slideContent[i].querySelector('.sneaker-guide-content-slider'));
                } else {
                    this.slideContent[i].classList.remove('active');
                }
            };
        });

        if (this.glideElements.length > 1) {
            this.glide.mount();
        }

        const slideThumbnails = this.glideElement.querySelectorAll('[data-slide]');
        for (let i = 0; i < slideThumbnails.length; i++) {
            slideThumbnails[i].addEventListener('click', () => {
                console.log('clicked')
                this.glide.go(slideThumbnails[i].dataset.slide);
            });
        }

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
