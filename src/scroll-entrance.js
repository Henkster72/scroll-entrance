(function() {
  const entrance = {
    duration: 1000,
    distance: 200,
    heightOffset: 200,

    isElemInView(elem) {
      const rect = elem.getBoundingClientRect();
      return (
        (rect.top + this.heightOffset) >= 0 && (rect.top + this.heightOffset) <= window.innerHeight ||
        (rect.bottom + this.heightOffset) >= 0 && (rect.bottom + this.heightOffset) <= window.innerHeight ||
        (rect.top + this.heightOffset) < 0 && (rect.bottom + this.heightOffset) > window.innerHeight
      );
    },

    setInitialStyles(elem) {
      document.body.style.overflowX = "hidden";
      const anim = elem.getAttribute("data-entrance");
      const delay = elem.getAttribute("data-entrance-delay");

      elem.style.transition = `all ${this.duration / 1000}s ease`;
      if (delay) elem.style.transitionDelay = `${delay / 1000}s`;
      elem.style.opacity = "0";

      const transforms = {
        "from-left": `translate(-${this.distance}px, 0)`,
        "from-right": `translate(${this.distance}px, 0)`,
        "from-top": `translate(0, -${this.distance}px)`,
        "from-bottom": `translate(0, ${this.distance}px)`
      };

      if (transforms[anim]) elem.style.transform = transforms[anim];
    },

    enter(elem) {
      elem.style.visibility = "visible";
      elem.style.opacity = "1";
      elem.style.transform = "translate(0, 0)";
      elem.classList.add("has-entered");
    },

    viewportChange() {
      Array.from(this.elements).forEach(item => {
        if (this.isElemInView(item) && !item.classList.contains("has-entered")) {
          this.enter(item);
        }
      });
    },

    init() {
      this.elements = document.querySelectorAll('[data-entrance]');
      this.elements.forEach(item => {
        this.setInitialStyles(item);
        if (this.isElemInView(item)) {
          window.addEventListener('load', () => this.enter(item), { once: true });
        }
      });
    }
  };

  window.addEventListener('DOMContentLoaded', () => entrance.init(), { once: true });
  window.addEventListener('scroll', () => entrance.viewportChange());
  window.addEventListener('resize', () => entrance.viewportChange());
})();
