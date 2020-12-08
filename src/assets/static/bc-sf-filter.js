// Override Settings
var bcSfFilterSettings = {
    general: {
        limit: 48,
        /* Optional */
        // loadProductFirst: true,
        paginationType: "infinite",
        paginationTypeAdvanced: 0,
        filterTreeMobileStyle: "style3"
    }
};

// Declare Templates
var bcSfFilterTemplate = {
    'soldOutClass': 'sold-out',
    'saleClass': 'on-sale',
    'soldOutLabelHtml': '<div>' + bcSfFilterConfig.label.sold_out + '</div>',
    'saleLabelHtml': '<div>' + bcSfFilterConfig.label.sale + '</div>',
    'vendorHtml': '<div>{{itemVendorLabel}}</div>',

    // Grid Template
    'productGridItemHtml': ' <div class="cell small-6 large-3 grid-x align-stretch {{itemHandle}} {{isPrimary}}">' +
        '<article class="product-tile text-center grid-y" data-handle="{{itemHandle}}">' +
        // '{% include "swym-product-view", product: product %}' +
        // '<button class="swym-button swym-add-to-wishlist-view-product product_{{product.id}}" data-swaction="addToWishlist" data-product-id="{{product.id | json}}" style="font-size: 25px; width: 25px"></button>' +
        '<div class="cell product-tile__image-container">' + 
        '<a href="{{itemUrl}}" class="cover-link" tabindex="-1" aria-hidden="true"></a>' +
        '{{itemImages}}' +
        '<button data-product-quickview data-product-url="{{itemUrl}}" class="product-tile__quickview button button-secondary button-small">Quickview</button>' +

        '</div>' +

        '<div class="cell product-tile__body grid-y">' +
        '<h6 class="product-tile__title grid-x align-middle align-center">{{itemTitle}}</h6>' +
        '<div class="cell shrink yotpo bottomLine" data-product-id="{{itemId}}"></div>' +
        '<div class="product-tile__info">' +

        '{{itemPrice}}' +

        '<div class="grid-x align-center">' +
        '{{itemSwatches}}' +
        '</div>' +

        '</div>' +
        '</div>' +

        '{{itemBadges}}' +

        '<div class="variant-container"></div>' +

        '</article>' +
        '</div>',

    // Pagination Template
    'previousActiveHtml': '<li><a href="{{itemUrl}}">&larr;</a></li>',
    'previousDisabledHtml': '<li class="disabled"><span>&larr;</span></li>',
    'nextActiveHtml': '<li><a href="{{itemUrl}}">&rarr;</a></li>',
    'nextDisabledHtml': '<li class="disabled"><span>&rarr;</span></li>',
    'pageItemHtml': '<li><a href="{{itemUrl}}">{{itemTitle}}</a></li>',
    'pageItemSelectedHtml': '<li><span class="active">{{itemTitle}}</span></li>',
    'pageItemRemainHtml': '<li><span>{{itemTitle}}</span></li>',
    'paginateHtml': '<ul class="pagination-custom">{{previous}}{{pageItems}}{{next}}</ul>',

    // Sorting Template
    'sortingHtml': '<label for="bc-sf-filter-top-sorting-select" class="label--hidden">' + bcSfFilterConfig.label.sorting + '</label><select id="bc-sf-filter-top-sorting-select" class="collection-sort__input">{{sortingItems}}</select>',
};

/************************** BUILD PRODUCT LIST **************************/

