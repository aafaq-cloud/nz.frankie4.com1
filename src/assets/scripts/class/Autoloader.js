// Components
import {ComponentSelect} from "../components/ComponentSelect";
import {ComponentQuantitySelector} from "../components/ComponentQuantitySelector";
import {ComponentAccordionItem} from "../components/ComponentAccordionItem";
import {ComponentAccordionFooterItem} from "../components/ComponentAccordionFooterItem";
import {ComponentCarousel} from "../components/ComponentCarousel";
import {ComponentVideo} from "../components/ComponentVideo";
import {ComponentWayfinderSlider} from "../components/ComponentWayfinderSlider";
import {ComponentFullWidthSlider} from "../components/ComponentFullWidthSlider";
import {ComponentGridSlider} from "../components/ComponentGridSlider";

// Snippets
import {CartModalSnippet} from "../snippets/CartModalSnippet";
import {SearchAutocompleteSnippet} from "../snippets/SearchAutocompleteSnippet";
import {CollectionFilterSnippet} from "../snippets/CollectionFilterSnippet";
import {PromoBannerSection} from "../snippets/PromoBannerSnippet";

// Sections
import {CollectionSection} from "../sections/collection";
import {HeaderSection} from "../sections/header";
import {ProductSection} from "../sections/product";
import {CustomerAddressesSection} from "../sections/customer-address";
import {CartSection} from "../sections/cart";
import {ArticleListingSection} from "../sections/article-listing";
import {FeaturedProductsSection} from "../sections/featured-products";
import {ContactSection} from "../sections/contact";
import {ContactFormSection} from "../sections/contact-form";
import {BannerSection} from "../sections/banner";
import {BannerEditorialSection} from "../sections/banner-editorial";
import {ShippingSection} from "../sections/shipping";
import {SneakerGuideTabsSection} from "../sections/sneaker-guide-tabs";
import {FootHealthHubSliderSection} from "../sections/foot-health-hub-slider";
import {FootHealthHubRoadTestersSection} from "../sections/foot-health-hub-road-testers";

import {HealingHeelsAccessoriesSection} from "../sections/healing-heels-accessories";
import {HealingHeelsTabsSection} from "../sections/healing-heels-tabs";
import {HealingHeelsTabsTwoSection} from "../sections/healing-heels-tabs-two";
import {HealingHeelsTestimonialsSection} from "../sections/healing-heels-testimonials";
import {HealingHeelsNavWayfinderSection} from "../sections/healing-heels-nav-wayfinder";

import {HighHeelsDifference} from "../sections/high-heels-difference";
import {StepInsideSection} from "../sections/step-inside";
import {StepInsideSliderSection} from "../sections/step-inside-slider";
import {SimpleGlideSection} from "../sections/simple-glider";
import {SimpleGlideAutoplaySection} from "../sections/simple-glider-autoplay";
import {WeStandForSection} from "../sections/we-stand-for";

export class Autoloader {
  static registerAutoloadClasses() {
    const autoloadClasses = {
      // Components
      ComponentQuantitySelector,
      ComponentSelect,
      ComponentAccordionItem,
      ComponentAccordionFooterItem,
      ComponentCarousel,
      ComponentVideo,
      ComponentWayfinderSlider,
      ComponentFullWidthSlider,
      ComponentGridSlider,

      // Snippets
      SearchAutocompleteSnippet,
      CartModalSnippet,
      CollectionFilterSnippet,
      PromoBannerSection,

      // Sections
      HeaderSection,
      CollectionSection,
      ProductSection,
      CustomerAddressesSection,
      CartSection,
      ArticleListingSection,
      FeaturedProductsSection,
      ContactSection,
      ContactFormSection,
      SneakerGuideTabsSection,
      HighHeelsDifference,
      BannerSection,
      BannerEditorialSection,
      ShippingSection,
      FootHealthHubSliderSection,
      FootHealthHubRoadTestersSection,
      ShippingSection,
      HealingHeelsAccessoriesSection,
      HealingHeelsTabsSection,
      HealingHeelsTabsTwoSection,
      HealingHeelsTestimonialsSection,
      HealingHeelsNavWayfinderSection,

      ShippingSection,
      StepInsideSection,
      StepInsideSliderSection,
      SimpleGlideSection,
      SimpleGlideAutoplaySection,
      WeStandForSection
    };

    for (const key in autoloadClasses) {
      const autoloadClass = autoloadClasses[key];
      this.register(key, autoloadClass);
    }

    this.initAutoloadClasses();
  }

  /**
   * Register a new autoload component
   *
   * @param autoloadID
   * @param autoloadClass
   */
  static register(autoloadID, autoloadClass) {
    // Ensure the autoload variable exists
    window.autoload = window.autoload || {};

    // Add the class and id to the autoload array
    window.autoload[autoloadID] = autoloadClass;
  }

  /**
   * Initialise the Autoload Class javascript
   * Matches any element with the data-autoload-class attribute
   */
  static initAutoloadClasses() {
    // Load all autoload classes and sort by autoload priority
    // Only select elements that have not already been autoloaded
    let nodeList = document.querySelectorAll("[data-autoload-class]:not([data-autoload-class-loaded])");
    let nodeListArray = Array.prototype.slice.call(nodeList, 0);;

    const autoloadClasses = nodeListArray.sort((a, b) => {
        let aPriority = a.getAttribute("data-autoload-priority");

        let bPriority = b.getAttribute("data-autoload-priority");

        aPriority = typeof aPriority === "number" ? aPriority : 999;
        bPriority = typeof bPriority === "number" ? bPriority : 999;

        if (aPriority <= bPriority) {
          return -1;
        } else {
          return 1;
        }
      });

    // Autoload each class
    for (let i = 0; i < autoloadClasses.length; i++) {
      const autoloadClass = autoloadClasses[i].getAttribute("data-autoload-class");

      if (window.autoload[autoloadClass] !== undefined) {
        // Instantiate the class and assign to data to allow class access via jQuery selectors
        autoloadClasses[i].setAttribute(
          "data-autoloadClass",
          new window.autoload[autoloadClass](autoloadClasses[i])
        );
      }

      // Add data attribute to indicate class loaded
      autoloadClasses[i].setAttribute("data-autoload-class-loaded", "");
    }
  }
}
