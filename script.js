(() => {
  "use strict";

  /*
   * Load the visual enhancement layer separately. The original stylesheet
   * remains untouched and is still the complete fallback.
   */
  if (!document.querySelector('link[href="rizz.css"]')) {
    const enhancementStyles = document.createElement("link");
    enhancementStyles.rel = "stylesheet";
    enhancementStyles.href = new URL("./rizz.css", import.meta.url).href;
    document.head.append(enhancementStyles);
  }

  const header = document.querySelector("[data-header]");
  const year = document.querySelector("[data-year]");

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  const updateHeader = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 20);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealItems = document.querySelectorAll(".reveal");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -8%", threshold: 0.12 },
  );

  revealItems.forEach((item) => observer.observe(item));
})();