// Build Product Grid Item
BCSfFilter.prototype.buildProductGridItem = function(data, index) {

    /*** Prepare data ***/
    var images = data.images_info;
    // Displaying price base on the policy of Shopify, have to multiple by 100
    var soldOut = !data.available; // Check a product is out of stock
    var onSale = data.compare_at_price_min > data.price_min; // Check a product is on sale
    var priceVaries = data.price_min != data.price_max; // Check a product has many prices
    // Get First Variant (selected_or_first_available_variant)
    var firstVariant = data['variants'][0];
    if (getParam('variant') !== null && getParam('variant') != '') {
        var paramVariant = data.variants.filter(function(e) { return e.id == getParam('variant'); });
        if (typeof paramVariant[0] !== 'undefined') firstVariant = paramVariant[0];
    } else {
        for (var i = 0; i < data['variants'].length; i++) {
            if (data['variants'][i].available) {
                firstVariant = data['variants'][i];
                break;
            }
        }
    }
    /*** End Prepare data ***/

        // Get Template
    var itemHtml = bcSfFilterTemplate.productGridItemHtml;

    // Add Thumbnail
    var itemThumbUrl = images.length > 0 ? this.optimizeImage(images[0]['src']) : bcSfFilterConfig.general.no_image_url;
    itemHtml = itemHtml.replace(/{{itemThumbUrl}}/g, itemThumbUrl);

    itemHtml = itemHtml.replace(/{{itemImages}}/g, buildImages(data));

    itemHtml = itemHtml.replace(/{{itemSwatches}}/g, buildSwatches(data));

    // Add Price
    var itemPriceHtml = '';

    itemPriceHtml += '<div class="product-tile__price-container">';

    itemPriceHtml += '<span class="product-tile__price">';
    itemPriceHtml += bcsffilter.formatMoney(data.price_min * 100);
    itemPriceHtml += '</span>';

    if (onSale) {
        itemPriceHtml += '<s class="product-tile__compare-price color-secondary-text text-small">';
        itemPriceHtml += bcsffilter.formatMoney(data.compare_at_price_min * 100);
        itemPriceHtml += '</s>';
    }

    itemPriceHtml += '</div>';

    itemHtml = itemHtml.replace(/{{itemPrice}}/g, itemPriceHtml);

    var wishlistHTML = '';
    if (ShopifyWishlist.customerid) {
        wishlistHTML +=  '<a class="product-tile__wishlist-add" data-shopify-wishlist-add data-shopify-wishlist-product-handle="{{ itemHandle }}">';
        wishlistHTML += '<svg class="icon icon-heart icon--full-color" width="60px" height="60px" viewBox="0 0 60 60" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="Icons-/-Basic-/-Favourites" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><path class="fill" d="M57.1396154,24.3780769 C56.0042308,29.1919231 53.3723077,33.5776923 49.5357692,37.0530769 L29.8326923,54.6319231 L10.4676923,37.0576923 C6.62423077,33.5753846 3.99346154,29.1907692 2.85692308,24.3769231 C2.04,20.9188462 2.37576923,18.9653846 2.37692308,18.9526923 L2.39423077,18.8361538 C3.14423077,10.3911538 9.00692308,4.26076923 16.3361538,4.26076923 C21.7442308,4.26076923 26.505,7.58384615 28.7642308,12.9319231 L29.8269231,15.4507692 L30.8896154,12.9319231 C33.1130769,7.66576923 38.1253846,4.26192308 43.6615385,4.26192308 C50.9896154,4.26192308 56.8534615,10.3923077 57.6184615,18.9469231 C57.6207692,18.9653846 57.9565385,20.92 57.1396154,24.3780769 Z" id="Path" fill="#FFFFFF" fill-rule="nonzero"></path><path class="outline" d="M59.8973077,18.5869231 C59.0215385,8.94769231 52.1988462,1.95423077 43.6603846,1.95423077 C37.9719231,1.95423077 32.7634615,5.01538462 29.8326923,9.92153846 C26.9284615,4.95192308 21.9334615,1.95307692 16.3361538,1.95307692 C7.79884615,1.95307692 0.975,8.94653846 0.100384615,18.5857692 C0.0311538462,19.0115385 -0.252692308,21.2523077 0.610384615,24.9065385 C1.85423077,30.1773077 4.72730769,34.9715385 8.91692308,38.7676923 L29.8188462,57.7357692 L51.0796154,38.7688462 C55.2692308,34.9715385 58.1423077,30.1784615 59.3861538,24.9065385 C60.2492308,21.2534615 59.9653846,19.0126923 59.8973077,18.5869231 Z M57.1396154,24.3780769 C56.0042308,29.1919231 53.3723077,33.5776923 49.5357692,37.0530769 L29.8326923,54.6319231 L10.4676923,37.0576923 C6.62423077,33.5753846 3.99346154,29.1907692 2.85692308,24.3769231 C2.04,20.9188462 2.37576923,18.9653846 2.37692308,18.9526923 L2.39423077,18.8361538 C3.14423077,10.3911538 9.00692308,4.26076923 16.3361538,4.26076923 C21.7442308,4.26076923 26.505,7.58384615 28.7642308,12.9319231 L29.8269231,15.4507692 L30.8896154,12.9319231 C33.1130769,7.66576923 38.1253846,4.26192308 43.6615385,4.26192308 C50.9896154,4.26192308 56.8534615,10.3923077 57.6184615,18.9469231 C57.6207692,18.9653846 57.9565385,20.92 57.1396154,24.3780769 Z" id="Shape" fill="#2C2F35" fill-rule="nonzero"></path></g></svg>'
        wishlistHTML += '</a>';
    }else{
        wishlistHTML +=  '<a class="product-tile__wishlist-add" href="/pages/wishlist">';
        wishlistHTML += '<svg class="icon icon-heart icon--full-color" width="60px" height="60px" viewBox="0 0 60 60" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="Icons-/-Basic-/-Favourites" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><path class="fill" d="M57.1396154,24.3780769 C56.0042308,29.1919231 53.3723077,33.5776923 49.5357692,37.0530769 L29.8326923,54.6319231 L10.4676923,37.0576923 C6.62423077,33.5753846 3.99346154,29.1907692 2.85692308,24.3769231 C2.04,20.9188462 2.37576923,18.9653846 2.37692308,18.9526923 L2.39423077,18.8361538 C3.14423077,10.3911538 9.00692308,4.26076923 16.3361538,4.26076923 C21.7442308,4.26076923 26.505,7.58384615 28.7642308,12.9319231 L29.8269231,15.4507692 L30.8896154,12.9319231 C33.1130769,7.66576923 38.1253846,4.26192308 43.6615385,4.26192308 C50.9896154,4.26192308 56.8534615,10.3923077 57.6184615,18.9469231 C57.6207692,18.9653846 57.9565385,20.92 57.1396154,24.3780769 Z" id="Path" fill="#FFFFFF" fill-rule="nonzero"></path><path class="outline" d="M59.8973077,18.5869231 C59.0215385,8.94769231 52.1988462,1.95423077 43.6603846,1.95423077 C37.9719231,1.95423077 32.7634615,5.01538462 29.8326923,9.92153846 C26.9284615,4.95192308 21.9334615,1.95307692 16.3361538,1.95307692 C7.79884615,1.95307692 0.975,8.94653846 0.100384615,18.5857692 C0.0311538462,19.0115385 -0.252692308,21.2523077 0.610384615,24.9065385 C1.85423077,30.1773077 4.72730769,34.9715385 8.91692308,38.7676923 L29.8188462,57.7357692 L51.0796154,38.7688462 C55.2692308,34.9715385 58.1423077,30.1784615 59.3861538,24.9065385 C60.2492308,21.2534615 59.9653846,19.0126923 59.8973077,18.5869231 Z M57.1396154,24.3780769 C56.0042308,29.1919231 53.3723077,33.5776923 49.5357692,37.0530769 L29.8326923,54.6319231 L10.4676923,37.0576923 C6.62423077,33.5753846 3.99346154,29.1907692 2.85692308,24.3769231 C2.04,20.9188462 2.37576923,18.9653846 2.37692308,18.9526923 L2.39423077,18.8361538 C3.14423077,10.3911538 9.00692308,4.26076923 16.3361538,4.26076923 C21.7442308,4.26076923 26.505,7.58384615 28.7642308,12.9319231 L29.8269231,15.4507692 L30.8896154,12.9319231 C33.1130769,7.66576923 38.1253846,4.26192308 43.6615385,4.26192308 C50.9896154,4.26192308 56.8534615,10.3923077 57.6184615,18.9469231 C57.6207692,18.9653846 57.9565385,20.92 57.1396154,24.3780769 Z" id="Shape" fill="#2C2F35" fill-rule="nonzero"></path></g></svg>'
        wishlistHTML += '</a>';
    }

    itemHtml = itemHtml.replace(/{{itemWishlist}}/g, wishlistHTML);
    itemHtml = itemHtml.replace(/{{itemBadges}}/g, buildBadges(data));

    // Add soldOut class
    var soldOutClass = soldOut ? bcSfFilterTemplate.soldOutClass : '';
    itemHtml = itemHtml.replace(/{{soldOutClass}}/g, soldOutClass);

    // Add onSale class
    var saleClass = onSale ? bcSfFilterTemplate.saleClass : '';
    itemHtml = itemHtml.replace(/{{saleClass}}/g, saleClass);

    // Add soldOut Label
    var itemSoldOutLabelHtml = soldOut ? bcSfFilterTemplate.soldOutLabelHtml : '';
    itemHtml = itemHtml.replace(/{{itemSoldOutLabel}}/g, itemSoldOutLabelHtml);

    // Add onSale Label
    var itemSaleLabelHtml = onSale ? bcSfFilterTemplate.saleLabelHtml : '';
    itemHtml = itemHtml.replace(/{{itemSaleLabel}}/g, itemSaleLabelHtml);

    // Add Vendor
    var itemVendorHtml = bcSfFilterConfig.custom.vendor_enable ? bcSfFilterTemplate.vendorHtml.replace(/{{itemVendorLabel}}/g, data.vendor) : '';
    itemHtml = itemHtml.replace(/{{itemVendor}}/g, itemVendorHtml);

    // Add main attribute (Always put at the end of this function)
    itemHtml = itemHtml.replace(/{{itemId}}/g, data.id);
    itemHtml = itemHtml.replace(/{{itemHandle}}/g, data.handle);

    const isPrimary = (data.tags.indexOf('primary') != -1) ? 'primary' : '';
    itemHtml = itemHtml.replace(/{{isPrimary}}/g, isPrimary);

    itemHtml = itemHtml.replace(/{{itemTitle}}/g, data.title);
    itemHtml = itemHtml.replace(/{{itemUrl}}/g, this.buildProductItemUrl(data));

    return itemHtml;
};

