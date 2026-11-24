(() => {
  const queue = window.dataLayer = window.dataLayer || [];
  const track = (event, parameters = {}) => queue.push({
    event,
    language: document.documentElement.lang,
    ...parameters
  });
  let source = "direct";
  let productId = null;
  document.addEventListener("darnytskie:productexpand", event => {
    track("product_open", { product_id: event.detail.card.dataset.productId });
  });
  document.addEventListener("click", event => {
    const link = event.target.closest("a");
    if (!link) return;
    if (link.dataset.storeSource) {
      source = link.dataset.storeSource;
      productId = link.closest("[data-product-id]")?.dataset.productId || null;
      track("find_store_click", { store_source: source, product_id: productId });
    }
    if (link.dataset.storeCity) {
      track("directions_click", { store_city: link.dataset.storeCity, store_source: source, product_id: productId });
    }
  });
  const observeStores = () => {
    if (!("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.intersectionRatio >= .25)) return;
      track("store_locator_view", { store_source: source, product_id: productId });
      observer.disconnect();
    }, { threshold: .25 });
    observer.observe(document.querySelector(".locator-panel"));
  };
  if (document.documentElement.classList.contains("intro-pending")) {
    document.addEventListener("darnytskie:ready", observeStores, { once: true });
  } else {
    observeStores();
  }
})();
