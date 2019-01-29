/* eslint-disable import/prefer-default-export */
// https://developer.mozilla.org/en-US/docs/Web/Events/resize#requestAnimationFrame

export const throttledResize = (function throttledResize() {
  const callbacks = [];

  let running = false;
  throttledResize
  // run the actual callbacks
  function runCallbacks() {
    callbacks.forEach(callback => {
      callback();
    });

    running = false;
  }

  // fired on resize event
  function resize() {
    if (!running) {
      running = true;

      if (window.requestAnimationFrame) {
        window.requestAnimationFrame(runCallbacks);
      } else {
        setTimeout(runCallbacks, 66);
      }
    }
  }

  // adds callback to loop
  function addCallback(callback) {
    if (callback) {
      callbacks.push(callback);
    }
  }

  return {
    // public method to add additional callback
    add(callback) {
      if (!callbacks.length) {
        window.addEventListener("resize", resize);
      }
      addCallback(callback);
    }
  };
})();
