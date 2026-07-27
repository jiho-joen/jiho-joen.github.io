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
projectImage.src = thumbUrl(project);
projectImage.alt = project.titleEn;

const prevProject = PROJECTS[(index - 1 + PROJECTS.length) % PROJECTS.length];
const nextProject = PROJECTS[(index + 1) % PROJECTS.length];

const prevBtn = document.getElementById("pager-prev");
const nextBtn = document.getElementById("pager-next");

prevBtn.href = `project.html?id=${prevProject.id}`;
prevBtn.textContent = `← ${prevProject.titleEn}`;

nextBtn.href = `project.html?id=${nextProject.id}`;
nextBtn.textContent = `${nextProject.titleEn} →`;
