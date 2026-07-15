// Glanzend Schoon: site behaviour for mobile nav, before/after slider, reveal-on-scroll, contact form.
(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Mobile nav ---------- */
  const toggle = document.querySelector(".nav__toggle");
  const drawer = document.querySelector(".nav__drawer");
  if (toggle && drawer) {
    toggle.addEventListener("click", () => {
      const isOpen = drawer.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      document.body.style.overflow = isOpen ? "hidden" : "";
    });
    drawer.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        drawer.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length) {
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      revealEls.forEach((el) => el.classList.add("is-visible"));
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
      );
      revealEls.forEach((el, i) => {
        el.style.transitionDelay = prefersReducedMotion ? "0ms" : `${Math.min(i % 3, 2) * 90}ms`;
        io.observe(el);
      });
    }
  }

  /* ---------- Before / after slider ---------- */
  document.querySelectorAll(".ba").forEach((el) => {
    const after = el.querySelector(".ba__after");
    const handle = el.querySelector(".ba__handle");
    if (!after || !handle) return;

    let dragging = false;

    const setPosition = (percent) => {
      const clamped = Math.max(2, Math.min(98, percent));
      after.style.clipPath = `inset(0 0 0 ${clamped}%)`;
      handle.style.left = `${clamped}%`;
      handle.setAttribute("aria-valuenow", String(Math.round(clamped)));
    };

    const percentFromEvent = (clientX) => {
      const rect = el.getBoundingClientRect();
      return ((clientX - rect.left) / rect.width) * 100;
    };

    const onMove = (clientX) => setPosition(percentFromEvent(clientX));

    el.addEventListener("pointerdown", (e) => {
      dragging = true;
      el.setPointerCapture(e.pointerId);
      onMove(e.clientX);
    });
    el.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      onMove(e.clientX);
    });
    el.addEventListener("pointerup", () => { dragging = false; });
    el.addEventListener("pointercancel", () => { dragging = false; });

    handle.setAttribute("tabindex", "0");
    handle.setAttribute("role", "slider");
    handle.setAttribute("aria-label", "Vergelijk voor en na");
    handle.setAttribute("aria-valuemin", "0");
    handle.setAttribute("aria-valuemax", "100");
    handle.addEventListener("keydown", (e) => {
      const current = parseFloat(handle.style.left) || 50;
      if (e.key === "ArrowLeft") { setPosition(current - 5); e.preventDefault(); }
      if (e.key === "ArrowRight") { setPosition(current + 5); e.preventDefault(); }
    });

    setPosition(50);

    if (!prefersReducedMotion) {
      let auto = 50;
      let dir = 1;
      let settled = false;
      el.addEventListener("pointerdown", () => { settled = true; }, { once: true });
      const step = () => {
        if (settled) return;
        auto += dir * 0.25;
        if (auto > 62) dir = -1;
        if (auto < 38) dir = 1;
        setPosition(auto);
        requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }
  });

  /* ---------- Contact form ---------- */
  const form = document.querySelector("#contact-form");
  if (form) {
    const status = form.querySelector(".form-status");

    const showStatus = (type, message) => {
      status.textContent = message;
      status.classList.remove("form-status--ok", "form-status--err");
      status.classList.add("is-visible", type === "ok" ? "form-status--ok" : "form-status--err");
    };

    const validators = {
      name: (v) => v.trim().length >= 2 || "Vul uw naam in.",
      email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "Vul een geldig e-mailadres in.",
      message: (v) => v.trim().length >= 10 || "Vertel ons kort wat u nodig heeft (min. 10 tekens).",
    };

    const validateField = (field) => {
      const wrapper = field.closest(".field");
      const rule = validators[field.name];
      if (!rule) return true;
      const result = rule(field.value);
      if (result === true) {
        wrapper.classList.remove("has-error");
        return true;
      }
      wrapper.classList.add("has-error");
      const errorEl = wrapper.querySelector(".field__error");
      if (errorEl) errorEl.textContent = result;
      return false;
    };

    form.querySelectorAll("input[name], textarea[name]").forEach((field) => {
      field.addEventListener("blur", () => validateField(field));
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const fields = form.querySelectorAll("input[name='name'], input[name='email'], textarea[name='message']");
      let valid = true;
      fields.forEach((f) => { if (!validateField(f)) valid = false; });
      if (!valid) {
        showStatus("err", "Controleer de gemarkeerde velden hierboven.");
        return;
      }

      const submitBtn = form.querySelector("button[type='submit']");
      const originalLabel = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = "Bezig met verzenden…";

      const endpoint = form.getAttribute("action");
      const isConfigured = endpoint && !endpoint.includes("YOUR_FORM_ID");

      try {
        if (isConfigured) {
          const res = await fetch(endpoint, {
            method: "POST",
            body: new FormData(form),
            headers: { Accept: "application/json" },
          });
          if (!res.ok) throw new Error("submit-failed");
        }
        form.reset();
        showStatus("ok", "Bedankt! Uw aanvraag is verzonden, we nemen snel contact met u op.");
      } catch (err) {
        showStatus(
          "err",
          "Verzenden lukte niet. Bel ons gerust op 0496 07 20 39 of mail naar info@glanzendschoon.be."
        );
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalLabel;
      }
    });
  }

  /* ---------- Scroll-spy nav ---------- */
  const navLinks = document.querySelectorAll("[data-nav]");
  const sections = Array.from(navLinks)
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);
  if (navLinks.length && sections.length && "IntersectionObserver" in window) {
    const setActive = (id) => {
      navLinks.forEach((a) => {
        a.classList.toggle("is-active", a.getAttribute("href") === `#${id}`);
      });
    };
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- Footer year ---------- */
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });
})();
