(() => {
  const products = [
    { id: "vershkova", name: "Śmietankowa", originalName: "Вершкова", category: "Kiełbasa", color: "#E8B868", label: "assets/labels/sausage-butter-rect.webp", size: "product-card--large", description: "Poznaj Śmietankową — produkt marki „Дарницькі вироби”. Szczegóły produktu uzupełnimy po zatwierdzeniu danych." },
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
  const dialog = document.querySelector("#product-dialog");
  let bodyOverflow = "";
  if (!grid) return;

  const text = (tag, className, value) => {
    const node = document.createElement(tag);
    node.className = className;
    node.textContent = value;
    return node;
  };

  const openProduct = (product, trigger) => {
    if (!dialog) return;
    const image = dialog.querySelector(".modal-image");
    const name = dialog.querySelector("#modal-name");
    const category = dialog.querySelector("#modal-category");
    const description = dialog.querySelector("#modal-description");
    const specs = dialog.querySelector("#modal-specs");
    const close = dialog.querySelector("#modal-close");
    if (name) name.textContent = product.name;
    if (category) category.textContent = product.category;
    if (description) description.textContent = product.description;
    if (specs) {
      const placeholder = document.createElement("span");
      placeholder.textContent = "Szczegóły produktu w przygotowaniu";
      specs.replaceChildren(placeholder);
    }
    if (image) {
      image.replaceChildren();
      image.style.setProperty("--product-color", product.color);
      const artwork = document.createElement("img");
      artwork.src = product.label;
    artwork.alt = `Oryginalna etykieta produktu ${product.name}`;
      artwork.loading = "lazy";
      image.append(artwork);
    }
    const buy = dialog.querySelector(".modal-buy");
    if (buy) buy.href = "#gdzie-kupic";
    dialog.dataset.productId = product.id;
    dialog._returnFocus = trigger;
    if (!dialog.open) dialog.showModal();
    bodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.classList.add("dialog-open");
    close?.focus();
  };

  products.forEach((product, index) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = `product-card ${product.size}`.trim();
    card.dataset.productId = product.id;
    card.style.setProperty("--product-color", product.color);
    card.setAttribute("aria-haspopup", "dialog");
    card.setAttribute("aria-label", `${product.name}, ${product.category}`);
    const picture = document.createElement("span");
    picture.className = "product-card__image";
    picture.setAttribute("aria-hidden", "true");
    const artwork = document.createElement("img");
    artwork.src = product.label;
    artwork.alt = "";
    artwork.loading = index < 3 ? "eager" : "lazy";
    artwork.decoding = "async";
    picture.append(artwork);
    const top = document.createElement("span");
    top.className = "product-card__top";
    top.append(text("span", "product-card__number", String(index + 1).padStart(2, "0")), text("span", "product-card__category", product.category));
    const bottom = document.createElement("span");
    bottom.className = "product-card__bottom";
    const arrow = text("span", "product-card__arrow", "↗");
    arrow.setAttribute("aria-hidden", "true");
    bottom.append(text("span", "product-card__name", product.name), arrow);
    card.append(top, picture, bottom);
    card.addEventListener("click", () => openProduct(product, card));
    grid.append(card);
  });

  if (dialog) {
    const close = dialog.querySelector("#modal-close");
    close?.addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", event => {
      if (event.target !== dialog) return;
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
    });
    dialog.addEventListener("close", () => {
      document.body.classList.remove("dialog-open");
      document.body.style.overflow = bodyOverflow;
      dialog._returnFocus?.focus();
      dialog._returnFocus = null;
    });
    dialog.addEventListener("click", event => {
      if (event.target.closest(".modal-buy")) dialog.close();
    });
  }
})();
