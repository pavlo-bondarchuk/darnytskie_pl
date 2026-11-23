(() => {
  const root = document.documentElement;
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  const groups = new Map();
  for (const element of document.querySelectorAll(
    ".hero-image, #hero-title, .ribbons, .section-intro .eyebrow, #products-title, #serving-title, .availability .eyebrow, #locator-title"
  )) {
    groups.set(element, [element]);
  }
  const panel = document.querySelector(".locator-panel");
  const addresses = [...panel.querySelectorAll(".store-addresses li, #store-locator")]
    .filter(element => !element.closest("[hidden]"));
  const mark = document.querySelector(".locator-mark img");
  if (addresses.length) groups.set(addresses[0], [mark, ...addresses]);

  if (!("IntersectionObserver" in window) || motion.matches) {
    document.querySelector(".ribbons").classList.add("is-revealed");
    return;
  }
  for (const elements of groups.values()) {
    for (const element of elements) element.classList.add("is-pending");
  }
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting || entry.intersectionRatio < .12) continue;
      for (const element of groups.get(entry.target)) {
        element.classList.replace("is-pending", "is-revealed");
      }
      observer.unobserve(entry.target);
    }
  }, { root: document, threshold: .12 });
  const start = () => {
    for (const target of groups.keys()) observer.observe(target);
  };
  if (root.classList.contains("intro-pending")) {
    document.addEventListener("darnytskie:ready", start, { once: true });
  } else {
    start();
  }
})();
