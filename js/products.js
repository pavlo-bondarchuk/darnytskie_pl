(() => {
  const products = [
    { id: "vershkova", name: "Śmietankowa", originalName: "Вершкова", category: "Kiełbasa", color: "#E8B868", label: "assets/labels/sausage-butter-rect.webp", image: "assets/products/vershkova.webp", size: "product-card--large", description: "Poznaj Śmietankową — produkt marki „Дарницькі вироби”. Szczegóły produktu uzupełnimy po zatwierdzeniu danych." },
    { id: "doktorska", name: "Doktorska", originalName: "Докторська", category: "Kiełbasa", color: "#E87888", label: "assets/labels/sausage-doctor-classic.webp", size: "product-card--wide", description: "Poznaj Doktorską — produkt marki „Дарницькі вироби”. Szczegóły produktu uzupełnimy po zatwierdzeniu danych." },
    { id: "studentska", name: "Studencka", originalName: "Студентська", category: "Kiełbasa", color: "#B63348", label: "assets/labels/sausage-student.webp", size: "product-card--tall", description: "Poznaj Studencką — produkt marki „Дарницькі вироби”. Szczegóły produktu uzupełnimy po zatwierdzeniu danych." },
    { id: "gota", name: "Gota", originalName: "Гота", category: "Kiełbasa", color: "#76518F", label: "assets/labels/sausage-gota.webp", size: "", description: "Poznaj Gotę — produkt marki „Дарницькі вироби”. Szczegóły produktu uzupełnimy po zatwierdzeniu danych." },
    { id: "doktorska-premium", name: "Doktorska Premium", originalName: "Докторська Преміум", category: "Kiełbasa", color: "#2FAE4A", label: "assets/labels/sausage-doctor-premium.webp", size: "product-card--wide", description: "Poznaj Doktorską Premium — produkt marki „Дарницькі вироби”. Szczegóły produktu uzupełnimy po zatwierdzeniu danych." },
    { id: "doktorska-extra", name: "Doktorska Extra", originalName: "Докторська Екстра", category: "Kiełbasa", color: "#1EA7E8", label: "assets/labels/sausage-doctor-extra.webp", size: "product-card--tall", description: "Poznaj Doktorską Extra — produkt marki „Дарницькі вироби”. Szczegóły produktu uzupełnimy po zatwierdzeniu danych." },
    { id: "uszka-wedzone", name: "Wędzone uszy wieprzowe", originalName: "Копчені свинячі вуха", category: "Przekąska", color: "#A65B32", label: "assets/labels/pork-ears-smoked.webp", size: "", description: "Poznaj wędzone uszy wieprzowe — produkt marki „Дарницькі вироби”. Szczegóły produktu uzupełnimy po zatwierdzeniu danych." },
    { id: "parowki", name: "Parówki Doktorskie", originalName: "Сосиски Докторські", category: "Parówki", color: "#E8BC6A", label: "assets/labels/sausage-doctor-oval.webp", size: "product-card--wide", description: "Poznaj Parówki Doktorskie — produkt marki „Дарницькі вироби”. Szczegóły produktu uzupełnimy po zatwierdzeniu danych." }
  ];

  window.PRODUCTS = products;

  const grid = document.querySelector("#product-grid");
  if (!grid) return;

  const text = (tag, className, value) => {
    const node = document.createElement(tag);
    node.className = className;
    node.textContent = value;
    return node;
  };
  const icon = name => {
    const node = document.createElement("i");
    node.dataset.lucide = name;
    node.setAttribute("aria-hidden", "true");
    return node;
  };
  const cards = [];
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const duration = 720;
  const easing = "cubic-bezier(.22,1,.36,1)";
  let active = null;
  let generation = 0;
  let resizeFrame = 0;
  let originalInline = null;

  const waitFor = animations => Promise.allSettled(animations.map(animation => animation.finished));
  const cancelAnimations = state => {
    for (const animation of state?.animations || []) animation.cancel();
    if (state) state.animations = [];
  };
  const focus = node => node?.focus({ preventScroll: true });
  const headerBottom = () => document.querySelector(".site-header, header")?.getBoundingClientRect().bottom || 0;
  const scrollGridIntoView = () => {
    const gridRect = grid.getBoundingClientRect();
    const inset = Math.max(headerBottom(), 12) + 16;
    if (gridRect.top < inset || gridRect.bottom > window.innerHeight) {
      window.scrollTo({ top: Math.max(0, window.scrollY + gridRect.top - inset), behavior: motionQuery.matches ? "instant" : "smooth" });
    }
  };

  const makeGeometry = () => {
    const bounds = grid.getBoundingClientRect();
    return {
      grid: bounds,
      cards: new Map(cards.map(card => {
        const rect = card.getBoundingClientRect();
        return [card, { left: rect.left - bounds.left, top: rect.top - bounds.top, width: rect.width, height: rect.height }];
      }))
    };
  };
  const applyAbsoluteGeometry = geometry => {
    for (const [card, rect] of geometry.cards) {
      Object.assign(card.style, { position: "absolute", left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px`, height: `${rect.height}px` });
    }
  };
  const clearOwnedGeometry = () => {
    for (const card of cards) {
      const saved = originalInline?.cards.get(card);
      for (const property of ["position", "left", "top", "width", "height", "opacity", "transform", "z-index"]) {
        const previous = saved?.get(property);
        if (previous) card.style.setProperty(property, previous.value, previous.priority);
        else card.style.removeProperty(property);
      }
      card.classList.remove("is-expanded", "is-muted");
      card.inert = false;
      card.removeAttribute("aria-hidden");
      const trigger = card.querySelector(".product-card__trigger");
      trigger?.setAttribute("aria-expanded", "false");
      if (trigger) trigger.hidden = false;
      const details = card.querySelector(".product-card__details");
      if (details) details.hidden = true;
      const close = card.querySelector(".product-card__close");
      if (close) close.hidden = true;
    }
    const savedHeight = originalInline?.gridHeight;
    if (savedHeight) grid.style.setProperty("height", savedHeight.value, savedHeight.priority);
    else grid.style.removeProperty("height");
    grid.classList.remove("is-expanded", "is-transitioning");
    originalInline = null;
  };
  const closeCurrent = async ({ focusTarget, scrollToStore = false } = {}) => {
    if (!active) return;
    const state = active;
    if (state.phase === "closing") return;
    const token = ++generation;
    state.phase = "closing";
    const currentRects = new Map(cards.map(card => [card, card.getBoundingClientRect()]));
    const currentGridHeight = grid.getBoundingClientRect().height;
    const currentGrid = grid.getBoundingClientRect();
    cancelAnimations(state);
    for (const card of cards) card.classList.remove("is-muted");
    grid.style.height = `${currentGridHeight}px`;
    grid.classList.add("is-transitioning");
    for (const card of cards) {
      const rect = state.geometry.cards.get(card);
      if (card === state.card) {
        card.style.left = `${currentRects.get(card).left - currentGrid.left}px`;
        card.style.top = `${currentRects.get(card).top - currentGrid.top}px`;
        card.style.width = `${currentRects.get(card).width}px`;
        card.style.height = `${currentRects.get(card).height}px`;
      } else {
        Object.assign(card.style, { position: "absolute", left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px`, height: `${rect.height}px`, opacity: "0", transform: "scale(.78)" });
      }
    }
    const animations = [];
    if (!motionQuery.matches && typeof Element.prototype.animate === "function") {
      for (const [card, rect] of state.geometry.cards) {
        if (card !== state.card) {
          animations.push(card.animate([{ opacity: 0, transform: "scale(.78)" }, { opacity: 1, transform: "scale(1)" }], { duration: 440, easing, fill: "forwards" }));
          continue;
        }
        const from = currentRects.get(card);
        animations.push(card.animate([
          { left: `${from.left - currentGrid.left}px`, top: `${from.top - currentGrid.top}px`, width: `${from.width}px`, height: `${from.height}px` },
          { left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px`, height: `${rect.height}px` }
        ], { duration: card === state.card ? duration : 440, easing, fill: "forwards" }));
      }
      animations.push(grid.animate([{ height: `${currentGridHeight}px` }, { height: `${state.geometry.grid.height}px` }], { duration: duration, easing, fill: "forwards" }));
    }
    grid.style.height = `${state.geometry.grid.height}px`;
    state.animations = animations;
    await waitFor(animations);
    if (token !== generation || active !== state) return;
    for (const [card, rect] of state.geometry.cards) {
      Object.assign(card.style, { left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px`, height: `${rect.height}px` });
      if (card !== state.card) { card.style.opacity = "1"; card.style.transform = "scale(1)"; }
    }
    clearOwnedGeometry();
    cancelAnimations(state);
    active = null;
    window.ScrollTrigger?.refresh();
    const destination = scrollToStore ? document.querySelector("#gdzie-kupic") : (focusTarget || state.trigger);
    if (scrollToStore && destination) destination.tabIndex = -1;
    if (destination) {
      if (scrollToStore) {
        if (location.hash !== "#gdzie-kupic") history.pushState(null, "", "#gdzie-kupic");
        destination.scrollIntoView({ behavior: motionQuery.matches ? "instant" : "smooth", block: "start" });
      } else {
        const rect = destination.getBoundingClientRect();
        if (rect.top < headerBottom() || rect.bottom > window.innerHeight) destination.scrollIntoView({ behavior: motionQuery.matches ? "instant" : "smooth", block: "nearest" });
      }
      requestAnimationFrame(() => focus(destination));
    }
  };
  const open = async (card, trigger) => {
    if (active) {
      if (active.card === card) return closeCurrent();
      return;
    }
    document.dispatchEvent(new CustomEvent("darnytskie:productexpand", { detail: { card } }));
    const geometry = makeGeometry();
    const capped = window.innerWidth <= 1100;
    const headerAllowance = Math.max(0, window.innerHeight - headerBottom() - 32);
    const targetHeight = capped ? Math.min(geometry.grid.height, Math.max(520, Math.min(800, headerAllowance))) : geometry.grid.height;
    const gridWidth = geometry.grid.width;
    const token = ++generation;
    originalInline = {
      gridHeight: grid.style.getPropertyValue("height") ? { value: grid.style.getPropertyValue("height"), priority: grid.style.getPropertyPriority("height") } : null,
      cards: new Map(cards.map(item => [item, new Map(["position", "left", "top", "width", "height", "opacity", "transform", "z-index"].map(property => [property, item.style.getPropertyValue(property) ? { value: item.style.getPropertyValue(property), priority: item.style.getPropertyPriority(property) } : null]))]))
    };
    active = { card, trigger, geometry, phase: "opening", token, animations: [] };
    scrollGridIntoView();
    const gridRectAfterScroll = grid.getBoundingClientRect();
    const liveGeometry = {
      ...geometry,
      grid: gridRectAfterScroll,
      cards: new Map(cards.map(item => {
        const rect = item.getBoundingClientRect();
        const old = geometry.cards.get(item);
        return [item, { ...old, viewportLeft: rect.left, viewportTop: rect.top }];
      }))
    };
    active.geometry = liveGeometry;
    const starts = new Map(cards.map(item => [item, item.getBoundingClientRect()]));
    grid.style.height = `${geometry.grid.height}px`;
    grid.classList.add("is-expanded", "is-transitioning");
    applyAbsoluteGeometry(liveGeometry);
    for (const item of cards) {
      if (item === card) {
        item.classList.add("is-expanded");
        const details = item.querySelector(".product-card__details");
        const closeButton = item.querySelector(".product-card__close");
        const itemTrigger = item.querySelector(".product-card__trigger");
        if (details) details.hidden = false;
        if (closeButton) closeButton.hidden = false;
        if (itemTrigger) { itemTrigger.hidden = true; itemTrigger.setAttribute("aria-expanded", "true"); }
      } else {
        item.classList.add("is-muted");
        item.inert = true;
        item.setAttribute("aria-hidden", "true");
      }
    }
    const destination = new Map(liveGeometry.cards);
    destination.set(card, { left: 0, top: 0, width: gridWidth, height: targetHeight });
    const animations = [];
    if (!motionQuery.matches && typeof Element.prototype.animate === "function") {
      for (const [item, rect] of destination) {
        if (item !== card) {
          animations.push(item.animate([{ opacity: 1, transform: "scale(1)" }, { opacity: 0, transform: "scale(.78)" }], { duration: 440, easing, fill: "forwards" }));
          continue;
        }
        const start = starts.get(item);
        animations.push(item.animate([
          { left: `${start.left - liveGeometry.grid.left}px`, top: `${start.top - liveGeometry.grid.top}px`, width: `${start.width}px`, height: `${start.height}px` },
          { left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px`, height: `${rect.height}px` }
        ], { duration: item === card ? duration : 440, easing, fill: "forwards" }));
      }
      if (capped) animations.push(grid.animate([{ height: `${geometry.grid.height}px` }, { height: `${targetHeight}px` }], { duration, easing, fill: "forwards" }));
    }
    grid.style.height = `${targetHeight}px`;
    active.animations = animations;
    await waitFor(animations);
    if (token !== generation || !active || active.card !== card) return;
    for (const [item, rect] of destination) Object.assign(item.style, { left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px`, height: `${rect.height}px` });
    for (const item of cards) if (item !== card) { item.style.opacity = "0"; item.style.transform = "scale(.78)"; }
    cancelAnimations(active);
    grid.classList.remove("is-transitioning");
    active.phase = "open";
    focus(card.querySelector(".product-card__close"));
    window.ScrollTrigger?.refresh();
  };

  products.forEach((product, index) => {
    const card = document.createElement("article");
    card.className = `product-card ${product.size} ${product.image ? "product-card--photo" : ""}`.trim();
    card.dataset.productId = product.id;
    card.style.setProperty("--product-color", product.color);
    card.setAttribute("aria-labelledby", `product-name-${product.id}`);
    const picture = document.createElement("span");
    picture.className = "product-card__image";
    picture.setAttribute("aria-hidden", "true");
    const artwork = document.createElement("img");
    artwork.src = product.image || product.label;
    artwork.alt = "";
    artwork.loading = index < 3 ? "eager" : "lazy";
    artwork.decoding = "async";
    picture.append(artwork);
    const top = document.createElement("span");
    top.className = "product-card__top";
    top.append(text("span", "product-card__number", String(index + 1).padStart(2, "0")), text("span", "product-card__category", product.category));
    const bottom = document.createElement("span");
    bottom.className = "product-card__bottom";
    const name = text("span", "product-card__name", product.name);
    name.id = `product-name-${product.id}`;
    const arrow = text("span", "product-card__arrow", "↗");
    arrow.setAttribute("aria-hidden", "true");
    bottom.append(name, arrow);
    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "product-card__trigger";
    trigger.setAttribute("aria-expanded", "false");
    trigger.setAttribute("aria-controls", `product-details-${product.id}`);
    trigger.setAttribute("aria-label", `${product.name}, ${product.category}`);
    trigger.addEventListener("click", () => open(card, trigger));
    const details = document.createElement("div");
    details.className = "product-card__details";
    details.id = `product-details-${product.id}`;
    details.hidden = true;
    details.setAttribute("aria-labelledby", name.id);
    details.append(text("p", "product-card__description", product.description), text("p", "product-card__specs", "Szczegóły produktu w przygotowaniu"));
    const buy = document.createElement("a");
    buy.className = "product-card__buy";
    buy.href = "#gdzie-kupic";
    buy.append(document.createTextNode("Gdzie kupić "), icon("arrow-up-right"));
    buy.addEventListener("click", event => {
      event.preventDefault();
      closeCurrent({ scrollToStore: true });
    });
    details.append(buy);
    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.className = "product-card__close";
    closeButton.hidden = true;
    closeButton.setAttribute("aria-label", "Zwiń produkt");
    closeButton.append(icon("x"));
    closeButton.addEventListener("click", () => closeCurrent());
    card.append(top, picture, bottom, trigger, details, closeButton);
    grid.append(card);
    cards.push(card);
  });
  window.DarnytskieI18n?.translate(grid);
  window.lucide?.createIcons?.();

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && active && !document.querySelector("#mobile-menu")?.open) {
      event.preventDefault();
      closeCurrent();
    }
  });
  motionQuery.addEventListener?.("change", () => {
    if (!active) return;
    const state = active;
    ++generation;
    for (const animation of state.animations || []) animation.finish();
    cancelAnimations(state);
    if (state.phase === "closing") {
      clearOwnedGeometry();
      active = null;
      window.ScrollTrigger?.refresh();
      if (state.trigger.isConnected) {
        const rect = state.trigger.getBoundingClientRect();
        if (rect.top < headerBottom() || rect.bottom > window.innerHeight) state.trigger.scrollIntoView({ behavior: "instant", block: "nearest" });
        focus(state.trigger);
      }
      return;
    }
    if (state.phase === "opening") {
      const targetHeight = window.innerWidth <= 1100 ? Math.min(state.geometry.grid.height, Math.max(520, Math.min(800, window.innerHeight - headerBottom() - 32))) : state.geometry.grid.height;
      grid.style.height = `${targetHeight}px`;
      Object.assign(state.card.style, { left: "0px", top: "0px", width: `${state.geometry.grid.width}px`, height: `${targetHeight}px` });
      for (const item of cards) if (item !== state.card) { item.style.opacity = "0"; item.style.transform = "scale(.78)"; }
      grid.classList.remove("is-transitioning");
      focus(state.card.querySelector(".product-card__close"));
    }
    state.phase = "open";
    window.ScrollTrigger?.refresh();
  });
  window.addEventListener("resize", () => {
    if (!active) return;
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(() => {
      if (!active) return;
      const state = active;
      ++generation;
      cancelAnimations(state);
      clearOwnedGeometry();
      active = null;
      window.ScrollTrigger?.refresh();
      requestAnimationFrame(() => {
        const rect = state.trigger.getBoundingClientRect();
        if (rect.top < headerBottom() || rect.bottom > window.innerHeight) state.trigger.scrollIntoView({ behavior: "instant", block: "nearest" });
        focus(state.trigger);
      });
    });
  }, { passive: true });
})();
