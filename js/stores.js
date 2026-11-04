(() => {
  window.STORES = Array.isArray(window.STORES) ? window.STORES : [];

  const input = document.querySelector("#store-search");
  const results = document.querySelector("#store-results");
  const map = document.querySelector("#store-map");
  if (!results || !map) return;

  const normalize = value => value.toLocaleLowerCase("pl-PL").replace(/ł/g, "l").normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

  const updateMapState = (title, detail) => {
    const empty = map.querySelector(".map-empty");
    if (empty) {
      empty.replaceChildren();
      const count = document.createElement("span");
      count.textContent = title;
      const lineBreak = document.createElement("br");
      const message = document.createElement("b");
      message.textContent = detail;
      empty.append(count, lineBreak, message);
    }
    map.setAttribute("aria-label", detail);
  };

  const render = query => {
    const needle = normalize(query);
    const matches = window.STORES.filter(store => {
      const address = [store.address, store.city, store.name].filter(Boolean).join(" ");
      return !needle || normalize(address).includes(needle);
    });
    results.replaceChildren();
    if (matches.length) {
      matches.forEach(store => {
        const item = document.createElement("div");
        item.className = "store-result";
        const title = document.createElement("strong");
        title.textContent = store.name || store.city || "Punkt sprzedaży";
        item.append(title);
        if (store.address) {
          const address = document.createElement("p");
          address.textContent = store.address;
          item.append(address);
        }
        if (store.address && store.verified === true) {
          const link = document.createElement("a");
          link.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.address)}`;
          link.target = "_blank";
          link.rel = "noopener noreferrer";
          link.textContent = "Otwórz w Google Maps";
          link.setAttribute("aria-label", `Otwórz adres ${store.address} w Google Maps`);
          item.append(link);
        }
        results.append(item);
      });
      updateMapState("POTWIERDZONE PUNKTY", "Lokalizacje z listy");
      return;
    }

    const message = document.createElement("p");
    message.textContent = window.STORES.length
      ? "Nie znaleźliśmy punktu dla tego miasta. Sprawdź pisownię lub spróbuj innej nazwy."
      : needle
        ? `Brak potwierdzonych lokalizacji dla miasta „${query.trim()}”. Lista punktów jest w przygotowaniu.`
        : "Wersja demonstracyjna. Lista punktów sprzedaży jest w przygotowaniu; nie mamy jeszcze potwierdzonych adresów.";
    results.append(message);
    updateMapState(needle ? "BRAK POTWIERDZONEGO PUNKTU" : "WERSJA DEMONSTRACYJNA", needle ? `Brak danych dla: ${query.trim()}` : "Oczekiwanie na potwierdzone lokalizacje");
  };

  input?.addEventListener("input", () => render(input.value));
  document.addEventListener("darnytskie:languagechange", () => {
    render(input?.value || "");
    queueMicrotask(() => window.DarnytskieI18n?.translate(map));
  });
  render("");
})();
