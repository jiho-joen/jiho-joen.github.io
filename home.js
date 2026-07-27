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
