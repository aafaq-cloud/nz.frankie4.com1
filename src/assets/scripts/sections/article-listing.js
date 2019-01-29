/**
 * Article Listing Section Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly coupled to the Article Listing section template.
 */

import $ from "jquery";
// Replace with generic throttle once Foundation is cleaned out sitewide
import {Foundation} from "foundation-sites";

import {AbstractComponent} from "../class/AbstractComponent";


export class ArticleListingSection extends AbstractComponent {
  constructor(component) {

    component = $(component);

    super(component);
    this.component = $(component);

    this.initLoadMoreButton();
  }


  /**
   * Initialise the infinite scroll
   */
  initLoadMoreButton() {
    const instance = this;

    this.loadMoreEnable =
      this.component
        .find("#article-container")
        .data("load_more_enable") == true;

    if (this.loadMoreEnable === true) {
      this.articleLoading = false;

      this.loadMoreButtonSelector = "#article-load-more-button";
      this.itemContainerSelector = "#article-container";

      this.itemContainer = this.component.find(this.itemContainerSelector);
      this.loadMoreContainer = this.component.find(
        "#article-load-more-container"
      );
      this.loadMoreButton = this.component.find(this.loadMoreButtonSelector);
      this.defaultPagination = this.component.find(".pagination");

      this.defaultPagination.hide();
      this.loadMoreContainer.show();

      this.loadMoreButton.on("click", () => {
        this.loadNextPageArticles();
      });

    }
  }

  /**
   * Load the next page of articles and append to the article listing
   *
   * @returns {boolean}
   */
  loadNextPageArticles() {
    const instance = this;

    // Ensure we are not already loading products
    if (this.articleLoading) {
      return false;
    }
    this.articleLoading = true;

    // Init loading of additional products
    const loadMoreURL = this.loadMoreButton.data("next-url");

    if (
      loadMoreURL !== "null" &&
      loadMoreURL !== undefined &&
      loadMoreURL !== null
    ) {
      $.ajax({
        type: "GET",
        url: loadMoreURL,
        dataType: "html",
        beforeSend() {
          instance.loadMoreButton.addClass("js-loading");
          instance.loadMoreButton.text(
            instance.loadMoreButton.data("loading-text")
          );
        },
        success: data => {
          const filteredData = $(data)
            .find(instance.itemContainerSelector)
            .children();
          const nextLoadMore = $(data).find(instance.loadMoreButtonSelector);
          const nextLoadMoreUrl = nextLoadMore.attr("data-next-url") || "null";

          filteredData.appendTo(instance.itemContainer);
          this.loadMoreButton.data("next-url", nextLoadMoreUrl);

          // Don't show the loading message after loading products on the last page
          if (nextLoadMoreUrl !== "null" && nextLoadMoreUrl !== null) {
            instance.loadMoreButton.removeClass("js-loading");
            instance.loadMoreButton.text(
              instance.loadMoreButton.data("load-more-text")
            );
          } else {
            instance.loadMoreButton.hide();
          }

        },
        complete() {
          instance.articleLoading = false;
        }
      });
    } else {
      instance.loadMoreButton.hide();
    }
  }
}
