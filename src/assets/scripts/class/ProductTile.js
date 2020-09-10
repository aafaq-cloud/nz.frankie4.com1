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
        console.log('tile');

        this.setSelectors();
        if (this.selectors.swatches){
            this.setProducts();

        }
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
                instance.initSwatches();
            }
        });
    }

    setSelectors() {
        const selectors = {
            swatches: ".color-swatch__input"
        };
        const selectorsSingle = {
            image: ".product-tile-image",
            quickview: "[data-product-quickview]",
            title: ".product-tile__title"
        };

        this.selectors = {};

        for (const key in selectors) {
            if (selectors.hasOwnProperty(key)) {
                this.selectors[key] = this.container.querySelectorAll(selectors[key]);
            }
        }

        this.selectorsSingle = {};

        for (const key in selectorsSingle) {
            if (selectorsSingle.hasOwnProperty(key)) {
                this.selectorsSingle[key] = this.container.querySelector(
                    selectorsSingle[key]
                );
            }
        }
    }

    initSwatches() {

        const instance = this;

        let swatchesRadio = instance.selectors.swatches;

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
            let image = product.featured_image !== undefined ? product.featured_image : window.theme.noImageUrl;

            instance.selectorsSingle.title.innerHTML = product.title;
            instance.selectorsSingle.image.setAttribute('src', getSizedImageUrl(image, '335x400_crop_center'));
            instance.selectorsSingle.quickview.setAttribute('data-product-url', '/products/' + product.handle);
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