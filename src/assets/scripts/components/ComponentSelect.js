/**
 * Select Component Class
 *
 * Creates a JS selector that binds to the native selector
 */

import $ from "jquery";
import {AbstractComponent} from "../class/AbstractComponent";

export class ComponentSelect extends AbstractComponent {
  constructor(component) {

    component = $(component);

    super(component);

    this.select = this.component.find("select");
    this.options = this.component.find("option");

    // Setup the JS Selector
    this.setJSSelect();
  }

  /**
   * Setup the JavaScript selector
   */
  setJSSelect() {
    const instance = this;

    if (instance.select.is(":disabled")) {
      return false;
    }

    instance.jsSelect = $(
      "<div class=\"js-select\">" +
        "<div class=\"selector\"><span class=\"label\"></span></div>" +
        "<ul class=\"options\"></ul>" +
        "</div>",
    );

    instance.jsSelectOpen = false;
    instance.jsSelectSelector = instance.jsSelect.find(".selector");
    instance.jsSelectLabel = instance.jsSelect.find(".label");
    instance.jsSelectOptions = instance.jsSelect.find(".options");

    // Clear the options
    instance.jsSelectOptions.html("");

    // Set the options from the selector
    instance.options.each(function() {
      const option = $(
        `<li data-value="${$(this).val()}">${$(this).html()}</li>`,
      );

      instance.jsSelectOptions.append(option);

      // Bind a click event to JS select options
      option.bind("click.js-select-option", function() {
        if (!$(this).hasClass("disabled") && !$(this).hasClass("selected")) {
          instance.select.val($(this).data("value"));
          instance.select.trigger("change");
        }

        instance.closeJSSelect();
      });
    });

    // Sync the JS Select with the native select
    instance.syncJSSelect();

    // Keep the JS Select bound to the native select
    instance.select.on("change custom.change", () => {
      instance.syncJSSelect();
    });

    // Bind the selector open and close events
    instance.jsSelectSelector.on("click", () => {
      if (instance.jsSelectOpen) {
        instance.closeJSSelect();
      } else {
        instance.openJSSelect();
      }
    });

    // Now that we've setup the js selector let's add it to the DOM
    instance.component.prepend(instance.jsSelect);
  }

  /**
   * Sync the JavaScript select with native select
   */
  syncJSSelect() {
    this.syncOptions();
    this.syncValue();
  }

  /**
   * Sync the JavaScript select options with native select options
   */
  syncOptions() {
    const instance = this;

    instance.options.each(function() {
      const jsOption = instance.jsSelectOptions.find(
        `[data-value="${$(this).val()}"]`,
      );
      jsOption.toggleClass("disabled", $(this).is(":disabled"));
      jsOption.toggleClass("selected", $(this).is(":selected"));
      jsOption.toggleClass("unavailable", $(this).hasClass("unavailable"));
    });
  }

  /**
   * Sync the JavaScript select value with native select value
   */
  syncValue() {
    this.jsSelectLabel.html(this.select.find("option:selected").text());
  }

  /**
   * Open the JS Selector
   */
  openJSSelect() {
    const instance = this;

    instance.jsSelect.addClass("open");
    instance.jsSelectOpen = true;

    // Create a click event on the body to close the js selector if user
    // clicks outside js selector element container
    setTimeout(() => {
      $("body")
        .unbind("click.js-toggle")
        .bind("click.js-toggle", e => {
          // Check if click outside toggle component
          if (!$(e.target).parents(".component-select").length) {
            instance.closeJSSelect();
          }
        });
    });
  }

  /**
   * Close the JS Selector
   */
  closeJSSelect() {
    const instance = this;

    instance.jsSelect.removeClass("open");
    instance.jsSelectOpen = false;

    // Clean up the body binded click event
    $("body").unbind("click.js-toggle");
  }
}
