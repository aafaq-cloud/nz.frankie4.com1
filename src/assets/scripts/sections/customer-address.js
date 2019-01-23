/**
 * Collection Section Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly coupled to the Collection section template.
 */

import $ from "jquery";
import {AbstractComponent} from "../class/AbstractComponent";

export class CustomerAddressesSection extends AbstractComponent {
  constructor(component) {

    component = $(component);

    super(component);

    this.initAddresses();
  }

  initAddresses() {
    const instance = this;

    instance.$newAddressForm = instance.component.find("#AddressNewForm");
    instance.$editAddresses = instance.component.find("#EditAddresses");

    if (!instance.$newAddressForm.length) {
      return;
    }

    // Initialize observers on address selectors, defined in shopify_common.js
    if (Shopify) {
      new Shopify.CountryProvinceSelector(
        "AddressCountryNew",
        "AddressProvinceNew",
        {
          hideElement: "AddressProvinceContainerNew",
        },
      );
    }

    // Initialize each edit form's country/province selector
    instance.$addresCountryOption = instance.component.find(
      ".address-country-option",
    );
    instance.$addresCountryOption.each(function() {
      const formId = $(this).data("form-id");
      const countrySelector = `AddressCountry_${formId}`;
      const provinceSelector = `AddressProvince_${formId}`;
      const containerSelector = `AddressProvinceContainer_${formId}`;

      new Shopify.CountryProvinceSelector(countrySelector, provinceSelector, {
        hideElement: containerSelector,
      });
    });

    // Toggle new/edit address forms
    instance.$addressNewToggle = instance.component.find(".address-new-toggle");
    instance.$addressNewToggle.on("click", () => {
      instance.$newAddressForm.toggleClass("hide");
      instance.$editAddresses.toggleClass("hide");
    });

    instance.$addressEditToggle = instance.component.find(".address-edit-toggle");
    instance.$addressEditToggle.on("click", function() {
      const formId = $(this).data("form-id");
      instance.$editAddress = instance.component.find(`#EditAddress_${formId}`);
      instance.$addressContainer = instance.component.find(
        `#AddressContainer_${formId}`,
      );

      if (!instance.$addressContainer.hasClass("active")) {
        $(".existing-customer-address").each(function() {
          $(this).removeClass("active");
        });
        $(".edit-customer-address").each(function() {
          $(this).addClass("hide");
        });
      }

      instance.$newAddressForm.addClass("hide");
      instance.$addressContainer.toggleClass("active");
      instance.$editAddresses.toggleClass("hide");
      instance.$editAddress.toggleClass("hide");
    });

    instance.$addressDelete = instance.component.find(".address-delete");
    instance.$addressDelete.on("click", function() {
      const $el = $(this);
      const formId = $el.data("form-id");
      const confirmMessage = $el.data("confirm-message");
      if (
        confirm(
          confirmMessage || "Are you sure you wish to delete this address?",
        )
      ) {
        Shopify.postLink(`/account/addresses/${formId}`, {
          parameters: {_method: "delete"},
        });
      }
    });
  }
}
