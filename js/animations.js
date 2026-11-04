(() => {
  const revealSelectors = ".reveal, .reveal-up, .reveal-image, .product-card";
  const revealNodes = [...document.querySelectorAll(revealSelectors)];
  const heroNodes = [
    document.querySelector(".hero__eyebrow"),
    document.querySelector("#hero-title"),
    document.querySelector(".hero__bottom"),
    document.querySelector(".hero__image-wrap"),
    document.querySelector(".hero__seal"),
    document.querySelector(".hero__actions"),
    document.querySelector(".scroll-cue")
  ].filter(Boolean);
  const motionOff = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  const showAll = () => {
    if (!gsap) return;
    gsap.set([...heroNodes, ...revealNodes], { clearProps: "opacity,visibility,transform,clipPath" });
  };

  if (motionOff || !gsap) {
    showAll();
    return;
  }

  if (ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
  else showAll();
  gsap.set("#hero-title .hero__period", { opacity: 1, yPercent: 0 });
  gsap.timeline({ defaults: { ease: "power3.out" } })
    .from(".hero__eyebrow", { y: 16, opacity: 0, duration: 0.55 })
    .from("#hero-title > span", { yPercent: 110, opacity: 0, duration: 0.8, stagger: 0.11 }, "-=0.22")
    .from(".hero__bottom, .hero__actions, .scroll-cue", { y: 20, opacity: 0, duration: 0.55, stagger: 0.08 }, "-=0.35")
    .from(".hero__image-wrap", { scale: 1.08, opacity: 0, duration: 1.05 }, "-=0.85")
    .from(".hero__seal", { scale: 0.82, rotation: -12, opacity: 0, duration: 0.65 }, "-=0.78");

  if (ScrollTrigger) {
    gsap.utils.toArray(".reveal, .reveal-up").forEach(node => {
      gsap.from(node, { y: 32, opacity: 0, duration: 0.7, ease: "power2.out", scrollTrigger: { trigger: node, start: "top 88%", once: true } });
    });
    gsap.utils.toArray(".reveal-image").forEach(node => {
      const image = node.querySelector("img");
      gsap.fromTo(node, { clipPath: "inset(10% 0 10% 0)" }, { clipPath: "inset(0% 0 0% 0)", duration: 0.9, ease: "power2.out", scrollTrigger: { trigger: node, start: "top 86%", once: true } });
      if (image && !window.matchMedia("(max-width: 767px)").matches) {
        gsap.to(image, { yPercent: -4, ease: "none", scrollTrigger: { trigger: node, start: "top bottom", end: "bottom top", scrub: 0.6 } });
      }
    });
    gsap.from(".product-card", { y: 24, opacity: 0, duration: 0.55, stagger: 0.07, ease: "power2.out", scrollTrigger: { trigger: "#product-grid", start: "top 85%", once: true } });
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) gsap.globalTimeline.pause();
    else gsap.globalTimeline.resume();
  });

  const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  motionPreference.addEventListener?.("change", event => {
    if (!event.matches) return;
    ScrollTrigger?.getAll().forEach(trigger => trigger.kill());
    gsap.globalTimeline.clear();
    showAll();
  });
})();
