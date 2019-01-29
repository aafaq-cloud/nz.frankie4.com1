/**
 * Video cover Component Class
 *
 * Creates a JS selector that binds to the native selector
 */


import {throttle} from "../helpers/throttle";

import {AbstractComponent} from "../class/AbstractComponent";

export class ComponentVideo extends AbstractComponent {
  constructor(component) {
    super(component);

    this.video = this.component.querySelector("video");
    this.containerAspectRatio = 1;
    this.videoAspectRatio = 1;
    this.listeners = [];

    // Init functions
    this.setVideoAspectRatio();
    this.initVideoCover();
    this.initVideo();
  }

  /**
   * Determine the video aspect ratio
   */
  setVideoAspectRatio() {
    this.videoAspectRatio = (
      this.video.getAttribute("width") / this.video.getAttribute("height")
    ).toFixed(4);
  }

  /**
   * Initialise the video cover fill mode and bind to window resize event
   */
  initVideoCover() {
    this.setVideoFillMode();
    let resizeListener;

    window.addEventListener(
      "resize",
      (resizeListener = throttle(() => {
        this.setVideoFillMode();
      }, 20)),
    );

    if (module.hot) {
      this.listeners.push({
        type: "resize",
        element: window,
        listener: resizeListener,
      });
    }
  }

  /**
   * Set the correct fill properties for the video container
   * If container has wider aspect ratio than video make video fill container width
   * If video has wider aspect ratio than container make video fill container height
   */
  setVideoFillMode() {
    this.containerAspectRatio = (this.component.offsetWidth / this.component.offsetHeight).toFixed(
      4,
    );

    if (this.containerAspectRatio > this.videoAspectRatio) {
      this.component.classList.remove("fill-height");
      this.component.classList.add("fill-width");
    } else {
      this.component.classList.remove("fill-width");
      this.component.classList.add("fill-height");
    }
  }

  /**
   * Initialise the loading of the video
   */
  initVideo() {
    this.component.classList.add("initialised");
  }

  /**
   * Play the video
   */
  playVideo() {
    this.video.play();
  }

  /**
   * Pause the video
   */
  pauseVideo() {
    this.video.pause();
  }

  /**
   * Check if the video element is ready
   */
  checkVideoLoad() {
    if (this.video.readyState === 4) {
      this.component.classList.add("initialised");
    } else {
      setTimeout(() => this.checkVideoLoad(), 100);
    }
  }
}
