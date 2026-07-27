const grid = document.getElementById("grid");
const filterButtons = document.querySelectorAll(".filter-btn");

function renderCards() {
  grid.innerHTML = "";
  PROJECTS.forEach((project) => {
    const card = document.createElement("a");
    card.className = "card";
    card.href = `project.html?id=${project.id}`;
    card.dataset.category = project.category;

    card.innerHTML = `
      <div class="card-image-wrap ratio-${project.ratio}">
        <img class="card-image" src="${thumbUrl(project)}" alt="${project.titleEn}" loading="lazy">
      </div>
      <div class="card-info">
        <p class="card-title-kr">${project.titleKr}</p>
        <p class="card-title-en">${project.titleEn}</p>
        <p class="card-year">${project.year}</p>
        <div class="card-tags">
          <span class="card-tag">${project.category}</span>
        </div>
      </div>
    `;

    grid.appendChild(card);
  });
}

function applyFilter(category) {
  document.querySelectorAll(".card").forEach((card) => {
    const show = category === "all" || card.dataset.category === category;
    card.classList.toggle("hidden", !show);
  });
}

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    applyFilter(btn.dataset.filter);
  });
});

function assignColumnIndexes() {
  const cards = Array.from(document.querySelectorAll(".card:not(.hidden)"));
  const lefts = Array.from(new Set(cards.map((card) => Math.round(card.getBoundingClientRect().left)))).sort(
    (a, b) => a - b
  );

  cards.forEach((card) => {
    const left = Math.round(card.getBoundingClientRect().left);
    card.dataset.col = lefts.indexOf(left);
  });
}

function initRevealAnimation() {
  assignColumnIndexes();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const card = entry.target;
        const col = Number(card.dataset.col) || 0;
        card.style.transitionDelay = `${col * 100}ms`;
        card.classList.add("is-visible");
        observer.unobserve(card);
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  document.querySelectorAll(".card").forEach((card) => observer.observe(card));

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(assignColumnIndexes, 200);
  });
}

renderCards();
initRevealAnimation();
