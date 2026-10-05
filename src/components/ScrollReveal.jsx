import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollReveal() {
  const { pathname } = useLocation();

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches || !window.IntersectionObserver) return;

    const candidates = document.querySelectorAll(
      ".tc-body .content-blocks > *, .tc-body .intro-text, .tc-body .md-item, .tc-body .artwork-figure"
    );
    // Reveal a gallery or column group together, rather than animating its children.
    const elements = [...candidates].filter((element) =>
      !element.parentElement.closest(".content-column-list, .content-callout, .content-toggle") &&
      element.tagName !== "HR"
    );
    const reveal = (element) => {
      element.classList.remove("scroll-reveal--pending");
      element.classList.add("scroll-reveal--visible");
      observer.unobserve(element);
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) reveal(entry.target);
      });
    }, { threshold: 0, rootMargin: "0px 0px -24px 0px" });

    elements.forEach((element) => {
      if (element.getBoundingClientRect().top >= window.innerHeight) {
        element.classList.add("scroll-reveal--pending");
        observer.observe(element);
      }
    });
    const onFocus = (event) => {
      const pending = event.target.closest(".scroll-reveal--pending");
      if (pending) reveal(pending);
    };
    const clear = () => {
      observer.disconnect();
      elements.forEach((element) => element.classList.remove(
        "scroll-reveal--pending", "scroll-reveal--visible"
      ));
    };
    const onMotionChange = () => { if (motion.matches) clear(); };
    document.addEventListener("focusin", onFocus);
    motion.addEventListener("change", onMotionChange);
    return () => {
      clear();
      document.removeEventListener("focusin", onFocus);
      motion.removeEventListener("change", onMotionChange);
    };
  }, [pathname]);

  return null;
}
