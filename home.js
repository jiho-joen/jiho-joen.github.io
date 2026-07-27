function attachRotateHover(areaSelector, shapeSelector, maxAngle) {
  const area = document.querySelector(areaSelector);
  const shape = area.querySelector(shapeSelector);

  area.addEventListener("mousemove", (e) => {
    const rect = area.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const angle = (x / (rect.width / 2)) * maxAngle;
    shape.style.transform = `scale(1.03) rotate(${angle}deg)`;
  });

  area.addEventListener("mouseleave", () => {
    shape.style.transform = "";
  });
}

attachRotateHover(".left-area", ".works-visual", 8);
attachRotateHover(".right-area", ".about-visual", 8);

function isMobile() {
  return window.matchMedia("(max-width: 767px)").matches;
}

document.querySelectorAll(".left-area, .right-area").forEach((el) => {
  el.addEventListener("animationend", (e) => {
    if (e.animationName === "floatInSettle") {
      el.classList.add("is-settled");
    }
  });
});

function attachShakeNavigate(link) {
  if (!link) return;

  link.addEventListener("click", (e) => {
    if (!isMobile()) return;
    e.preventDefault();

    const href = link.getAttribute("href");
    link.classList.add("is-shaking");

    setTimeout(() => {
      window.location.href = href;
    }, 350);
  });
}

attachShakeNavigate(document.querySelector(".left-area"));
attachShakeNavigate(document.querySelector(".right-area"));
