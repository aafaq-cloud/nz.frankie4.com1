import {AbstractComponent} from "../class/AbstractComponent";

export class ComponentAccordionFooterItem extends AbstractComponent {
  constructor(component) {
    super(component);

    this.component.accordion = this;

    this.open = true;

    this.initAccordionToggle();
  }

  initAccordionToggle() {
    const accordionItemID = this.component.getAttribute("aria-controls");

    this.accordionItem = document.querySelector(`#${accordionItemID}`);

    this.accordionItem.accordion = this;

    const initialState = this.accordionItem.getAttribute("aria-expanded");

    if (typeof initialState !== "undefined" && initialState === "false") {
      this.closeAccordionItem();
    }

    this.component.addEventListener("click", () => this.toggleAccordionItem());

    this.component.addEventListener("accordion-footer-item.open", () => this.openAccordionItem());

    this.component.addEventListener("accordion-footer-item.close", () => this.closeAccordionItem());

  }

  toggleAccordionItem() {
    if (this.open) {
      this.closeAccordionItem();
    } else {
      this.openAccordionItem();
    }
  }

  openAccordionItem() {
    this.open = true;
    this.component.classList.remove("closed");
    this.accordionItem.setAttribute("aria-expanded", true);
  }

  closeAccordionItem() {
    this.open = false;
    this.component.classList.add("closed");
    this.accordionItem.setAttribute("aria-expanded", false);
  }
}
