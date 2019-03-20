import {AbstractComponent} from "../class/AbstractComponent";
import {throttledResize} from "../helpers/throttledResize";

/**
 * Collection Filter Snippet class
 */

export class CollectionFilterSnippet extends AbstractComponent {

  constructor(component) {
    super(component);

    this.initFilter();
    this.initReset();
  }

  initFilter() {
    let instance = this;

    instance.filters = document.querySelectorAll('.filter input[type="radio"]');
    [].forEach.call(instance.filters, function(filter) {
      filter.addEventListener("change", () => instance.reloadPage());
    });

    instance.accordions = document.querySelectorAll('.accordion-toggle');

    // Ensure it runs on load
    this.resizeHandler();
    // Bind resize handler to window resize
    //throttledResize.add(() => this.resizeHandler());

  }



  initReset() {
    let instance = this;

    instance.resetButtons     = document.querySelectorAll('.reset');

    [].forEach.call(instance.resetButtons, (resetButton)=> {
      // do whatever
      resetButton.addEventListener("click", () => {
        const filterName = resetButton.getAttribute('data-name');

        if (filterName === 'collection') {
          instance.component.setAttribute('data-collection','all');
        } else {
          const radioInputs = document.querySelectorAll('input[name=' + filterName + ']');
          [].forEach.call(radioInputs, (radioInput) => {
            radioInput.checked = false;
          });
        }

        instance.reloadPage();
      });
    });

  }

  reloadPage() {
    let instance = this;
    let newTags = [];
    let sortByParam = '';


    [].forEach.call(instance.filters, function(filter) {
      if (filter.checked ) {
        newTags.push(filter.value);
      }
    });

    // Check if sort_by is set
    Shopify.queryParams = {};
    if (location.search.length) {
      for (let aKeyValue, i = 0, aCouples = location.search.substr(1).split('&'); i < aCouples.length; i++) {
        aKeyValue = aCouples[i].split('=');
        if (aKeyValue.length > 1) {
          sortByParam = '?' + decodeURIComponent(aKeyValue[0]) + '=' + decodeURIComponent(aKeyValue[1]);
        }
      }
    }

    if (newTags.length) {
      let query = newTags.join('+');
      window.location.href = '/collections/' + instance.component.getAttribute('data-collection') + '/' + query + sortByParam;

    } else {
      window.location.href = '/collections/' + instance.component.getAttribute('data-collection') + sortByParam;
    }
  }

  resizeHandler() {
    let instance = this;
    // Close accordion items if small viewport
    if (window.innerWidth < 640) {
      [].forEach.call(instance.accordions, function(accordion) {
        accordion.dispatchEvent(
          new Event("accordion-item.close")
        );
      });
      // Open accordion items if medium or larger viewport
    } else if (window.innerWidth >= 640) {
      [].forEach.call(instance.accordions, function(accordion) {
        accordion.dispatchEvent(
          new Event("accordion-item.open")
        );
      });

    }
  }

}