// Build Product List Item
BCSfFilter.prototype.buildProductListItem = function(data) {
    // // Add Description
    // var itemDescription = jQ('<p>' + data.body_html + '</p>').text();
    // // Truncate by word
    // itemDescription = (itemDescription.split(" ")).length > 51 ? itemDescription.split(" ").splice(0, 51).join(" ") + '...' : itemDescription.split(" ").splice(0, 51).join(" ");
    // // Truncate by character
    // itemDescription = itemDescription.length > 350 ? itemDescription.substring(0, 350) + '...' : itemDescription.substring(0, 350);
    // itemHtml = itemHtml.replace(/{{itemDescription}}/g, itemDescription);
};

// Customize data to suit the data of Shopify API
BCSfFilter.prototype.prepareProductData = function(data) {
    for (var k in data) {
        // Add Options
        var optionsArr = [];
        for (var i in data[k]['options_with_values']) {
            optionsArr.push(data[k]['options_with_values'][i]['name']);
        }
        data[k]['options'] = optionsArr;

        // Customize variants
        for (var i in data[k]['variants']) {
            var variantOptionArr = [];
            var count = 1;
            var variant = data[k]['variants'][i];
            // Add Options
            var variantOptions = variant['merged_options'];
            if (Array.isArray(variantOptions)) {
                for (var j = 0; j < variantOptions.length; j++) {
                    var temp = variantOptions[j].split(':');
                    data[k]['variants'][i]['option' + (parseInt(j) + 1)] = temp[1];
                    data[k]['variants'][i]['option_' + temp[0]] = temp[1];
                    variantOptionArr.push(temp[1]);
                }
                data[k]['variants'][i]['options'] = variantOptionArr;
            }
            data[k]['variants'][i]['compare_at_price'] = parseFloat(data[k]['variants'][i]['compare_at_price']) * 100;
            data[k]['variants'][i]['price'] = parseFloat(data[k]['variants'][i]['price']) * 100;
        }

        // Add Description
        data[k]['description'] = data[k]['body_html'];
    }
    return data;
};

