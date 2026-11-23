(() => {
  window.STORES = Array.isArray(window.STORES) ? window.STORES : [];
  const stores = window.STORES.filter(store => store?.verified === true && store.name?.trim() && store.city?.trim() && store.address?.trim());
  const section = document.querySelector(".availability");
  if (section && "IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    section.classList.add("is-pending");
    const reveal = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      section.classList.replace("is-pending", "is-revealed");
      reveal.disconnect();
    }, { threshold: .12 });
    reveal.observe(section);
  }
  if (!stores.length) return;
  const search = document.querySelector("#store-search");
  const results = document.querySelector("#store-results");
  const normalize = value => value.toLocaleLowerCase("pl").replaceAll("ł", "l").normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  const render = () => {
    const polish = document.documentElement.lang === "pl";
    const query = normalize(search.value);
    results.replaceChildren();
    for (const store of stores) {
      const address = [store.address, store.city].join(", ");
      if (!normalize(store.name + " " + address).includes(query)) continue;
      const row = document.createElement("p");
      const title = document.createElement("strong");
      title.textContent = store.name;
      const link = document.createElement("a");
      link.href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(address);
      link.textContent = address;
      row.append(title, document.createElement("br"), link);
      results.append(row);
    }
    if (!results.childElementCount) results.textContent = polish ? "Brak wyników. Spróbuj innej nazwy lub miejscowości." : "Збігів немає. Спробуйте іншу назву чи місто.";
  };
  document.querySelector("#store-addresses").hidden = true;
  document.querySelector("#store-locator").hidden = false;
  search.addEventListener("input", render);
  document.addEventListener("darnytskie:languagechange", render);
  render();
})();
