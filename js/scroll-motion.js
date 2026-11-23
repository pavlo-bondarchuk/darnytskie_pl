(() => {
  const root = document.documentElement;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const hero = document.querySelector(".hero");
  const ribbonControl = document.querySelector(".ribbon-pause");
  const tracks = [...document.querySelectorAll(".ribbon-track")];
  const scenes = [];
  let frame = 0;
  let ready = !root.classList.contains("intro-pending");
  let ribbonOffset = 0;
  let lastScroll = window.scrollY;

  const clamp = value => Math.max(0, Math.min(1, value));
  const rise = [{ opacity: 0, transform: "translateY(1.5rem)" }, { opacity: 1, transform: "translateY(0)" }];
  const unveil = [{ clipPath: "inset(0 -4% -12% 104%)", opacity: 0 }, { clipPath: "inset(0 -4% -12% -4%)", opacity: 1 }];
  const groups = [
    [".hero", [
      [".hero-image", [{ transform: "translateX(50%)" }, { transform: "translateX(0)" }]],
      ["#hero-title > span", [{ transform: "translateY(.35em)" }, { transform: "translateY(0)" }]],
      ["#hero-title > em", [{ opacity: .85, transform: "translateX(.14em)" }, { opacity: 1, transform: "translateX(0)" }], .12]
    ]],
    [".catalog .section-intro", [[".eyebrow", rise], ["h2", unveil, .12]]],
    ["#serving-title", [["span", rise], ["em", unveil, .16]]],
    [".availability", [
      [".eyebrow", rise], ["h2", unveil, .08],
      [".locator-mark img", [{ transform: "translateX(calc(100% + var(--mark-gap)))" }, { transform: "translateX(0)" }], .12],
      [".store-addresses li:first-child, #store-locator", rise, .12],
      [".store-addresses li + li", rise, .24]
    ]]
  ];

  const render = () => {
    frame = 0;
    if (!scenes.length) return;
    const y = Math.max(0, window.scrollY);
    const height = window.innerHeight;
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - height);
    for (const { section, effects } of scenes) {
      const bounds = section.getBoundingClientRect();
      const top = bounds.top + y;
      const end = Math.min(maxScroll, top - height * .64);
      const start = Math.max(0, Math.min(top - height * .96, end - 1));
      const progress = section === hero ? clamp(y / Math.max(1, bounds.height * .65))
        : end <= 0 ? 1 : clamp((y - start) / (end - start));
      for (const effect of effects) {
        const time = progress * 1000;
        if (effect.currentTime !== time) effect.currentTime = time;
      }
    }
    root.style.setProperty("--header-progress", clamp((y - 32) / 72));
    root.style.setProperty("--top-progress", clamp((y - height) / 72));
    if (!ribbonControl.checked) ribbonOffset += (y - lastScroll) * .6;
    lastScroll = y;
    tracks.forEach((track, i) => {
      const width = track.firstElementChild.offsetWidth;
      if (!width) return;
      const shift = ((ribbonOffset % width) + width) % width;
      track.style.transform = 'translateX(' + (i ? shift - width : -shift) + 'px)';
    });
  };
  const schedule = () => {
    if (scenes.length && !frame) frame = requestAnimationFrame(render);
  };
  const configure = () => {
    for (const scene of scenes) scene.effects.forEach(effect => effect.cancel());
    scenes.length = 0;
    root.classList.remove("scroll-motion");
    tracks.forEach(track => track.style.removeProperty("transform"));
    if (!ready || reduced.matches || !Element.prototype.animate) return;
    for (const [selector, layers] of groups) {
      const section = document.querySelector(selector);
      const effects = [];
      for (const [target, keyframes, delay = 0] of layers) {
        for (const element of section.querySelectorAll(target)) {
          const effect = element.animate(keyframes, {
            duration: 760, delay: 1000 * delay,
            easing: "cubic-bezier(.2,.7,.3,1)", fill: "both"
          });
          effect.pause();
          effects.push(effect);
        }
      }
      scenes.push({ section, effects });
    }
    root.classList.add("scroll-motion");
    lastScroll = 0;
    ribbonOffset = 0;
    render();
  };
  document.addEventListener("darnytskie:ready", () => { ready = true; configure(); }, { once: true });
  reduced.addEventListener("change", configure);
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  window.addEventListener("pageshow", schedule);
  document.addEventListener("darnytskie:languagechange", schedule);
  if ("ResizeObserver" in window) new ResizeObserver(schedule).observe(document.body);
  configure();
})();
