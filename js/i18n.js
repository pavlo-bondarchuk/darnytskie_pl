(() => {
  const originals = new WeakMap();
  const siteRoot = new URL("../", document.currentScript.src);
  const pageLanguage = () => location.pathname === new URL("pl/", siteRoot).pathname || location.pathname.endsWith("/pl/index.html") ? "pl" : "uk";
  let language = pageLanguage();
  let fixedResources = false;
  const updatePath = method => {
    const next = new URL(language === "pl" ? "pl/" : "./", siteRoot);
    next.search = location.search;
    next.hash = location.hash;
    if (next.pathname === location.pathname) return;
    if (!fixedResources) {
      for (const node of document.querySelectorAll("img[src], link[href]")) {
        const attribute = node.tagName === "IMG" ? "src" : "href";
        node.setAttribute(attribute, node[attribute]);
        if (node.srcset) {
          node.srcset = node.srcset.split(",").map(candidate => {
            const [path, width] = candidate.trim().split(/\s+/);
            return new URL(path, location.href).href + " " + width;
          }).join(", ");
        }
      }
      fixedResources = true;
    }
    history[method](history.state, "", next);
  };
  try {
    if (language === "uk" && localStorage.getItem("darnytskie-language") === "pl") {
      language = "pl";
      updatePath("replaceState");
    }
  } catch {}

  const translate = (root = document) => {
    for (const node of root.querySelectorAll("[data-pl], [data-pl-alt], [data-pl-aria]")) {
      const attribute = node.hasAttribute("data-pl-aria") ? "aria-label" : node.hasAttribute("data-pl-alt") ? "alt" : null;
      if (!originals.has(node)) {
        const original = attribute === "aria-label" ? node.dataset.ukAria : attribute === "alt" ? node.dataset.ukAlt : node.dataset.uk;
        originals.set(node, original ?? (attribute ? node.getAttribute(attribute) : node.textContent));
      }
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
    const description = language === "uk" ? "Ковбаси, сосиски й закуски «Дарницькі вироби». Перегляньте продукти й адреси магазинів у Лодзі та Сосновці." : "Kiełbasy, parówki i przekąski Darnytskie. Zobacz produkty i znajdź adresy sklepów w Łodzi i Sosnowcu.";
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
    updatePath("pushState");
    applyLanguage();
  };
  window.addEventListener("popstate", () => {
    language = pageLanguage();
    applyLanguage();
  });
  window.DarnytskieI18n = { siteRoot, translate, setLanguage, getLanguage: () => language };
  document.querySelectorAll("[data-language]").forEach(button => button.addEventListener("click", () => setLanguage(button.dataset.language)));
  applyLanguage();
})();
