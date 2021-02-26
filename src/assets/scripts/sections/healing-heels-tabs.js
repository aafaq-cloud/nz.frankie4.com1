import {AbstractComponent} from "../class/AbstractComponent";

export class HealingHeelsTabsSection extends AbstractComponent {
  constructor(component) {
    super(component);

    this.tabHeadings = this.component.querySelectorAll('.tab');
    this.tabContent = this.component.querySelectorAll('.tab-content');
    this.initTabs();
  }


  initTabs() {
    for (let i = 0; i < this.tabHeadings.length; i++) {
      this.tabHeadings[i].addEventListener('click', () => {
        this.resetTabs();
        this.tabHeadings[i].classList.add('active');
        this.tabContent[i].classList.add('active');
      });
    }
  }

  resetTabs() {
    for (let i = 0; i < this.tabHeadings.length; i++) {
      this.tabHeadings[i].classList.remove('active');
    }
    for (let i = 0; i < this.tabContent.length; i++) {
      this.tabContent[i].classList.remove('active');
    }
  }

}
