(() => {
  "use strict";

  const header = document.querySelector("[data-header]");
  const nav = document.querySelector("[data-nav]");
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const year = document.querySelector("[data-year]");
  const mobileNavigation = window.matchMedia("(max-width: 980px)");

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  const isNavigationOpen = () => menuToggle?.getAttribute("aria-expanded") === "true";

  const updateHeader = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 20);
  };

  const syncNavigationAccessibility = () => {
    if (!nav) return;

    const shouldHide = mobileNavigation.matches && !isNavigationOpen();
    nav.toggleAttribute("inert", shouldHide);
    nav.setAttribute("aria-hidden", String(shouldHide));
  };

  const setNavigationState = (isOpen, { returnFocus = false } = {}) => {
    if (!header || !nav || !menuToggle) return;

    const nextState = mobileNavigation.matches && isOpen;
    header.classList.toggle("nav-is-open", nextState);
    document.body.classList.toggle("nav-open", nextState);
    menuToggle.setAttribute("aria-expanded", String(nextState));
    menuToggle.setAttribute("aria-label", nextState ? "Close navigation" : "Open navigation");
    syncNavigationAccessibility();

    if (nextState) {
      window.requestAnimationFrame(() => nav.querySelector("a")?.focus());
    } else if (returnFocus) {
      menuToggle.focus();
    }
  };

  const closeNavigation = (options) => setNavigationState(false, options);

  updateHeader();
  syncNavigationAccessibility();
  window.addEventListener("scroll", updateHeader, { passive: true });

  menuToggle?.addEventListener("click", () => {
    setNavigationState(!isNavigationOpen());
  });

  nav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => closeNavigation());
  });

  document.addEventListener("keydown", (event) => {
    if (!isNavigationOpen()) return;

    if (event.key === "Escape") {
      event.preventDefault();
      closeNavigation({ returnFocus: true });
      return;
    }

    if (event.key !== "Tab" || !header) return;

    const focusableItems = Array.from(
      header.querySelectorAll('a[href], button:not([disabled]):not([inert])'),
    ).filter((item) => item.getClientRects().length > 0 && item.getAttribute("aria-hidden") !== "true");

    if (focusableItems.length === 0) return;

    const firstItem = focusableItems[0];
    const lastItem = focusableItems.at(-1);

    if (event.shiftKey && document.activeElement === firstItem) {
      event.preventDefault();
      lastItem.focus();
    } else if (!event.shiftKey && document.activeElement === lastItem) {
      event.preventDefault();
      firstItem.focus();
    }
  });

  const handleNavigationBreakpoint = () => {
    closeNavigation();
    syncNavigationAccessibility();
  };

  if (typeof mobileNavigation.addEventListener === "function") {
    mobileNavigation.addEventListener("change", handleNavigationBreakpoint);
  } else {
    mobileNavigation.addListener(handleNavigationBreakpoint);
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealItems = document.querySelectorAll(".reveal");

  revealItems.forEach((item, index) => {
    item.style.setProperty("--reveal-delay", `${Math.min(index % 3, 2) * 60}ms`);
  });

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
    { rootMargin: "0px 0px -8%", threshold: 0.1 },
  );

  revealItems.forEach((item) => observer.observe(item));
})();
