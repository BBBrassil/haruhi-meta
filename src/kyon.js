((Kyon) => {
  Kyon.getRoot = () => {
    return document.querySelector("body").firstElementChild;
  };

  Kyon.hide = (el) => {
    el?.classList.add("sr-only");
  };

  Kyon.show = (el) => {
    el?.classList.remove("sr-only");
  };

  Kyon.ready = (page) => {
    if (page?.onLoad) {
      window.addEventListener("load", page.onLoad);
    }
  };
})(window.Kyon = window.Kyon || {});