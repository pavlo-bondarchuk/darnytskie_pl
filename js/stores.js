(() => {
  window.STORES = Array.isArray(window.STORES) ? window.STORES : [];

  const input = document.querySelector("#store-search");
  const results = document.querySelector("#store-results");
  const map = document.querySelector("#store-map");
  if (!results || !map) return;
  let accessibleMapLabel = "";

  const normalize = value => value.toLocaleLowerCase("pl-PL").replace(/ł/g, "l").normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  const localize = (polish, ukrainian) => window.DarnytskieI18n?.getLanguage() === "uk" ? ukrainian : polish;

  const updateMapState = (title, detail, accessibleLabel) => {
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
    accessibleMapLabel = accessibleLabel;
    map.setAttribute("aria-label", accessibleMapLabel);
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
        title.textContent = store.name || store.city || localize("Punkt sprzedaży", "Точка продажу");
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
          link.textContent = localize("Otwórz w Google Maps", "Відкрити в Google Maps");
          link.setAttribute("aria-label", localize(`Otwórz adres ${store.address} w Google Maps`, `Відкрити адресу ${store.address} у Google Maps`));
          item.append(link);
        }
        results.append(item);
      });
      updateMapState(
        localize("POTWIERDZONE PUNKTY", "ПІДТВЕРДЖЕНІ ТОЧКИ"),
        localize("Lokalizacje z listy", "Адреси зі списку"),
        localize("Mapa: potwierdzone punkty sprzedaży", "Карта: підтверджені точки продажу")
      );
      return;
    }

    const message = document.createElement("p");
    message.textContent = window.STORES.length
      ? localize("Nie znaleźliśmy punktu dla tego miasta. Sprawdź pisownię lub spróbuj innej nazwy.", "Ми не знайшли магазину в цьому місті. Перевірте написання або введіть іншу назву.")
      : needle
        ? localize(`Brak potwierdzonych lokalizacji dla miasta „${query.trim()}”. Lista punktów jest w przygotowaniu.`, `У місті «${query.trim()}» поки немає підтверджених адрес. Список магазинів готується.`)
        : localize("Wersja demonstracyjna. Lista punktów sprzedaży jest w przygotowaniu; nie mamy jeszcze potwierdzonych adresów.", "Демонстраційна версія. Список магазинів готується; підтверджених адрес поки немає.");
    results.append(message);
    updateMapState(
      needle ? localize("BRAK POTWIERDZONEGO PUNKTU", "НЕМАЄ ПІДТВЕРДЖЕНИХ ТОЧОК") : localize("WERSJA DEMONSTRACYJNA", "ДЕМОНСТРАЦІЙНА ВЕРСІЯ"),
      needle ? localize(`Brak danych dla: ${query.trim()}`, `Немає даних для міста: ${query.trim()}`) : localize("Oczekiwanie na potwierdzone lokalizacje", "Очікуємо на підтверджені адреси"),
      needle ? localize(`Mapa: brak potwierdzonych punktów dla ${query.trim()}`, `Карта: немає підтверджених точок у місті ${query.trim()}`) : localize("Mapa demonstracyjna; brak potwierdzonych adresów sklepów", "Демонстраційна карта; підтверджених адрес магазинів поки немає")
    );
  };

  input?.addEventListener("input", () => render(input.value));
  document.addEventListener("darnytskie:languagechange", () => {
    render(input?.value || "");
    queueMicrotask(() => map.setAttribute("aria-label", accessibleMapLabel));
  });
  render("");
})();