function buildImages(data) {
    var images = data.images_info;

    var html = '';
    // Build Main Image
    var thumbUrl = images.length > 0 ? bcsffilter.optimizeImage(images[0]['src'], '335x400_crop_center') : bcSfFilterConfig.general.no_image_url;
    html += '<img src="' + thumbUrl + '" class=" product-tile-image" />';
    // Build Image Swap
    var flipImageUrl = images.length > 1 ? bcsffilter.optimizeImage(images[1]['src']) : thumbUrl;
    //html += '<img src="' + flipImageUrl + '" class=" product-tile-image secondary" />';


    return html;
}

function buildSwatches(data) {

    var html = '';
    html += '<div class="product-tile__swatches">';


    if (data.tags) {

        //var colour = data.handle.replace(/-/g," ").replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
        var colour = data.handle.charAt(0).toUpperCase() + data.handle.replace(/-/g," ").slice(1);
        html += '<div class="color-swatch color-swatch--tile"><input checked type="radio" name="colors--'+ data.id +'" id="'+ data.handle +'--'+ data.id +'--'+ data.handle +'" class="color-swatch__input" value="'+ data.handle +'"> <label for="'+ data.handle +'--'+ data.id +'--'+ data.handle +'" title="' + colour + '" aria-label="'+ data.handle +'" class="color-swatch__label" style="--option-color:#dab5a2; --option-border-color:#dab5a2;"><img src="' + window.theme.cdnBase + data.handle +'.png"/></label></div>';


        for (var i = 0; i < data.tags.length; i++) {

            var tag = data.tags[i];

            if(tag.includes("variant_")){

                var handle = tag.replace("variant_", "");
                //var colour = handle.replace(/-/g," ").replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
                var colour = handle.charAt(0).toUpperCase() + handle.replace(/-/g," ").slice(1);

                //html += '<div class="swatch" data-handle="' + handle + '"></div>';

                html += '<div class="color-swatch color-swatch--tile"><input type="radio" name="colors--'+ data.id +'" id="'+ handle +'--'+ data.id +'--'+ handle +'" class="color-swatch__input" value="'+ handle +'"> <label for="'+ handle +'--'+ data.id +'--'+ handle +'" title="' + colour + '" aria-label="'+ handle +'" class="color-swatch__label" style="--option-color:#dab5a2; --option-border-color:#dab5a2;"><img src="'+ window.theme.cdnBase + handle +'.png"/></label></div>';

//               html += '<div class="color-swatch color-swatch--tile">';
//               html += '<input type="radio" name="' + data.id + '" id="' + data.id + '-' + handle + '" class="color-swatch__input" value="' + handle + '">';
//               html += '<label for="' + handle +'--' + data.id '" title="'+handle+'" class="color-swatch__label"></label>';
//               html += '</div>';

                //html += '<div class="swatch" data-handle="' + handle + '"></div>';


            }


        }

        html += '<div class="more-colours">';
        html += '<a href="{{itemUrl}}">+</a>';
        html += '</div>';

    }
    html += '</div>';

    return html;
}

