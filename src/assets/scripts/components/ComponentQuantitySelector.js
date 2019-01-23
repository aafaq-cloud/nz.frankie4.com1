/**
 * Quantity Selector Component Class
 *
 * Creates a JS selector that binds to the native selector
 */

import $ from "jquery";
import {AbstractComponent} from "../class/AbstractComponent";

export class ComponentQuantitySelector extends AbstractComponent {
  constructor(component) {

    component = $(component);

    super(component);

    this.quantityRemove = this.component.find(".js-quantity-remove");
    this.quantityAdd = this.component.find(".js-quantity-add");
    this.quantity = this.component.find("input");

    this.min = this.quantity.attr("min")
      ? parseInt(this.quantity.attr("min"))
      : 0;
    this.max = this.quantity.attr("max")
      ? parseInt(this.quantity.attr("max"))
      : -1;

    this.initQuantitySelector();
  }

  /**
   * Initialise the quantity selector
   */
  initQuantitySelector() {
    const instance = this;

    instance.quantityRemove.on("click", () => {
      instance.removeQuantity();
    });

    instance.quantityAdd.on("click", () => {
      instance.addQuantity();
    });

    instance.quantity.on("change paste keyup", () => {
      instance.cleanQuantitySelector();
    });
  }

  /**
   * Clean the quantity input value to ensure it's an integer
   *
   * @returns {Number} The cleaned quantity input value
   */
  cleanQuantitySelector() {
    const instance = this;

    let value = parseInt(instance.quantity.val());
    value = value > 1 ? value : 1;

    instance.quantity.val(value);

    return value;
  }

  /**
   * Remove one quantity
   */
  removeQuantity() {
    const instance = this;

    let value = instance.cleanQuantitySelector();
    value = value > instance.min ? --value : instance.min;

    instance.quantity.val(value);
  }

  /**
   * Add one quantity
   */
  addQuantity() {
    const instance = this;

    let value = instance.cleanQuantitySelector();
    value = value > 0 ? ++value : 1;

    instance.quantity.val(value);
  }
}
