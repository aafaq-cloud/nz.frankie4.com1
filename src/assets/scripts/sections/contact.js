/**
 * Contact Section Script
 * ------------------------------------------------------------------------------
 * Handles the retrieval of support pages based on the user text for the search input.
 */

import {AbstractComponent} from "../class/AbstractComponent";

export class ContactSection extends AbstractComponent {
  constructor(component) {
    super(component);

    this.initSearchPages();
  }


  initSearchPages() {
    const searchInput = this.component.querySelector(".contact-search input");
    const resultsText = this.component.querySelector(".results-text");
    const results = this.component.querySelector(".results-container");

    const url = '/search.json';
    const defaultParams = 'type=page&view=json&q=handle:support+body:<query>+OR+title:<query>';

    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        const response = JSON.parse(xhr.response);
        const pages = response.results.page;
        const resultCount = response.results.results_count;
        let template = '';

        for (let i in pages) {
          template += `<div class="result">
              <h5>${pages[i].title}</h5>
              <p>${pages[i].excerpt}</p>
              <a class="arrow-link color-secondary-text" href="${pages[i].url}">Read More <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path d="M12.953 10.012l-5.047 5.047-.835-.835 4.223-4.212-4.247-4.236.835-.835z"/></svg></a>
            </div>`;
        }

        // Update Results Text
        resultsText.innerHTML =
          (!(resultCount > 0))
            ? `No results found for <span class="link">${searchInput.value}</span>`
            : (resultCount > 1)
            ? `${resultCount} results for <span class="search-value">${searchInput.value}</span>`
            : `${resultCount} result for <span class="search-value">${searchInput.value}</span>`;
        results.innerHTML = template;
      }
    };

    // Update page listing on search input
    searchInput.addEventListener("keyup", () => {
      if (searchInput.value.length >= 5) {
        let defaultParamsReplace = defaultParams.replace(new RegExp('<query>', 'g'),  searchInput.value);
        xhr.open('GET', url + '?' + defaultParamsReplace);
        xhr.send();
      }
    });

  }

}
