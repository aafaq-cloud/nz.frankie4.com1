/**
 * Banner Section Script
 * ------------------------------------------------------------------------------
 *
 */

import {AbstractComponent} from "../class/AbstractComponent";

export class ShippingSection extends AbstractComponent {
  constructor(component) {
    super(component);

    this.initTabsActive();
    this.initTabsClick();
  }

  initTabsActive() {
    let instance = this;

    const tabs =  instance.component.querySelectorAll(".tabs");
    const tabsContent =  instance.component.querySelectorAll(".tabs-content");

    [].forEach.call(tabs, (tab)=> {
      tab.children[0].classList.add('active');
    });

    [].forEach.call(tabsContent, (tabContent)=> {
         tabContent.children[0].classList.add('active');
    });

  }

  initTabsClick() {

    let instance = this;
    instance.tabHeadings = instance.component.querySelectorAll(".tabs-title");

    // Add click event to all tab titles
    [].forEach.call(instance.tabHeadings, (tabHeading)=> {
      tabHeading.addEventListener("click", () => {

        console.log(tabHeading.parentElement);

        // Parent tabs container of clicked element
        const tabsParent = tabHeading.parentElement;
        // Remove active class from all siblings
        [].forEach.call(tabsParent.children, (tab)=> {
          tab.classList.remove('active');
        });
        // Add active class to clicked element
        tabHeading.classList.add('active');

        // Tab Content Container
        const tabsContent = tabsParent.nextElementSibling;
        // Tab Content Container Children
        const tabsContentChildren = tabsContent.children;
        [].forEach.call(tabsContentChildren, (tabsContentChild)=> {
          tabsContentChild.classList.remove('active');
        });
        // Add active class to tab content belonging to clicked tab element
        const activeTabContentItem = tabsContent.querySelector('#' + tabHeading.dataset.panel);
        activeTabContentItem.classList.add('active');

      });
    });




  }

}
