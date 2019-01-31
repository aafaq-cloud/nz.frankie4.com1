/**
 * Variant Selector Class
 *
 * Handles the binding of change events and provides methods for retrieving and updating values
 */

import $ from "jquery";
import EventEmitter from "event-emitter-es6";

export class VariantSelector extends EventEmitter {
  constructor(index, container) {
    super();

    container = $(container);

    const instance = this;

    instance.container = typeof container === "object" ? container : $("body");
    instance.index = index;
    instance.setKey();
    instance.setElements();

    // Break out if no variant selector found
    if (!instance.getElements().length) {
      return;
    }

    instance.setWrapper();
    instance.setType();
    instance.setOptions();
    instance.setValue();

    // Listen to the change of the input
    instance.elements.on("change", () => {
      // Update the selected value
      instance.setValue();

      // Let's emit a change event so it bound to
      instance.emit("change");
    });
  }

  /**
   * Get the selector option key
   */
  getKey() {
    return this.key;
  }

  /**
   * Set the selector option key
   */
  setKey() {
    this.key = `option${this.index}`;
  }

  /**
   * Get the selector DOM elements
   *
   * @returns {*|jQuery|HTMLElement}
   */
  getElements() {
    return this.elements;
  }

  /**
   * Set the selector DOM elements
   */
  setElements() {
    this.elements = this.container.find(
      `[data-single-option-selector][data-index="${this.index + 1}"]`,
    );
  }

  /**
   * Get the wrapper element
   *
   * @returns {string}
   */
  getWrapper() {
    return this.wrapper;
  }

  /**
   * Set the wrapper element
   *
   * @returns {string}
   */
  setWrapper() {
    this.wrapper = this.elements.parent();
  }

  /**
   * Get the type of selector
   *
   * @returns {string}
   */
  getType() {
    return this.type;
  }

  /**
   * Set the type of selector ('radio', 'select')
   */
  setType() {
    this.type =
      this.elements.prop("tagName") === "INPUT"
        ? this.elements.attr("type")
        : this.elements.prop("tagName").toLowerCase();
  }

  /**
   * Get the available options
   *
   * @returns {Array}
   */
  getOptions() {
    return this.options;
  }

  /**
   * Set the available options
   */
  setOptions() {
    const instance = this;

    instance.options = [];

    if (instance.type === "radio" || instance.type === "checkbox") {
      instance.elements.each(function() {
        const value = $(this).val();
        instance.options.push(value);
      });
    } else if (instance.type === "select") {
      instance.elements.find("option").each(function() {
        const value = $(this).val();
        if (instance.options[value] === -1) {
          instance.options.push(value);
        }
      });
    }
  }

  /**
   * Get the selected value
   *
   * @returns {*}
   */
  getValue() {
    return this.value;
  }

  /**
   * Set the selected value
   *
   * @param value
   */
  setValue(value) {
    const instance = this;

    if (value) {
      if (instance.type === "radio" || instance.type === "checkbox") {
        instance.elements.each(function() {
          $(this).prop("checked", $(this).val() === String(value));
        });
      } else {
        instance.elements.val(value);
      }

      instance.value = value;
    } else if (instance.type === "radio" || instance.type === "checkbox") {
      instance.value = instance.elements.filter(":checked").val();
    } else {
      instance.value = instance.elements.val();
    }
  }

  /**
   * Set the available values for the selector
   * If a disabled option is selected then the first enabled option will be selected
   *
   * @param values
   */
  setAvailableValues(values) {
    const instance = this;

    let options = null;

    if (instance.type === "radio" || instance.type === "checkbox") {
      options = instance.elements;
    } else {
      options = instance.elements.find("option");
    }

    if (options) {
      options.each(function() {
        const checkValue = String($(this).val());

        if (values.hasOwnProperty(checkValue)) {
          $(this).removeClass("unavailable");

          if (values[checkValue]) {
            $(this).prop("disabled", false);
            $(this).removeClass("sold-out");
          } else {
            $(this).prop('disabled', true);
            $(this).addClass("sold-out");
          }
        } else {
          $(this).prop("disabled", true);
          $(this).addClass("unavailable");
        }
      });
    }

    // Now we check if the currently selected option is enabled
    // If it's disabled then we will pick the first enabled option and set the
    // selector to that value

    const checked = options.filter(":checked");

    if (checked.prop("disabled")) {
      let newValue = null;

      options.each(function() {
        if ($(this).is(":enabled")) {
          newValue = $(this).val();
          return false;
        }

        if (!newValue) {
          if (!$(this).hasClass("unavailable")) {
            newValue = $(this).val();
          }
        }
      });

      if (newValue) {
        instance.setValue(newValue);
      }
    }

    // Set parent class if any children are available
    const valuesArray = Object.keys(values).map(e => {
      return values[e];
    });

    if (valuesArray.indexOf(true) > -1) {
      instance.getWrapper().removeClass("unavailable");
    } else {
      instance.getWrapper().addClass("unavailable");
    }

    // Trigger a change of the element
    if (instance.type !== "radio" && instance.type !== "checkbox") {
      instance.elements.trigger("custom.change");
    }
  }
}
