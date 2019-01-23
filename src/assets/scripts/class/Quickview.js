import $ from "jquery";
import {Autoloader} from "./Autoloader";

export class QuickView {
  constructor() {
    this.loading = false;

    const modalHTML = `
            <div style="display: none;" class="modal-quickview reveal large" data-reveal>
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
    this.modal.foundation();

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

        const url = $(this).data("product-url");

        if (url) {
          instance.loading = true;
          button.addClass("js-loading");

          $.ajax({
            type: "get",
            url,
            dataType: "html",
            data: {
              view: "quickview",
            },
            success(response) {
              instance.modalContent.html(response);
              instance.modal.foundation("open");
              Autoloader.initAutoloadClasses();
              instance.loading = false;
            },
            complete() {
              setTimeout(() => {
                // Trigger an event for the binding of the wishlist
                $("body")[0].dispatchEvent(
                  new Event("shopify-wishlist.refresh"),
                );
              }, 100);

              setTimeout(() => {
                instance.loading = false;
                button.removeClass("js-loading");
              }, 200);
            },
          });
        }
      });
  }
}
