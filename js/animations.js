(() => {
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  const heroEyebrow = document.querySelector(".hero__eyebrow");
  const heroTitleLines = [...document.querySelectorAll("#hero-title > span")];
  const heroDetails = [
    document.querySelector(".hero__bottom"),
    document.querySelector(".hero__actions"),
    document.querySelector(".scroll-cue")
  ].filter(Boolean);
  const heroSeal = document.querySelector(".hero__seal");
  const revealNodes = gsap ? gsap.utils.toArray(".reveal, .reveal-up") : [];
  const imageNodes = gsap ? gsap.utils.toArray(".reveal-image") : [];
  // products.js is deferred before this file, so these cards already exist.
  const productCards = gsap ? gsap.utils.toArray("#product-grid .product-card") : [];

  if (!gsap || !ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  const cardEntrances = new Set();
  const finishCardEntrances = () => {
    cardEntrances.forEach(tween => {
      tween.progress(1);
      tween.scrollTrigger?.kill(false);
      tween.kill();
    });
    cardEntrances.clear();
  };
  document.addEventListener("darnytskie:productexpand", finishCardEntrances);

  let heroIntroStarted = false;
  const isVisibleNow = node => {
    const bounds = node.getBoundingClientRect();
    return bounds.bottom > 0 && bounds.top < window.innerHeight;
  };
  const mm = gsap.matchMedia();
  mm.add({ reduce: "(prefers-reduced-motion: reduce)", motion: "(prefers-reduced-motion: no-preference)" }, context => {
    if (context.conditions.reduce) return;

    if (!heroIntroStarted) {
      heroIntroStarted = true;
      if (window.scrollY < window.innerHeight) {
        const heroTimeline = gsap.timeline({ defaults: { ease: "power3.out" } });
        if (heroEyebrow) heroTimeline.from(heroEyebrow, { y: 12, opacity: 0, duration: 0.8, clearProps: "transform,opacity" });
        if (heroTitleLines.length) heroTimeline.from(heroTitleLines, { yPercent: 35, opacity: 0, duration: 0.9, stagger: 0.08, clearProps: "transform,opacity" }, "-=0.55");
        if (heroDetails.length) heroTimeline.from(heroDetails, { y: 12, opacity: 0, duration: 0.8, stagger: 0.06, clearProps: "transform,opacity" }, "-=0.55");

        if (heroSeal) {
          gsap.from(heroSeal, {
            scale: 0.94,
            rotation: 8,
            opacity: 0,
            duration: 0.85,
            ease: "power3.out",
            clearProps: "transform,opacity"
          });
        }
      }
    }

    revealNodes.forEach(node => {
      if (isVisibleNow(node)) return;
      gsap.from(node, {
        y: 12,
        opacity: 0,
        duration: 0.75,
        ease: "power2.out",
        clearProps: "transform,opacity",
        scrollTrigger: { trigger: node, start: "top 88%", once: true }
      });
    });

    imageNodes.forEach(node => {
      if (isVisibleNow(node)) return;
      gsap.fromTo(node,
        { clipPath: "inset(6% 0 6% 0)" },
        {
          clipPath: "inset(0% 0 0% 0)",
          duration: 0.85,
          ease: "power2.out",
          clearProps: "clipPath",
          scrollTrigger: { trigger: node, start: "top 86%", once: true }
        }
      );
    });
  });
  const cardMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const revealCards = () => {
    if (cardMotion.matches) return;
    productCards.forEach((card, index) => {
      if (isVisibleNow(card) || card.closest(".product-grid")?.classList.contains("is-expanded")) return;
      const entrance = gsap.from(card, {
        opacity: 0,
        duration: 0.75,
        delay: (index % 4) * 0.07,
        ease: "power2.out",
        clearProps: "opacity",
        scrollTrigger: { trigger: card, start: "top 90%", once: true }
      });
      cardEntrances.add(entrance);
    });
  };
  cardMotion.addEventListener?.("change", event => {
    finishCardEntrances();
    if (!event.matches) revealCards();
  });
  revealCards();
})();
