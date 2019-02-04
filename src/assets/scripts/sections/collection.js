/**
 * Collection Section Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly coupled to the Collection section template.
 */

import $ from "jquery";
// Replace with generic throttle once Foundation is cleaned out sitewide
import {Foundation} from "foundation-sites";

import {AbstractComponent} from "../class/AbstractComponent";

/*
  See Comics Etc. Project for example of AJAX filtering on collections
*/

export class CollectionSection extends AbstractComponent {
  constructor(component) {

    component = $(component);

    super(component);
    this.component = $(component);
    this.initSorting();
    this.initInfiniteScroll();
  }

  initSorting() {
    const instance = this;
    instance.sortby = instance.component.find('#sort-by');

    Shopify.queryParams = {};

    if (window.location.search.length) {
      for (
        let aKeyValue,
          i = 0,
          aCouples = window.location.search.substr(1).split("&");
        i < aCouples.length;
        i++
      ) {
        aKeyValue = aCouples[i].split("=");
        if (aKeyValue.length > 1) {
          Shopify.queryParams[
            decodeURIComponent(aKeyValue[0])
          ] = decodeURIComponent(aKeyValue[1]);
        }
      }
    }

    instance.sortby.on("change", () => {
      Shopify.queryParams.sort_by = instance.sortby.val();
      location.search = $.param(Shopify.queryParams).replace(/\+/g, "%20");
    });
  }

  /**
   * Initialise the infinite scroll
   */
  initInfiniteScroll() {
    const instance = this;

    this.loadMoreEnable =
      this.component
        .find("#collection-infinite-container")
        .data("load_more_enable") == true;

    if (this.loadMoreEnable === true) {
      this.collectionLoading = false;

      this.loadMoreButtonSelector = "#collection-load-more-button";
      this.itemContainerSelector = "#collection-infinite-container";

      this.itemContainer = this.component.find(this.itemContainerSelector);
      this.loadMoreContainer = this.component.find(
        "#collection-load-more-container"
      );
      this.loadMoreButton = this.component.find(this.loadMoreButtonSelector);
      this.defaultPagination = this.component.find(".pagination");

      this.defaultPagination.hide();
      this.loadMoreContainer.show();

      this.loadMoreButton.on("click", () => {
        this.loadMoreCheck();
      });

      $(window).scroll(
        Foundation.util.throttle(() => {
          this.loadMoreCheck();
        }, 400)
      );
    }
  }

  /**
   * Check if the user has scrolled to the appropriate section and if the load more should fire
   */
  loadMoreCheck() {
    const instance = this;

    const itemContainerBottom =
      instance.itemContainer.offset().top +
      parseInt(instance.itemContainer.outerHeight());
    const screenBottom = $(window).scrollTop() + parseInt($(window).height());

    if (screenBottom > itemContainerBottom) {
      instance.loadNextPageProducts();
    }
  }

  /**
   * Load the next page of products and append to the product listing
   *
   * @returns {boolean}
   */
  loadNextPageProducts() {
    const instance = this;

    // Ensure we are not already loading products
    if (this.collectionLoading) {
      return false;
    }
    this.collectionLoading = true;

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
            // instance.loadMoreButton.remove();
            instance.loadMoreButton.hide();
          }

          // Refresh Quickview
          // AppQuickview.initQuickViewButtons();
        },
        complete() {
          instance.collectionLoading = false;
        }
      });
    } else {
      instance.loadMoreButton.hide();
    }
  }
}
