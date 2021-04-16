/**
 * Header Section Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly coupled to the Header section template.
 */

import $ from "jquery";
import {AbstractComponent} from "../class/AbstractComponent";
import {throttle} from "../helpers/throttle";


export class HeaderSection extends AbstractComponent {
  constructor(component) {
    super(component);

    this.navOpen = false;
    this.scrollPosition = 0;
    this.body = $("body");
    this.initStickyHeader();
    this.initMobileNavigation();
    this.initSearchFocus();
  }

  initSearchFocus() {
    const focussers = document.querySelectorAll(".search-focusser");

    for (let i = focussers.length - 1; i >= 0; i -= 1) {
      const focusser = focussers[i];

      focusser.addEventListener("click", () => {
        const searchInput = document.querySelector(
          ".search-autocomplete-view input"
        );
        requestAnimationFrame(() => {
          searchInput.focus();
        });
      });
    }
  }

  initMobileNavigation() {
    const instance = this;

    $(".js-mobile-nav-toggle").click(() => {
      if (instance.navOpen) {
        instance.body.removeClass("main-nav-active");
        instance.body.css({
          top: ""
        });
        window.scrollTo(0, instance.scrollPosition);
        instance.navOpen = false;
      } else {
        instance.scrollPosition = window.pageYOffset;

        instance.body.addClass("main-nav-active");
        // Show popup
        instance.body.css({
          top: `${-instance.scrollPosition}px`
        });
        instance.navOpen = true;
      }

      $(".nav-overlay").fadeToggle(200);
    });

    instance.mobileNav = $(".mobile-nav");

    instance.mobileNav.find(".toggle").on("click", function() {
      $(this)
        .parent()
        .toggleClass("open");
    });
  }

  initStickyHeader() {
    const instance = this;

    $(window).scroll(
        throttle(function() {
        const scrollTopNew = $(this).scrollTop();

        if (!HeaderSection.isLockedHeader()) {
          if (scrollTopNew > 50) {
            HeaderSection.compactHeader();
          } else {
            HeaderSection.expandHeader();
          }
        }

        instance.scrollTop = scrollTopNew;
      }, 20)
    );

    // Trigger scroll
    $(window).scroll();
  }

  static isLockedHeader() {
    return $("body").hasClass("lock-header");
  }

  static unlockHeader() {
    $("body").removeClass("lock-header");
  }

  static lockHeader() {
    $("body").addClass("lock-header");
  }

  static expandHeader() {
    $("body").removeClass("compact-header");
  }

  static compactHeader() {
    $("body").addClass("compact-header");
  }

  static showHeader() {
    $("body").addClass("show-header");
    HeaderSection.expandHeader();
  }

  static hideHeader() {
    $("body").removeClass("show-header");
  }
}
