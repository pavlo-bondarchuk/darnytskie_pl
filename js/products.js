(() => {
  const products = [
    {
      id: "vershkova",
      name: "Śmietankowa",
      originalName: "Вершкова",
      category: "Kiełbasa",
      color: "#ecd3a3",
      label: "assets/labels/sausage-butter-rect.webp",
      description: "Викладіть скибочки на теплий тост із маслом і посипте зеленою цибулею.",
      descriptionPl: "Ułóż plastry na ciepłej grzance z masłem i posyp szczypiorkiem."
    },
    {
      id: "doktorska",
      name: "Doktorska",
      originalName: "Докторська",
      category: "Kiełbasa",
      color: "#f2d8cc",
      label: "assets/labels/sausage-doctor-classic.webp",
      description: "До тонких скибочок подайте житній хліб і трохи гірчиці.",
      descriptionPl: "Do cienkich plastrów podaj chleb żytni i odrobinę musztardy."
    },
    {
      id: "studentska",
      name: "Studencka",
      originalName: "Студентська",
      category: "Kiełbasa",
      color: "#ddc5aa",
      label: "assets/labels/sausage-student.webp",
      description: "Розріжте булочку з маком, змастіть гірчицею й додайте ковбасу та огірок.",
      descriptionPl: "Przekrój bułkę z makiem, posmaruj musztardą i przełóż kiełbasą oraz ogórkiem."
    },
    {
      id: "gota",
      name: "Gota",
      originalName: "Гота",
      labelName: "Ковбаса GOTA",
      category: "Kiełbasa",
      color: "#d9cbdc",
      label: "assets/labels/sausage-gota.webp",
      description: "До тонко нарізаної ковбаси додайте житні хлібці та кільця червоної цибулі.",
      descriptionPl: "Podaj cienkie plastry z chrupkim pieczywem żytnim i krążkami czerwonej cebuli."
    },
    {
      id: "doktorska-premium",
      name: "Doktorska Premium",
      originalName: "Докторська Преміум",
      category: "Kiełbasa",
      color: "#d4ddbf",
      label: "assets/labels/sausage-doctor-premium.webp",
      description: "Викладіть тонкі скибочки складками на багет із маслом і додайте корнішони.",
      descriptionPl: "Złóż cienkie plastry na bagietce z masłem i dodaj korniszony."
    },
    {
      id: "doktorska-extra",
      name: "Doktorska Extra",
      originalName: "Докторська Екстра",
      category: "Kiełbasa",
      color: "#c8dce3",
      label: "assets/labels/sausage-doctor-extra.webp",
      description: "Підсмажте сендвіч із ковбасою, сиром і помідором. Розріжте навскіс і подавайте гарячим.",
      descriptionPl: "Zapiecz w kanapce z serem i pomidorem. Przekrój po skosie i podaj na gorąco."
    },
    {
      id: "uszka-wedzone",
      name: "Wędzone uszy wieprzowe",
      originalName: "Копчені свинячі вуха",
      labelName: "Свинячі вуха гарячого копчення",
      category: "Przekąska",
      color: "#e1c5af",
      label: "assets/labels/pork-ears-smoked.webp",
      description: "Подавайте з маринованою цибулею, гірчицею та хрустким житнім хлібом.",
      descriptionPl: "Podaj z marynowaną cebulą, musztardą i chrupiącym pieczywem żytnim."
    },
    {
      id: "parowki",
      name: "Parówki Doktorskie",
      originalName: "Сосиски Докторські",
      category: "Parówki",
      color: "#f1dcb9",
      label: "assets/labels/sausage-doctor-oval.webp",
      description: "Підігрійте сосиски, покладіть у рум’яну булочку й додайте гірчицю та дрібно нарізаний огірок.",
      descriptionPl: "Podgrzej parówki, włóż do rumianej bułki i dodaj musztardę oraz posiekany ogórek."
    },
    {
      id: "molochna",
      name: "Mleczna",
      originalName: "Молочна",
      category: "Kiełbasa",
      color: "#dfcfb7",
      label: "assets/labels/sausage-milk-rect.webp",
      description: "Подавайте теплою з яєчнею, кропом і хрустким тостом.",
      descriptionPl: "Podaj na ciepło z jajkiem sadzonym, koperkiem i chrupiącym tostem."
    },
    {
      id: "olivye",
      name: "Olivier",
      originalName: "Олів’є",
      category: "Kiełbasa",
      color: "#dfcfb7",
      label: "assets/labels/sausage-olivye.webp",
      description: "Наріжте кубиками й додайте горошок, картоплю, моркву та майонез.",
      descriptionPl: "Pokrój w kostkę i połącz z groszkiem, ziemniakami, marchewką i majonezem."
    }
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
  const cards = [];
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const hoverMotion = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
  let tracked = null;
  let tiltFrame = 0;
  const clearTilt = () => {
    cancelAnimationFrame(tiltFrame);
    if (!tracked) return;
    tracked.classList.remove("is-tracking");
    tracked.style.removeProperty("--tilt-x");
    tracked.style.removeProperty("--tilt-y");
    tracked = null;
  };
  grid.addEventListener("pointermove", event => {
    if (event.pointerType !== "mouse" || !hoverMotion.matches || active) return;
    const card = event.target.closest(".product-card");
    if (card !== tracked) clearTilt();
    if (!card) return;
    tracked = card;
    cancelAnimationFrame(tiltFrame);
    tiltFrame = requestAnimationFrame(() => {
      const rect = card.getBoundingClientRect();
      const angle = fraction => Math.max(-1, Math.min(1, 2 * fraction - 1)) * 7;
      card.style.setProperty("--tilt-x", -angle((event.clientY - rect.top) / rect.height) + "deg");
      card.style.setProperty("--tilt-y", angle((event.clientX - rect.left) / rect.width) + "deg");
      card.classList.add("is-tracking");
    });
  });
  grid.addEventListener("pointerleave", clearTilt);
  grid.addEventListener("pointercancel", clearTilt);
  window.addEventListener("blur", clearTilt);
  hoverMotion.addEventListener("change", clearTilt);
  const duration = 720;
  const easing = "cubic-bezier(.2,.8,.2,1)";
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
  const revealRadius = (width, height) => Math.ceil(Math.hypot(width, height) / 2) + 2;
  const circleMask = (radius, origin) => `circle(${radius}px at ${origin.x}% ${origin.y}%)`;
  const staggerDelay = (geometry, selectedCard, card, reverse = false) => {
    const center = rect => ({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    const from = center(geometry.cards.get(selectedCard));
    const to = center(geometry.cards.get(card));
    const distance = Math.hypot(to.x - from.x, to.y - from.y);
    const farthest = Math.max(...Array.from(geometry.cards.values(), rect => {
      const point = center(rect);
      return Math.hypot(point.x - from.x, point.y - from.y);
    }));
    const progress = farthest ? distance / farthest : 0;
    return Math.round((reverse ? 1 - progress : progress) * 120);
  };
  const applyAbsoluteGeometry = geometry => {
    for (const [card, rect] of geometry.cards) {
      Object.assign(card.style, { position: "absolute", left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px`, height: `${rect.height}px` });
    }
  };
  const clearOwnedGeometry = () => {
    for (const card of cards) {
      const saved = originalInline?.cards.get(card);
      for (const property of ["position", "left", "top", "width", "height", "opacity", "transform", "z-index", "clip-path"]) {
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
  const closeCurrent = async () => {
    if (!active) return;
    const state = active;
    if (state.phase === "closing") return;
    const token = ++generation;
    state.phase = "closing";
    const currentRects = new Map(cards.map(card => [card, card.getBoundingClientRect()]));
    const computedMask = getComputedStyle(state.card).clipPath;
    const currentGridHeight = grid.getBoundingClientRect().height;
    const currentGrid = grid.getBoundingClientRect();
    cancelAnimations(state);
    const fromMask = computedMask !== "none" ? computedMask : circleMask(state.revealRadius, state.revealOrigin);
    state.card.style.clipPath = fromMask;
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
        Object.assign(card.style, { position: "absolute", left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px`, height: `${rect.height}px`, opacity: "0", transform: "scale(.9)" });
      }
    }
    const animations = [];
    if (!motionQuery.matches && typeof Element.prototype.animate === "function") {
      for (const [card, rect] of state.geometry.cards) {
        if (card !== state.card) {
          animations.push(card.animate([{ opacity: 0, transform: "scale(.9)" }, { opacity: 1, transform: "scale(1)" }], { duration: 460, delay: staggerDelay(state.geometry, state.card, card, true), easing, fill: "forwards" }));
          continue;
        }
        const from = currentRects.get(card);
        animations.push(card.animate([
          { left: `${from.left - currentGrid.left}px`, top: `${from.top - currentGrid.top}px`, width: `${from.width}px`, height: `${from.height}px` },
          { left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px`, height: `${rect.height}px` }
        ], { duration: card === state.card ? duration : 440, easing, fill: "forwards" }));
      }
      animations.push(state.card.animate([
        { clipPath: fromMask },
        { clipPath: circleMask(0, state.revealOrigin) }
      ], { duration, easing, fill: "forwards" }));
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
    const destination = state.trigger;
    const rect = destination.getBoundingClientRect();
    if (rect.top < headerBottom() || rect.bottom > window.innerHeight) destination.scrollIntoView({ behavior: "instant", block: "nearest" });
    focus(destination);
  };
  const open = async (card, trigger) => {
    if (active) {
      if (active.card === card) return closeCurrent();
      return;
    }
    document.dispatchEvent(new CustomEvent("darnytskie:productexpand", { detail: { card } }));
    clearTilt();
    const revealOrigin = { x: 50, y: 50 };
    const geometry = makeGeometry();

    const headerAllowance = Math.max(0, window.innerHeight - headerBottom() - 32);
    const targetHeight = Math.max(500, Math.min(640, headerAllowance));
    const gridWidth = geometry.grid.width;
    const token = ++generation;
    originalInline = {
      gridHeight: grid.style.getPropertyValue("height") ? { value: grid.style.getPropertyValue("height"), priority: grid.style.getPropertyPriority("height") } : null,
      cards: new Map(cards.map(item => [item, new Map(["position", "left", "top", "width", "height", "opacity", "transform", "z-index", "clip-path"].map(property => [property, item.style.getPropertyValue(property) ? { value: item.style.getPropertyValue(property), priority: item.style.getPropertyPriority(property) } : null]))]))
    };
    active = { card, trigger, geometry, phase: "opening", token, animations: [], revealOrigin, revealRadius: revealRadius(gridWidth, targetHeight) };
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
          animations.push(item.animate([{ opacity: 1, transform: "scale(1)" }, { opacity: 0, transform: "scale(.9)" }], { duration: 460, delay: staggerDelay(liveGeometry, card, item), easing, fill: "forwards" }));
          continue;
        }
        const start = starts.get(item);
        animations.push(item.animate([
          { left: `${start.left - liveGeometry.grid.left}px`, top: `${start.top - liveGeometry.grid.top}px`, width: `${start.width}px`, height: `${start.height}px` },
          { left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px`, height: `${rect.height}px` }
        ], { duration: item === card ? duration : 440, easing, fill: "forwards" }));
        if (item === card) animations.push(item.animate([
          { clipPath: circleMask(0, revealOrigin) },
          { clipPath: circleMask(active.revealRadius, revealOrigin) }
        ], { duration, easing, fill: "forwards" }));
      }
      animations.push(grid.animate([{ height: `${geometry.grid.height}px` }, { height: `${targetHeight}px` }], { duration, easing, fill: "forwards" }));
    }
    grid.style.height = `${targetHeight}px`;
    active.animations = animations;
    await waitFor(animations);
    if (token !== generation || !active || active.card !== card) return;
    for (const [item, rect] of destination) Object.assign(item.style, { left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px`, height: `${rect.height}px` });
    for (const item of cards) if (item !== card) { item.style.opacity = "0"; item.style.transform = "scale(.9)"; }
    cancelAnimations(active);
    grid.classList.remove("is-transitioning");
    active.phase = "open";
    focus(card.querySelector(".product-card__close"));
    window.ScrollTrigger?.refresh();
  };

  const categoryNames = { "Kiełbasa": "Ковбаса", "Parówki": "Сосиски", "Przekąska": "Закуска" };
  const dualText = (tag, className, uk, pl) => {
    const node = text(tag, className, uk);
    node.dataset.pl = pl;
    return node;
  };

  products.forEach(product => {
    const card = document.createElement("article");
    card.className = "product-card";
    card.dataset.productId = product.id;
    card.dataset.category = product.category;
    card.style.setProperty("--product-color", product.color);
    card.setAttribute("aria-labelledby", `product-name-${product.id}`);
    const picture = document.createElement("div");
    picture.className = "product-card__image";
    const servingImage = document.createElement("img");
    servingImage.className = "serving-art";
    servingImage.src = `assets/products/serving/${product.id}.webp`;
    servingImage.alt = "";
    servingImage.loading = "lazy";
    servingImage.decoding = "async";
    picture.append(servingImage);

    const bottom = document.createElement("div");
    bottom.className = "product-card__bottom";
    const category = dualText("span", "product-card__category", categoryNames[product.category], product.category);
    const name = dualText("h3", "product-card__name", product.originalName, product.name);
    name.id = `product-name-${product.id}`;
    bottom.append(category, name);
    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "product-card__trigger";
    trigger.setAttribute("aria-expanded", "false");
    trigger.setAttribute("aria-controls", `product-details-${product.id}`);
    trigger.setAttribute("aria-labelledby", name.id);
    trigger.addEventListener("click", () => open(card, trigger));

    const details = document.createElement("div");
    details.className = "product-card__details";
    details.id = `product-details-${product.id}`;
    details.hidden = true;
    const caption = dualText("p", "detail-label", "Як подати", "Jak podać");
    const description = dualText("p", "detail-copy", product.description, product.descriptionPl);
    details.append(caption, description);
    const closeButton = dualText("button", "product-card__close", "Закрити", "Zamknij");
    closeButton.type = "button";
    closeButton.hidden = true;
    closeButton.addEventListener("click", () => closeCurrent());
    const surface = document.createElement("div");
    surface.className = "product-card__surface";
    surface.append(picture, bottom, trigger);
    card.append(surface, details, closeButton);
    grid.append(card);
    cards.push(card);
  });
  window.DarnytskieI18n.translate(grid);

  const filters = [...document.querySelectorAll("[data-filter]")];
  const setFilter = category => {
    clearTilt();
    filters.forEach(button => button.setAttribute("aria-pressed", String(button.dataset.filter === category)));
    cards.forEach(card => { card.hidden = category !== "all" && card.dataset.category !== category; });
  };
  let request = 0;
  const resetExpansion = () => {
    if (!active) return;
    ++generation;
    cancelAnimations(active);
    clearOwnedGeometry();
    active = null;
  };
  filters.forEach(button => button.addEventListener("click", () => {
    ++request;
    resetExpansion();
    setFilter(button.dataset.filter);
  }));
  document.querySelectorAll("[data-show-product]").forEach(button => button.addEventListener("click", () => {
    const selected = cards.find(card => card.dataset.productId === button.dataset.showProduct);
    if (!selected) return;
    const token = ++request;
    resetExpansion();
    if (selected.hidden) setFilter("all");
    grid.scrollIntoView({ behavior: "instant", block: "start" });
    requestAnimationFrame(() => {
      if (token === request) open(selected, selected.querySelector(".product-card__trigger"));
    });
  }));

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
      const targetHeight = Math.max(500, Math.min(640, window.innerHeight - headerBottom() - 32));
      grid.style.height = `${targetHeight}px`;
      Object.assign(state.card.style, { left: "0px", top: "0px", width: `${state.geometry.grid.width}px`, height: `${targetHeight}px` });
      for (const item of cards) if (item !== state.card) { item.style.opacity = "0"; item.style.transform = "scale(.9)"; }
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
