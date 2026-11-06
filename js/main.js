(() => {
  const header = document.querySelector("#site-header");
  const toggle = document.querySelector("#menu-toggle");
  const menu = document.querySelector("#mobile-menu");
  const menuClose = document.querySelector("#menu-close");
  const search = document.querySelector("#store-search");
  const clearSearch = document.querySelector("#store-search-clear");
  const mobileQuery = window.matchMedia("(max-width: 68.75rem)");
  let menuReturnFocus = null;
  let menuFocusTarget = null;
  let savedOverflow = "";

  const refreshIcons = () => {
    if (window.lucide?.createIcons) window.lucide.createIcons();
  };
  const localized = (polish, ukrainian) => window.DarnytskieI18n?.getLanguage() === "uk" ? ukrainian : polish;

  const setHeaderState = () => header?.classList.toggle("is-scrolled", window.scrollY > 28);
  setHeaderState();
  window.addEventListener("scroll", setHeaderState, { passive: true });

  const updateHeaderOffset = () => {
    if (!header) return;
    const height = Math.ceil(header.getBoundingClientRect().height);
    document.documentElement.style.setProperty("--header-offset", `${height}px`);
  };
  if (header) {
    updateHeaderOffset();
    if ("ResizeObserver" in window) {
      const headerResizeObserver = new ResizeObserver(updateHeaderOffset);
      headerResizeObserver.observe(header);
    } else {
      window.addEventListener("resize", updateHeaderOffset, { passive: true });
    }
  }

  const openMenu = () => {
    if (!toggle || !menu || !mobileQuery.matches || menu.open) return;
    menuReturnFocus = document.activeElement;
    menuFocusTarget = null;
    savedOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.classList.add("menu-open");
    menu.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", localized("Zamknij menu", "Закрити меню"));
    menu.showModal();
    requestAnimationFrame(() => menuClose?.focus());
  };

  const closeMenu = focusTarget => {
    if (!menu?.open) return;
    menuFocusTarget = focusTarget || null;
    menu.close();
  };

  toggle?.addEventListener("click", () => {
    if (menu?.open) closeMenu();
    else openMenu();
  });
  menuClose?.addEventListener("click", () => closeMenu());
  menu?.querySelectorAll('.mobile-menu__nav a[href^="#"]').forEach(link => link.addEventListener("click", () => {
    const target = document.getElementById(decodeURIComponent(link.hash.slice(1)));
    if (target) target.tabIndex = -1;
    closeMenu(target);
  }));
  menu?.addEventListener("close", () => {
    document.body.style.overflow = savedOverflow;
    document.body.classList.remove("menu-open");
    menu.classList.remove("is-open");
    toggle?.setAttribute("aria-expanded", "false");
    toggle?.setAttribute("aria-label", localized("Otwórz menu", "Відкрити меню"));
    const focusTarget = menuFocusTarget || menuReturnFocus;
    menuFocusTarget = null;
    menuReturnFocus = null;
    requestAnimationFrame(() => focusTarget?.focus({ preventScroll: true }));
  });
  mobileQuery.addEventListener?.("change", event => {
    if (!event.matches && menu?.open) closeMenu();
  });
  document.addEventListener("darnytskie:languagechange", () => {
    requestAnimationFrame(() => window.ScrollTrigger?.refresh());
  });

  document.addEventListener("click", event => {
    const link = event.target.closest('a[href^="#"]');
    if (!link || link.matches(".product-card__buy") || menu?.contains(link)) return;
    let id;
    try { id = decodeURIComponent(link.hash.slice(1)); } catch { return; }
    const target = document.getElementById(id);
    if (!target) return;
    target.tabIndex = -1;
    requestAnimationFrame(() => target.focus({ preventScroll: true }));
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
  const navLinks = [...document.querySelectorAll('.desktop-nav a[href^="#"], .mobile-menu__nav a[href^="#"]')];
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
