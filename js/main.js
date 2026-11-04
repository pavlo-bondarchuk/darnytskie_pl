(() => {
  const header = document.querySelector("#site-header");
  const toggle = document.querySelector("#menu-toggle");
  const menu = document.querySelector("#mobile-menu");
  const search = document.querySelector("#store-search");
  const clearSearch = document.querySelector("#store-search-clear");
  const mobileQuery = window.matchMedia("(max-width: 760px)");
  let menuReturnFocus = null;
  let savedOverflow = "";

  const refreshIcons = () => {
    if (window.lucide?.createIcons) window.lucide.createIcons();
  };

  const setHeaderState = () => header?.classList.toggle("is-scrolled", window.scrollY > 28);
  setHeaderState();
  window.addEventListener("scroll", setHeaderState, { passive: true });

  const setMenuOpen = (open, restoreFocus = true) => {
    if (!toggle || !menu) return;
    if (open && !mobileQuery.matches) return;
    if (open) {
      menuReturnFocus = document.activeElement;
      savedOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      menu.inert = false;
      menu.removeAttribute("inert");
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", window.DarnytskieI18n?.getLanguage() === "uk" ? "Закрити меню" : "Zamknij menu");
      menu.classList.add("is-open");
      requestAnimationFrame(() => menu.querySelector("a")?.focus());
    } else {
      document.body.style.overflow = savedOverflow;
      menu.classList.remove("is-open");
      menu.inert = true;
      menu.setAttribute("inert", "");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", window.DarnytskieI18n?.getLanguage() === "uk" ? "Відкрити меню" : "Otwórz menu");
      if (restoreFocus && menuReturnFocus?.isConnected) menuReturnFocus.focus({ preventScroll: true });
      menuReturnFocus = null;
    }
  };

  toggle?.addEventListener("click", () => setMenuOpen(toggle.getAttribute("aria-expanded") !== "true"));
  menu?.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener("click", () => {
    setMenuOpen(false, false);
    const target = document.querySelector(link.hash);
    if (target) {
      target.tabIndex = -1;
      requestAnimationFrame(() => target.focus({ preventScroll: true }));
    }
  }));
  mobileQuery.addEventListener?.("change", event => {
    if (!event.matches && toggle?.getAttribute("aria-expanded") === "true") setMenuOpen(false);
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && toggle?.getAttribute("aria-expanded") === "true") {
      event.preventDefault();
      setMenuOpen(false);
      return;
    }
    if (event.key !== "Tab" || toggle?.getAttribute("aria-expanded") !== "true" || !menu) return;
    const focusable = [...menu.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])')].filter(node => !node.hidden && !node.closest("[inert]"));
    if (toggle && !toggle.disabled) focusable.push(toggle);
    if (!focusable.length) {
      event.preventDefault();
      menu.focus();
      return;
    }
    const first = focusable[0];
    const lastMenuItem = focusable[focusable.length - 2] || first;
    if (event.shiftKey && (document.activeElement === first || document.activeElement === toggle || (!menu.contains(document.activeElement) && document.activeElement !== toggle))) {
      event.preventDefault();
      (document.activeElement === toggle ? lastMenuItem : toggle).focus();
    } else if (!event.shiftKey && (document.activeElement === lastMenuItem || document.activeElement === toggle || (!menu.contains(document.activeElement) && document.activeElement !== toggle))) {
      event.preventDefault();
      (document.activeElement === lastMenuItem ? toggle : first).focus();
    }
  });

  if (search && clearSearch) {
    const updateClear = () => { clearSearch.hidden = !search.value; };
    search.addEventListener("input", updateClear);
    clearSearch.addEventListener("click", () => {
      search.value = "";
      search.dispatchEvent(new Event("input", { bubbles: true }));
      search.focus();
    });
    updateClear();
  }

  const sections = [...document.querySelectorAll("main section[id]")];
  const navLinks = [...document.querySelectorAll('.desktop-nav a[href^="#"], .mobile-menu a[href^="#"]')];
  const activeLinks = new Map();
  const markActive = id => {
    navLinks.forEach(link => {
      const active = link.hash === `#${id}`;
      link.classList.toggle("is-active", active);
      if (active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  };

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        activeLinks.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
      });
      const current = [...activeLinks.entries()].sort((a, b) => b[1] - a[1])[0];
      if (current && current[1] > 0) markActive(current[0]);
    }, { rootMargin: "-25% 0px -55% 0px", threshold: [0, 0.15, 0.4, 0.65] });
    sections.forEach(section => observer.observe(section));
  }

  refreshIcons();
  window.addEventListener("load", refreshIcons, { once: true });
})();