function buildBadges(data) {
    var sale = false;
    var newItem = false;
    var restocked = false;
    var last_sizes = false;
    var preorder = false;
    var lastchance = false;

    var html = '';
    html +=  '<div class="product-stickers">';

    if (data.compare_at_price_min > data.price_min) {
        sale = true;
    }
    if (data.tags) {
        for (var i = 0; i < data.tags.length; i++) {
            var tag = data.tags[i];
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

        if (sale){
            html +=  '<div class="product-sticker product-sticker__sale">';
            html +=  '<span class="text-small">' + data.percent_sale_min + '% off</span>';
            html +=  '</div>';
        } else if(newItem) {
            html +=  '<div class="product-sticker product-sticker__new">';
            html +=  '<span class="text-small">New</span>';
            html +=  '</div>';
        } else if (restocked) {
            html +=  '<div class="product-sticker product-sticker__restocked">';
            html +=  '<span class="text-small">Restocked</span>';
            html +=  '</div>';
        } else if(last_sizes){
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

    }
    html +=  '</div>';
    return html;
}


/************************** END BUILD PRODUCT LIST **************************/

// Build Pagination
BCSfFilter.prototype.buildPagination = function(totalProduct) {
    if (this.getSettingValue('general.paginationType') == 'default') {
        // Get page info
        var currentPage = parseInt(this.queryParams.page);
        var totalPage = Math.ceil(totalProduct / this.queryParams.limit);

        // If it has only one page, clear Pagination
        if (totalPage == 1) {
            jQ(this.selector.bottomPagination).html('');
            return false;
        }

        if (this.getSettingValue('general.paginationType') == 'default') {
            var paginationHtml = bcSfFilterTemplate.paginateHtml;

            // Build Previous
            var previousHtml = (currentPage > 1) ? bcSfFilterTemplate.previousActiveHtml : bcSfFilterTemplate.previousDisabledHtml;
            previousHtml = previousHtml.replace(/{{itemUrl}}/g, this.buildToolbarLink('page', currentPage, currentPage - 1));
            paginationHtml = paginationHtml.replace(/{{previous}}/g, previousHtml);

            // Build Next
            var nextHtml = (currentPage < totalPage) ? bcSfFilterTemplate.nextActiveHtml :  bcSfFilterTemplate.nextDisabledHtml;
            nextHtml = nextHtml.replace(/{{itemUrl}}/g, this.buildToolbarLink('page', currentPage, currentPage + 1));
            paginationHtml = paginationHtml.replace(/{{next}}/g, nextHtml);

            // Create page items array
            var beforeCurrentPageArr = [];
            for (var iBefore = currentPage - 1; iBefore > currentPage - 3 && iBefore > 0; iBefore--) {
                beforeCurrentPageArr.unshift(iBefore);
            }
            if (currentPage - 4 > 0) {
                beforeCurrentPageArr.unshift('...');
            }
            if (currentPage - 4 >= 0) {
                beforeCurrentPageArr.unshift(1);
            }
            beforeCurrentPageArr.push(currentPage);

            var afterCurrentPageArr = [];
            for (var iAfter = currentPage + 1; iAfter < currentPage + 3 && iAfter <= totalPage; iAfter++) {
                afterCurrentPageArr.push(iAfter);
            }
            if (currentPage + 3 < totalPage) {
                afterCurrentPageArr.push('...');
            }
            if (currentPage + 3 <= totalPage) {
                afterCurrentPageArr.push(totalPage);
            }

            // Build page items
            var pageItemsHtml = '';
            var pageArr = beforeCurrentPageArr.concat(afterCurrentPageArr);
            for (var iPage = 0; iPage < pageArr.length; iPage++) {
                if (pageArr[iPage] == '...') {
                    pageItemsHtml += bcSfFilterTemplate.pageItemRemainHtml;
                } else {
                    pageItemsHtml += (pageArr[iPage] == currentPage) ? bcSfFilterTemplate.pageItemSelectedHtml : bcSfFilterTemplate.pageItemHtml;
                }
                pageItemsHtml = pageItemsHtml.replace(/{{itemTitle}}/g, pageArr[iPage]);
                pageItemsHtml = pageItemsHtml.replace(/{{itemUrl}}/g, this.buildToolbarLink('page', currentPage, pageArr[iPage]));
            }
            paginationHtml = paginationHtml.replace(/{{pageItems}}/g, pageItemsHtml);

            jQ(this.selector.bottomPagination).html(paginationHtml);
        }
    }
};

/************************** BUILD TOOLBAR **************************/

// Build Sorting
BCSfFilter.prototype.buildFilterSorting = function() {
    if (bcSfFilterTemplate.hasOwnProperty('sortingHtml')) {
        jQ(this.selector.topSorting).html('');

        var sortingArr = this.getSortingList();
        if (sortingArr) {
            // Build content
            var sortingItemsHtml = '';
            for (var k in sortingArr) {
                sortingItemsHtml += '<option value="' + k +'">' + sortingArr[k] + '</option>';
            }
            var html = bcSfFilterTemplate.sortingHtml.replace(/{{sortingItems}}/g, sortingItemsHtml);
            jQ(this.selector.topSorting).html(html);

            // Set current value
            jQ(this.selector.topSorting + ' select').val(this.queryParams.sort);
        }
    }
};

// Build Display type (List / Grid / Collage)
// BCSfFilter.prototype.buildFilterDisplayType = function() {
//     var itemHtml = '<a href="' + this.buildToolbarLink('display', 'list', 'grid') + '" title="Grid view" class="change-view bc-sf-filter-display-grid" data-view="grid"><span class="icon-fallback-text"><i class="fa fa-th" aria-hidden="true"></i><span class="fallback-text">Grid view</span></span></a>';
//     itemHtml += '<a href="' + this.buildToolbarLink('display', 'grid', 'list') + '" title="List view" class="change-view bc-sf-filter-display-list" data-view="list"><span class="icon-fallback-text"><i class="fa fa-list" aria-hidden="true"></i><span class="fallback-text">List view</span></span></a>';
//     jQ(this.selector.topDisplayType).html(itemHtml);

//     // Active current display type
//     jQ(this.selector.topDisplayType).find('.bc-sf-filter-display-list').removeClass('active');
//     jQ(this.selector.topDisplayType).find('.bc-sf-filter-display-grid').removeClass('active');
//     if (this.queryParams.display == 'list') {
//         jQ(this.selector.topDisplayType).find('.bc-sf-filter-display-list').addClass('active');
//     } else if (this.queryParams.display == 'grid') {
//         jQ(this.selector.topDisplayType).find('.bc-sf-filter-display-grid').addClass('active');
//     }
// };

/************************** END BUILD TOOLBAR **************************/

// Add additional feature for product list, used commonly in customizing product list
BCSfFilter.prototype.buildExtrasProductList = function(data, eventType) {};

// Build additional elements
BCSfFilter.prototype.buildAdditionalElements = function(data, eventType) {

    var _this = this;
    var totalProduct = data.total_product + '<span> ' + bcSfFilterConfig.label.items_with_count_other + '</span>';
    if (data.total_product == 1) {
        totalProduct = data.total_product + '<span> ' + bcSfFilterConfig.label.items_with_count_one + '</span>';
    }
    totalProduct = jQ.parseHTML(totalProduct);


    if (this.queryParams.hasOwnProperty('pf_t_colour') || this.queryParams.hasOwnProperty('pf_opt_size')) {
        jQ('#bc-sf-filter-products').removeClass('primary-only');
        jQ('#bc-sf-filter-total-product').html(totalProduct);

    } else {
        if (jQ('#bc-sf-filter-products').attr('data-primary') == "true"){
            jQ('#bc-sf-filter-products').addClass('primary-only');
        } else {
        jQ('#bc-sf-filter-total-product').html(totalProduct);
        }
    }

    // Refresh Quickview
    AppQuickview.initQuickViewButtons();
    AppProductList.initProductList();

    //console.log(data);

    document.dispatchEvent(
        new Event("products.refresh"),
    );
    document.body.dispatchEvent(
        new Event("shopify-currency.refresh")
    );
};