const params = new URLSearchParams(window.location.search);
const currentId = Number(params.get("id")) || PROJECTS[0].id;
const index = PROJECTS.findIndex((p) => p.id === currentId);
const project = PROJECTS[index] || PROJECTS[0];

document.getElementById("project-title-kr").textContent = project.titleKr;
document.getElementById("project-title-en").textContent = project.titleEn;
document.getElementById("project-category").textContent = project.category;
document.getElementById("project-year").textContent = project.year;
document.getElementById("project-summary").textContent = project.summary;
document.getElementById("project-desc").textContent = project.body;
document.getElementById("project-image-wrap").className =
  `project-image-wrap ratio-${project.ratio}`;

const projectImage = document.getElementById("project-image");
projectImage.src = project.thumbnail || thumbUrl(project);
projectImage.alt = project.titleEn;

const prevProject = PROJECTS[(index - 1 + PROJECTS.length) % PROJECTS.length];
const nextProject = PROJECTS[(index + 1) % PROJECTS.length];

const prevBtn = document.getElementById("pager-prev");
const nextBtn = document.getElementById("pager-next");

prevBtn.href = `project.html?id=${prevProject.id}`;
prevBtn.setAttribute("aria-label", `Previous: ${prevProject.titleEn}`);

nextBtn.href = `project.html?id=${nextProject.id}`;
nextBtn.setAttribute("aria-label", `Next: ${nextProject.titleEn}`);

const mobilePager = window.matchMedia("(max-width: 767px)");

function renderPagerLabels() {
  prevBtn.replaceChildren();
  nextBtn.replaceChildren();

  const prevArrow = document.createElement("span");
  prevArrow.className = "pager-arrow";
  prevArrow.setAttribute("aria-hidden", "true");
  prevArrow.textContent = "←";

  const nextArrow = document.createElement("span");
  nextArrow.className = "pager-arrow";
  nextArrow.setAttribute("aria-hidden", "true");
  nextArrow.textContent = "→";

  prevBtn.appendChild(prevArrow);

  if (!mobilePager.matches) {
    const prevTitle = document.createElement("span");
    prevTitle.className = "pager-title";
    prevTitle.textContent = prevProject.titleEn;
    prevBtn.appendChild(prevTitle);

    const nextTitle = document.createElement("span");
    nextTitle.className = "pager-title";
    nextTitle.textContent = nextProject.titleEn;
    nextBtn.appendChild(nextTitle);
  }

  nextBtn.appendChild(nextArrow);
}

renderPagerLabels();
mobilePager.addEventListener("change", renderPagerLabels);

if (project.book) {
  const viewer = document.createElement("script");
  viewer.src = "project-book.js?v=20261124-1";
  viewer.onload = () => mountProjectBook(
    document.getElementById("project-book"),
    project.book,
    document.getElementById("project-image-wrap")
  );
  document.head.append(viewer);
}
