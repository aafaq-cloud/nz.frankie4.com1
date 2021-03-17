import $ from "jquery";
import {Autoloader} from "./Autoloader";
import { Reveal } from 'foundation-sites/js/foundation.reveal';

export class QuickView {
  constructor() {
    this.loading = false;

    const modalHTML = `
            <div style="display: none;" class="modal-quickview reveal large padded" data-reveal>
                <a class="close-button" data-close aria-label="Close Quick View">
                    <svg aria-hidden="true" viewBox="0 0 100 100" class="icon icon-cross">
                        <path fill="#010101" d="M61.88 50l35.65-35.65A8.401 8.401 0 0 0 85.65 2.47L50
                        38.12 14.35 2.46A8.401 8.401 0 0 0 2.47 14.34L38.12 50 2.46 85.65a8.401 8.401
                        0 0 0 11.88 11.88L50 61.88l35.65 35.65a8.401 8.401 0 0 0 11.88-11.88L61.88 50z"/>
                    </svg>
                </a>
                <div class="modal-content"></div>
            </div>`;

    this.modal = $(modalHTML);

    this.modalContent = this.modal.find(".modal-content");
    this.modalReveal = new Reveal(this.modal)

    this.initQuickViewButtons();
  }

  initQuickViewButtons() {
    const instance = this;

    const quickviewButtons = $("[data-product-quickview]");

    quickviewButtons
      .unbind("click.quickview")
      .bind("click.quickview", function(e) {
        e.preventDefault();

        const button = $(this);

        // Prevent loading of multiple quickviews at a time
        if (instance.loading) {
          return false;
        }

        //const url = $(this).data("product-url");
        const url = $(this).attr("data-product-url");

        if (url) {
          instance.loading = true;
          button.addClass("js-loading");

          $.ajax({
            type: "get",
            url,
            dataType: "html",
            data: {
              view: "quickview"
            },
            success(response) {
              instance.loading = false;
              instance.modalContent.html(response);
              instance.modalReveal.open();
              Autoloader.initAutoloadClasses();
            },
            complete() {
              setTimeout(() => {
                // Trigger an event for the binding of the wishlist
                const event = document.createEvent("Event");
                event.initEvent("shopify-wishlist.refresh", null, null);
                document.body.dispatchEvent(event);
                const event2 = document.createEvent("Event");
                event2.initEvent("products.refresh", null, null);
                document.dispatchEvent(event2);

                // Refresh Quickview
                AppQuickview.initQuickViewButtons();
              }, 100);

              setTimeout(() => {
                instance.loading = false;
                if (button) {
                  button.removeClass("js-loading");
                }
              }, 200);
            }
          });
        }
      });
  }
}
