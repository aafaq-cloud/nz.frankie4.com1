/**
 * Contact Section Script
 * ------------------------------------------------------------------------------
 * Handles the retrieval of support pages based on the user text for the search input.
 */

import {AbstractComponent} from "../class/AbstractComponent";

export class ContactFormSection extends AbstractComponent {
  constructor(component) {
    super(component);
    this.initFormDisplay();
  }


  initFormDisplay() {
    const formContainer = this.component.querySelector(".form-container");
    const showFormButton = this.component.querySelector(".show-form");

    const errorsContainer = this.component.querySelector(".errors");
    const successContainer = this.component.querySelector(".form-success");

    if (errorsContainer || successContainer) {
      formContainer.classList.add("open");
    }

    showFormButton.addEventListener("click", () => {
      formContainer.classList.add("open");
    });

  }

}
