/**
 * Class Shopify Cart
 *
 * This class handles the Shopify cart and provided functions for manipulating cart items.
 * Uses a queue to synchronously call cart actions as recommended per the Shopify documentation.
 *
 * https://help.shopify.com/themes/development/getting-started/using-ajax-api
 */

import $ from "jquery";
import EventEmitter from "event-emitter-es6";

export class ShopifyCart extends EventEmitter {
  constructor() {
    super();

    // Holds the cart
    this.cart = {};

    // Holds an array of cart ajax actions in 'queue'
    this.queue = [];

    // Holds the queue
    this.queueActive = false;

    // Set the cart
    this.setCart();
  }

  /**
   * Get the cart
   *
   * @returns {*}
   */
  getCart() {
    return this.cart;
  }

  /**
   * Set the cart
   */
  setCart() {
    const instance = this;

    // Preload cart before ajax calling it
    if (localStorage.getItem("shopify_cart") !== null) {
      instance.updateCart(JSON.parse(localStorage.getItem("shopify_cart")));
    }

    instance.getCartAction();
  }

  /**
   * Update the cart object
   *
   * @param cart
   */
  updateCart(cart) {
    const instance = this;

    instance.cart = cart;

    instance.emit("cart.update");

    // Add the cart to local storage
    localStorage.setItem("shopify_cart", JSON.stringify(instance.cart));
  }

  /**
   * Force an ajax cart refresh
   */
  refreshCart() {
    this.getCartAction();
  }

  /**
   * Get Item count
   *
   * @returns {number}
   */
  getItemCount() {
    let quantity = 0;

    if (this.cart.hasOwnProperty("item_count") && this.cart.item_count) {
      quantity = parseInt(this.cart.item_count);
    }

    return quantity;
  }

  /**
   * Add an ajax action to the queue
   * Start the queue if it is inactive
   *
   * @param item
   */
  addActionToQueue(item) {
    const instance = this;

    // Add the action item to the queue
    instance.queue.push(item);

    // If the queue is inactive let's start it
    if (!instance.queueActive) {
      instance.moveAlongQueue();
    }
  }

  /**
   * Loops through each item in the queue and actions it.
   * Once the ajax call has resolved it proceeds to call the next item in the queue.
   */
  moveAlongQueue() {
    const instance = this;

    // Let's check if the queue has any items in it
    if (instance.queue.length) {
      // If there are queue items we need to update the active state of the queue
      instance.queueActive = true;

      // Get the first item in the queue
      const request = instance.queue.shift();

      // Call the appropriate action function
      switch (request.action) {
      case "addItem":
        instance
            .addItemAction(
            request.variantID,
            request.quantity,
            request.properties,
          )
            .then(
            () => {
              request.defer.resolve();
              instance.moveAlongQueue();
            },
            data => {
              request.defer.reject(data);
              instance.moveAlongQueue();
            },
          );
        break;

      case "removeItem":
        instance.removeItemAction(request.variantID).then(
          () => {
            request.defer.resolve();
            instance.moveAlongQueue();
          },
          data => {
            request.defer.reject(data);
            instance.moveAlongQueue();
          },
        );
        break;

      case "updateItem":
        instance.updateItemAction(request.variantID, request.quantity).then(
          () => {
            request.defer.resolve();
            instance.moveAlongQueue();
          },
          data => {
            request.defer.reject(data);
            instance.moveAlongQueue();
          },
        );
        break;

      default:
        break;
      }
    } else {
      // If the queue has finished we set the queue active to false
      instance.queueActive = false;
    }
  }

  /**
   * Get error message from response
   *
   * @param error
   * @returns {{error: string, message: string}}
   */
  getErrorResponse(error) {
    const response = {
      description: "",
      message: "",
    };

    if (error.hasOwnProperty("responseJSON")) {
      if (error.responseJSON.hasOwnProperty("message")) {
        response.message = error.responseJSON.message;
      }
      if (error.responseJSON.hasOwnProperty("description")) {
        response.description = error.responseJSON.description;
      }
    }

    return response;
  }

  /**
   * Get the cart from Shopify
   *
   * @returns {*}
   */
  getCartAction() {
    const instance = this;

    const defer = $.Deferred();

    $.ajax({
      type: "get",
      url: "/cart.js",
      dataType: "json",
      success(response) {
        instance.updateCart(response);
        defer.resolve();
      },
      error(errorThrown) {
        console.log("Error: failed to get cart");
        console.log(errorThrown);
        defer.reject(instance.getErrorResponse(errorThrown));
      },
    });

    return defer;
  }

  /**
   * Add 'add item' action to the queue
   *
   * @param variantID
   * @param quantity
   * @param properties
   * @returns {*} Deferred
   */
  addItem(variantID, quantity, properties) {
    const instance = this;

    const defer = $.Deferred();

    instance.addActionToQueue({
      action: "addItem",
      variantID,
      quantity,
      properties,
      defer,
    });

    return defer;
  }

  /**
   * Add an item to the cart
   *
   * !IMPORTANT: This function should not be called directly instead call
   * the 'addItem' function which forces this action to performed in a queue
   *
   * @param variantID
   * @param quantity
   * @returns {*} Deferred
   */
  addItemAction(variantID, quantity, properties) {
    const instance = this;

    const defer = $.Deferred();

    $.ajax({
      type: "post",
      url: "/cart/add.js",
      dataType: "json",
      data: {
        quantity,
        id: variantID,
        properties,
      },
      success(response) {
        instance.getCartAction().then(
          () => {
            defer.resolve();
          },
          () => {
            defer.reject();
          },
        );
      },
      error(errorThrown) {
        console.log("error");
        console.log(errorThrown);
        defer.reject(instance.getErrorResponse(errorThrown));
      },
    });

    return defer;
  }

  /**
   * Add 'remove an item' to the queue
   *
   * @param variantID
   * @returns {*} Deferred
   */
  removeItem(variantID) {
    const instance = this;

    const defer = $.Deferred();

    instance.addActionToQueue({
      action: "removeItem",
      variantID,
      defer,
    });

    return defer;
  }

  /**
   * Remove an item from the cart
   *
   * !IMPORTANT: This function should not be called directly instead call
   * the 'removeItem' function which forces this action to performed in a queue
   *
   * @param variantID
   * @returns {*} Deferred
   */
  removeItemAction(variantID) {
    const defer = $.Deferred();

    this.updateItemAction(variantID, 0).then(() => {
      defer.resolve();
    });

    return defer;
  }

  /**
   * Add 'update an item' to the queue
   *
   * @param variantID
   * @param quantity
   * @returns {*} Deferred
   */
  updateItem(variantID, quantity) {
    const instance = this;

    const defer = $.Deferred();

    instance.addActionToQueue({
      action: "updateItem",
      variantID,
      quantity,
      defer,
    });

    return defer;
  }

  /**
   * Update an item in the cart
   *
   * !IMPORTANT: This function should not be called directly instead call
   * the 'updateItem' function which forces this action to performed in a queue
   *
   * @param variantID
   * @param quantity
   * @returns {*} Deferred
   */
  updateItemAction(variantID, quantity) {
    const instance = this;

    const defer = $.Deferred();

    $.ajax({
      type: "post",
      url: "/cart/change.js",
      dataType: "json",
      data: {
        quantity,
        id: variantID,
      },
      success(response) {
        instance.updateCart(response);
        defer.resolve();
      },
      error(errorThrown) {
        console.log("error");
        console.log(errorThrown);
        defer.reject(instance.getErrorResponse(errorThrown));
      },
    });

    return defer;
  }
}
