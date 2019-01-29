export const throttle = function throttle(func, delay) {
  let timer = null;

  return function throttled(...args) {
    const context = this;

    if (timer === null) {
      timer = setTimeout(() => {
        func.apply(context, args);
        timer = null;
      }, delay);
    }
  };
};
