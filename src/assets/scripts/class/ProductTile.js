import {getSizedImageUrl} from "@shopify/theme-images";
import {formatMoney} from "@shopify/theme-currency";
import EventEmitter from "event-emitter-es6";
import $ from "jquery";


export class ProductTile extends EventEmitter {

    constructor(container) {
        super();

        this.container = container;
        this.productHandle = this.container.getAttribute('data-handle');
        this.products = [];



        this.setSelectors();
        if (this.selectors.swatches){
            this.setProducts();
        }

        // Get the base url so the collection carries across to the related product urls
        const currentUrl = this.selectorsSingle.link.getAttribute('href');
        this.urlBase = currentUrl.substring(0, (currentUrl.lastIndexOf('/') + 1));

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
            image2: ".product-tile-image-2",
            // quickview: "[data-product-quickview]",
            title: ".product-tile__title",
            link: ".cover-link",
            stickers: ".product-stickers",
            price: ".product-tile__price-container"
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

        this.updateSwatches();

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

    /**
    * Update title for the swatch to be the product title and remove swatch if no mapped product
    * */
    updateSwatches(){
        const instance = this;
        for (let i = 0; i < instance.selectors.swatches.length; ++i) {
            let handle = instance.selectors.swatches[i].value;
            let product = instance.getSelectedProduct(handle);

            if (product != null) {
                let next = instance.selectors.swatches[i].nextElementSibling;
                next.setAttribute('title', product.title);
            } else {
                let element = instance.selectors.swatches[i].parentNode;
                element.parentNode.removeChild(element);
            }
        }
    }

    updateProduct(product){
        const instance = this;

        if (product != undefined) {
            let image = product.featured_image !== undefined ? product.featured_image : window.theme.noImageUrl;

            instance.selectorsSingle.title.innerHTML = product.title;
            instance.selectorsSingle.image.setAttribute('src', getSizedImageUrl(product.images[0], '375x400_crop_center'));
            instance.selectorsSingle.image2.setAttribute('src', getSizedImageUrl(product.images[1], '375x400_crop_center'));
            // instance.selectorsSingle.quickview.setAttribute('data-product-url', instance.urlBase + product.handle);
            instance.selectorsSingle.link.setAttribute('href', instance.urlBase + product.handle);
            instance.selectorsSingle.price.innerHTML = instance.updatePrice(product);
            instance.selectorsSingle.stickers.innerHTML = instance.updateStickers(product);

            document.body.dispatchEvent(
                new Event("shopify-currency.refresh")
            );

        }

    }


    updatePrice(product) {
        // Add Price
        let itemPriceHtml = '';

        itemPriceHtml += '<span class="product-tile__price">';
        itemPriceHtml += formatMoney(product.price_min, theme.moneyFormat);
        itemPriceHtml += '</span>';

        if (product.compare_at_price_min > product.price_min) {
            itemPriceHtml += '<s class="product-tile__compare-price color-secondary-text text-small">';
            itemPriceHtml += formatMoney(product.compare_at_price_min, theme.moneyFormat);
            itemPriceHtml += '</s>';

        }
        return itemPriceHtml;
    }

    updateStickers(product) {
        let sale = false;
        let newItem = false;
        let restocked = false;
        let last_sizes = false;
        let preorder = false;
        let lastchance = false;
        let percent_sale = 0;

        let html = '';

        if (product.compare_at_price_min > product.price_min) {
            percent_sale = 100 - (((product.price_min/product.compare_at_price_min)) * 100).toFixed();
            sale = true;
        }
        if (product.tags) {
            for (let i = 0; i < product.tags.length; i++) {
                let tag = product.tags[i];
                if (tag == 'new'){
                    newItem = true;
                }
                if (tag == 'restocked'){
                    restocked = true;
                }
                if (tag == 'last_sizes'){
                    last_sizes = true;
                }
                if (tag == 'preorder'){
                    preorder = true;
                }
                if (tag == 'lastchance'){
                    lastchance = true;
                }
            }
        }

        if (sale || newItem || restocked || last_sizes){
           // html +=  '<div class="product-stickers">';

            if (sale){
                html +=  '<div class="product-sticker product-sticker__sale">';
                html +=  '<span class="text-small">' + percent_sale + '% off</span>';
                html +=  '</div>';
            } else if(newItem) {
                html +=  '<div class="product-sticker product-sticker__new">';
                html +=  '<span class="text-small">New</span>';
                html +=  '</div>';
            } else if (restocked) {
                html +=  '<div class="product-sticker product-sticker__restocked">';
                html +=  '<span class="text-small">Restocked</span>';
                html +=  '</div>';
            } else if(last_sizes) {
                html +=  '<div class="product-sticker product-sticker__last-sizes">';
                html +=  '<span class="text-small">Last Sizes</span>';
                html +=  '</div>';
            } else if(preorder) {
                html +=  '<div class="product-sticker product-sticker__preorder">';
                html +=  '<span class="text-small">Pre-Order</span>';
                html +=  '</div>';
            } else if(lastchance) {
                html +=  '<div class="product-sticker product-sticker__lastchance">';
                html +=  '<span class="text-small">Last Chance</span>';
                html +=  '</div>';
            }

            //html +=  '</div>';
        }
        return html;
    }

    getSelectedProduct(handle){
        const instance = this;
        for (let i = 0; i < instance.products.length; i++) {
            let object = instance.products[i];

            if (object.handle == handle) {
                return object;
            }
        }

        return null;

    }


}