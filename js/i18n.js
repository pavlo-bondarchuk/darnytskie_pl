(() => {
  const originals = new WeakMap();
  let language = "uk";
  try {
    if (localStorage.getItem("darnytskie-language") === "pl") language = "pl";
  } catch {}

  const translate = (root = document) => {
    for (const node of root.querySelectorAll("[data-pl], [data-pl-alt], [data-pl-aria]")) {
      const attribute = node.hasAttribute("data-pl-aria") ? "aria-label" : node.hasAttribute("data-pl-alt") ? "alt" : null;
      if (!originals.has(node)) originals.set(node, attribute ? node.getAttribute(attribute) : node.textContent);
      const polish = attribute === "aria-label" ? node.dataset.plAria : attribute === "alt" ? node.dataset.plAlt : node.dataset.pl;
      const value = language === "pl" ? polish : originals.get(node);
      if (attribute) node.setAttribute(attribute, value);
      else node.textContent = value;
    }
  };
  const applyLanguage = () => {
    document.documentElement.lang = language;
    translate();
    const title = language === "uk" ? "Дарницькі вироби — до столу!" : "Darnytskie Wyroby — do stołu!";
    const description = language === "uk" ? "Ковбаси, сосиски й закуски «Дарницькі вироби». Оберіть продукт і знайдіть ідею для подачі." : "Kiełbasy, parówki i przekąski Darnytskie. Wybierz produkt i znajdź pomysł na podanie.";
    document.title = title;
    document.querySelector('[property="og:title"]').content = title;
    document.querySelector('[name="description"]').content = description;
    document.querySelector('[property="og:description"]').content = description;
    document.querySelectorAll("[data-language]").forEach(button => button.setAttribute("aria-pressed", String(button.dataset.language === language)));
    document.dispatchEvent(new CustomEvent("darnytskie:languagechange", { detail: { language } }));
  };
  const setLanguage = next => {
    if (!["uk", "pl"].includes(next)) return;
    language = next;
    try { localStorage.setItem("darnytskie-language", next); } catch {}
    applyLanguage();
  };
  window.DarnytskieI18n = { translate, setLanguage, getLanguage: () => language };
  document.querySelectorAll("[data-language]").forEach(button => button.addEventListener("click", () => setLanguage(button.dataset.language)));
  applyLanguage();
})();
