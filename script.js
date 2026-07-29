(() => {
  "use strict";

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

  const contactForm = document.querySelector("[data-contact-form]");
  const copyBriefButton = document.querySelector("[data-copy-brief]");
  const formStatus = document.querySelector("[data-form-status]");

  const getBrief = () => {
    if (!(contactForm instanceof HTMLFormElement)) {
      return "";
    }

    const formData = new FormData(contactForm);
    const value = (name) => String(formData.get(name) || "").trim();

    return [
      `Name: ${value("name")}`,
      `Email: ${value("email")}`,
      `Organisation: ${value("organisation") || "Not provided"}`,
      `Type of work: ${value("projectType")}`,
      "",
      "What I need:",
      value("brief"),
    ].join("\n");
  };

  const setFormStatus = (message) => {
    if (formStatus) {
      formStatus.textContent = message;
    }
  };

  contactForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!(contactForm instanceof HTMLFormElement) || !contactForm.reportValidity()) {
      return;
    }

    const formData = new FormData(contactForm);
    const name = String(formData.get("name") || "").trim();
    const subject = `Frontend enquiry from ${name}`;
    const mailto = `mailto:singularityshiftai@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(getBrief())}`;

    setFormStatus("Your email app should open with the brief ready to review.");
    window.location.href = mailto;
  });

  copyBriefButton?.addEventListener("click", async () => {
    if (!(contactForm instanceof HTMLFormElement) || !contactForm.reportValidity()) {
      return;
    }

    try {
      await navigator.clipboard.writeText(getBrief());
      setFormStatus("Brief copied. Paste it into any email or message to James.");
    } catch {
      const briefField = contactForm.elements.namedItem("brief");
      if (briefField instanceof HTMLTextAreaElement) {
        briefField.focus();
        briefField.select();
      }
      setFormStatus("Copy is unavailable here. The project description has been selected for you.");
    }
  });

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
