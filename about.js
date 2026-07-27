function attachRotateHover(container, imgSelector, maxAngle) {
  if (!container) return;
  const shape = container.querySelector(imgSelector);
  if (!shape) return;

  container.addEventListener("mousemove", (e) => {
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const angle = (x / (rect.width / 2)) * maxAngle;
    shape.style.transform = `scale(1.03) rotate(${angle}deg)`;
  });

  container.addEventListener("mouseleave", () => {
    shape.style.transform = "";
  });
}

attachRotateHover(document.querySelector(".works-side"), ".works-visual", 8);
attachRotateHover(document.querySelector(".about-side"), ".about-visual", 8);

requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    document.querySelector(".about-text")?.classList.add("is-visible");
    document.getElementById("about-visuals")?.classList.add("settled");
  });
});

const mobilePanel = document.getElementById("about-mobile");
const closeBtn = document.getElementById("close-btn");

if (mobilePanel) {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      mobilePanel.classList.add("panel-open");
    });
  });
}

if (closeBtn) {
  closeBtn.addEventListener("click", () => {
    mobilePanel.classList.remove("panel-open");
    setTimeout(() => {
      window.location.href = "index.html";
    }, 500);
  });
}
