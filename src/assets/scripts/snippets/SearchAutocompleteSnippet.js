/**
 * Search Autocomplete Snippet Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly coupled to the Autocomplete snippet template.
 */

import $ from "jquery";
import Vue from "vue";
import VueResource from "vue-resource";

import {AbstractComponent} from "../class/AbstractComponent";
import {HeaderSection} from "../sections/header";
import {Utility} from "../class/Utility";
import { formatMoney } from "@shopify/theme-currency";

Vue.use(VueResource);

export class SearchAutocompleteSnippet extends AbstractComponent {
  constructor(component) {

    component = $(component);

    super(component);

    this.scrollPosition = 0;
    this.body = $("body");

    this.initVue();
    this.initFocusSearch();
  }

  initVue() {
    const instance = this;

    Vue.component("result-product-item", {
      template: `
                <li class="result result-product-item">
                    <a :href="url"
                      @keydown="$emit('result-key-down', $event)"
                      @blur="$emit('result-blur', $event)"
                      @click="$emit('result-click', {event: $event, url})"
                      ref="result-link"
                      tabindex="-1"
                      :aria-label="title">
                        <img v-if="image" class="result-item-image cell shrink" :src=" image" />
                        <div class="details">
                            <h5 class="m-0">{{ title }}</h5>
                            <span v-if="price" class="text-small color-secondary-text" v-html="formatMoneyValue(price)"></span>
                        </div>
                    </a>
                </li>
                `,
      props: ["title", "image", "url", "brand", "price"],
      methods: {
        formatMoneyValue(value) {
          if (!value) {
            return "";
          } else {
            return formatMoney(value, theme.moneyFormat);
          }
        }
      }
    });

    Vue.component("result-page-item", {
      template: `
                <li class="result result-page-item cell small-4">
                    <a :href="url"
                      @keydown="$emit('result-key-down', $event)"
                      @blur="$emit('result-blur', $event)"
                      @click="$emit('result-click', {event: $event, url})"
                      ref="result-link"
                      tabindex="-1"
                      :aria-label="title">
                        <div class="details cell auto">
                            <h5 class="m-0">{{ title }}</h5>
                            <p class="m-0 text-small" v-if="excerpt">{{ excerpt }}</p>
                        </div>
                    </a>
                </li>
                `,
      props: ["title", "excerpt", "url"]
    });

    Vue.component("result-article-tile", {
      template: `
                <li class="result result-article-tile cell small-4">
                    <a :href="url"
                      @keydown="$emit('result-key-down', $event)"
                      @blur="$emit('result-blur', $event)"
                      @click="$emit('result-click', {event: $event, url})"
                      ref="result-link"
                      tabindex="-1"
                      :aria-label="title">
                        <img v-if="image" class="result-item-image cell shrink" :src=" image" />
                        <div class="details cell auto">
                            <h5 class="m-0">{{ title }}</h5>
                        </div>
                    </a>
                </li>
                `,
      props: ["title", "image", "url"]
    });

    instance.lastRequest = null;
    const autoCompleteCache = JSON.parse(
      sessionStorage.getItem("autocomplete-cache")
    );
    instance.vm = new Vue({
      el: instance.component.find(".search-autocomplete-view")[0],
      data: {
        keyword: '',
        keyword_focused: false,
        results: {
          results_count: 0,
          results_message: "No Results"
        },
        resultsFocused: false,
        resultFocusLock: false,
        resultsCache: autoCompleteCache || {},
        focusedIndex: -1
      },
      template: `
      <form :class="keyword_focused || resultsFocused ? 'search-autocomplete-view search-focussed' : 'search-autocomplete-view search-blurred'" action="/search" method="get">
        <div class="search-input-wrapper">
          <input v-model="keyword"
                 ref="keyword"
                 type="search"
                 name="q"
                 id="Search"
                 autocomplete="off"
                 @focus="inputFocus()"
                 @blur="inputBlur()"
                 @keydown="handleKey"
                 :placeholder="keyword_focused ? 'Search' : 'Search'"
                 aria-label="Press the down arrow to select suggestions"
                 >
          <button type="submit" class="underlay toolbar-item-icon" :class="{'active': ((keyword_focused == false || keyword.length <= 0) && resultsFocused == false)}" :tabindex="keyword_focused || resultsFocused ? -1 : 0"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 60 60" class="icon"><path d="M58.42 58.045L41.598 40.55c4.291-4.303 6.95-10.235 6.95-16.777C48.547 10.664 37.882 0 24.773 0 11.664 0 1 10.664 1 23.774c0 13.109 10.664 23.773 23.774 23.773a23.664 23.664 0 0 0 15.151-5.47l16.863 17.537a1.13 1.13 0 0 0 1.6.032c.45-.434.464-1.15.032-1.601zM24.774 45.283c-11.861 0-21.51-9.649-21.51-21.51 0-11.86 9.649-21.509 21.51-21.509 11.86 0 21.509 9.649 21.509 21.51 0 11.86-9.65 21.509-21.51 21.509z" fill="#2C2F35" fill-rule="nonzero"/></svg></button>
          <button type="button" class="search-autocomplete-clear underlay toolbar-item-icon" @click="clearSearch" :class="{'active': (keyword.length > 0 || resultsFocused)}" :tabindex="keyword_focused || resultsFocused ? -1 : 0"><svg  xmlns="http://www.w3.org/2000/svg" width="100px" height="100px" viewBox="0 0 100 100" class="icon"><path  d="M61.88,50l35.65-35.65c3.28-3.28,3.28-8.6,0-11.88c-3.28-3.28-8.6-3.28-11.88,0L50,38.12L14.35,2.46 c-3.28-3.28-8.6-3.28-11.88,0c-3.28,3.28-3.28,8.6,0,11.88L38.12,50L2.46,85.65c-3.28,3.28-3.28,8.6,0,11.88 c3.28,3.28,8.6,3.28,11.88,0L50,61.88l35.65,35.65c3.28,3.28,8.6,3.28,11.88,0s3.28-8.6,0-11.88L61.88,50z"/></svg></button>
        </div>

        <div :class="{'active': keyword_focused || resultsFocused}" class="search-autocomplete-overlay hide-for-large"></div>

        <div class="search-autocomplete-results" :class="{'open': (keyword_focused && keyword || resultsFocused) }">
        <div v-if="this.results.results_count == 0" class="no-results">
            {{this.results.results_message}}
        </div>
        <template v-if="results.results_count > 0">
            <div v-if="results.product && results.product.length > 0" class="results-section">
                <ul>
                    <result-product-item
                        v-for="(item, index) in results.product"
                        :title="item.title"
                        :image="item.thumbnail"
                        :url="item.url"
                        :brand="item.brand"
                        :price="item.price"
                        :key="item.url"
                        :ref="'product-' + item.url"
                        @result-blur="resultBlur"
                        @result-key-down="resultKeyDown"
                        @result-click="linkCustomAction"
                      />
                </ul>
            </div>
            <div v-if="results.page && results.page.length > 0" class="results-section">
                <h5 class="color-secondary-text results-section-title m-0">Pages</h5>
                <ul>
                    <result-page-item
                        v-for="(item, index) in results.page"
                        :title="item.title"
                        :excerpt="item.excerpt"
                        :url="item.url"
                        :key="item.url"
                        :ref="'page-' + item.url"
                        @result-blur="resultBlur"
                        @result-key-down="resultKeyDown"/>
                </ul>
            </div>
            <div v-if="results.article && results.article.length > 0" class="results-section">
                <h5 class="color-secondary-text results-section-title m-0">Articles</h5>
                <ul>
                    <result-article-tile
                        v-for="(item, index) in results.article"
                        :title="item.title"
                        :image="item.thumbnail"
                        :url="item.url"
                        :key="item.url"
                        :ref="'article-' + item.url"
                        @result-blur="resultBlur"
                        @result-key-down="resultKeyDown"/>
                </ul>
            </div>

            <div class="buttons">
              <button type="submit" class="button-view-all button button-hollow button-small button-expanded" tabindex="-1" ref="submit" @keydown="resultKeyDown($event)" @blur="resultBlur($event)">View All</button>
            </div>
        </template>
        </div>
      </form>
      `,
      watch: {
        keyword(val, oldVal) {
          const term = val;

          if (instance.lastRequest) {
            instance.lastRequest.abort();
          }

          if (term.length > 2) {
            this.updateResults(term);
          } else {
            this.clearResults();
          }
        }
      },
      methods: {
        clearSearch() {
          this.keyword = "";
        },

        updateResults: Utility.debounce(function(term) {
          if (instance.vm.resultsCache.hasOwnProperty(term)) {
            instance.vm.results = instance.vm.resultsCache[term];
            setTimeout(() => {
              document.body.dispatchEvent(
                new Event("shopify-currency.refresh")
              );
            }, 10);
          } else {
            this.$http
              .get("/search", {
                params: {q: `*${term}*`, view: "json"},
                before(xhr) {
                  instance.lastRequest = xhr;
                }
              })
              .then(
                response => {
                  const results = response.body.results;

                  results.results_message = results.results_message.replace(
                    /\*/g,
                    ""
                  );
                  instance.vm.resultsCache[term] = results;
                  sessionStorage.setItem(
                    "autocomplete-cache",
                    JSON.stringify(instance.vm.resultsCache)
                  );
                  instance.vm.results = results;

                  setTimeout(() => {
                    document.body.dispatchEvent(
                      new Event("shopify-currency.refresh")
                    );
                  }, 10);
                },
                response => {
                  // error callback
                }
              );
          }
        }, 200),

        linkCustomAction(args) {
          if (!window.ScreenLoader) {
            return;
          }
          args.event.preventDefault();

          window.ScreenLoader.fetchPage(args.url);
        },

        refs() {
          let refs = [];
          const indices = ["product", "page", "article"];
          for (let i = 0; i <= indices.length - 1; i++) {
            const resultArray = this.results[indices[i]];
            refs = [
              ...refs,
              ...resultArray.map(result => {
                return `${indices[i]}-${result.url}`;
              })
            ];
          }
          refs = [...refs, "submit"];
          return refs;
        },

        handleKey(e) {
          if (e.key !== "ArrowDown" && e.keyCode !== 40) {
            return false;
          }
          e.preventDefault();
          return this.focusElement("next");
        },

        resultKeyDown(e) {
          let mode = "";
          if (e.key === "ArrowDown" || e.keyCode === 40) {
            mode = "next";
          }
          if (e.key === "ArrowUp" || e.keyCode === 38) {
            mode = "prev";
          }
          if (mode !== "") {
            e.preventDefault();
          }
          return this.focusElement(mode);
        },

        focusElement(mode = "next") {
          if (mode === "next" && this.refs().length - 1 <= this.focusedIndex) {
            return false;
          }
          if (mode === "prev" && this.focusedIndex === -1) {
            return false;
          }

          switch (mode) {
          case "next":
            this.focusedIndex++;
            break;
          case "prev":
            this.focusedIndex--;
            break;
          }
          let toFocus;
          if (this.focusedIndex === -1) {
            toFocus = this.$refs.keyword;
            this.resultsFocused = false;
          } else if (this.focusedIndex === this.refs().length - 1) {
            toFocus = this.$refs.submit;
            this.resultFocusLock = true;
            this.resultsFocused = true;
          } else {
            this.resultsFocused = true;
            // Prevent the unfocus event from firing completely when focusing the next result
            this.resultFocusLock = true;
            const ref = this.$refs[this.refs()[this.focusedIndex]][0];
            toFocus = ref.$refs["result-link"];
          }

          toFocus.focus();
          // Allow focus to be taken away by traditional blur events
          this.resultFocusLock = false;
          return toFocus;
        },

        resultBlur() {
          if (this.resultFocusLock) {
            this.resultFocusLock = false;
            return false;
          }
          this.resultsFocused = false;
          this.anyBlur();
          return true;
        },

        clearResults() {
          instance.vm.results = [];
        },

        setInputBlur() {
          this.$refs.keyword.blur();
        },

        inputFocus() {
          this.keyword_focused = true;
          // HeaderSection.lockHeader();
          // HeaderSection.showHeader();

          instance.scrollPosition = window.pageYOffset;

          instance.body.addClass("search-autocomplete-active");
          // Show popup
          // instance.body.css({
          //   top: `${-instance.scrollPosition}px`,
          // });
        },

        inputBlur() {
          setTimeout(() => {
            instance.vm.keyword_focused = false;
          }, 100);
          setTimeout(() => {
            this.anyBlur();
          }, 200);
        },

        // Run post-blur functions only if the input and results are both unfocused
        anyBlur() {
          if (this.keyword_focused === true || this.resultsFocused === true) {
            return false;
          }
          this.focusedIndex = -1;
          HeaderSection.unlockHeader();
          HeaderSection.hideHeader();

          instance.body.removeClass("search-autocomplete-active");
          instance.body.css({
            top: ""
          });
          window.scrollTo(0, instance.scrollPosition);
          instance.navOpen = false;
          return true;
        }
      }
    });
  }

  initFocusSearch() {
    const instance = this;

    $(".js-focus-search-autocomplete").on("click", () => {
      instance.vm.$refs.keyword.focus();
      // Scroll to top on small screens on click so that the input is visible whilst entering
      if ($(window).width() < 1024) {
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            $("html, body").animate({scrollTop: 0}, {duration: 250});
          })
        );
      }
    });
  }
}
