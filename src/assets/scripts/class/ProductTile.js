import {getSizedImageUrl} from "@shopify/theme-images"
import EventEmitter from "event-emitter-es6";
import $ from "jquery";


export class ProductTile extends EventEmitter {

    constructor(container) {
        super();

        this.container = container;
        //console.log(this.container);
        this.productHandle = this.container.getAttribute('data-handle');
        this.products = [];

        this.setSelectors();
        this.setProducts();
        this.initSwatches();
    }

    setProducts() {
        const instance = this;

        $.ajax({
            type: "get",
            url: "/products/" + this.productHandle,
            data: {
                view: "sibling"
            },
            success(response) {
                instance.products = JSON.parse(response).products;
            }
        });
    }

    setSelectors() {
        const selectors = {
            image: ".product-tile-image",
            quickview: "[data-product-quickview]"
        };

        this.selectors = {};

        for (const key in selectors) {
            if (selectors.hasOwnProperty(key)) {
                this.selectors[key] = this.container.querySelector(
                    selectors[key]
                );
            }
        }
    }

    initSwatches() {

        const instance = this;

        let swatchesRadio = instance.container.querySelectorAll('.color-swatch__input');

        $(swatchesRadio)
            .unbind("change.swatch")
            .bind("change.swatch", function(e) {
                e.preventDefault();

                let handle = $(this).val();
                let product = instance.getSelectedProduct(handle);
                instance.updateProduct(product);

            });

    }

    updateProduct(product){
        const instance = this;

        if (product != undefined) {
            let image = product.featured_image !== undefined ? product.featured_image : window.theme.noImageUrl

            instance.selectors.image.setAttribute('src', getSizedImageUrl(image, '335x400_crop_center'));
            instance.selectors.quickview.setAttribute('data-product-url', '/products/' + product.handle);
        }


    }

    getSelectedProduct(handle){
        const instance = this;
        for (let i = 0; i < instance.products.length; i++) {
            let object = instance.products[i];

            if (object.handle == handle) {
                return object;
            }
        }

    }


}