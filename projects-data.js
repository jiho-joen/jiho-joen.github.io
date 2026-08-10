const RATIO_SIZE = {
  square: [800, 800],
  portrait: [800, 1067],
  landscape: [1067, 800],
};

function thumbUrl(project, scale = 1) {
  const [w, h] = RATIO_SIZE[project.ratio];
  return `https://picsum.photos/seed/oho-${project.id}/${Math.round(w * scale)}/${Math.round(h * scale)}`;
}

const PROJECTS = [
  { id: 1, titleKr: "식식", titleEn: "SikSik", year: 2024, categories: ["Identity", "Web"], ratio: "square", thumbnail: "assets/works/1_thumb.webp",
    summary: "", body: "" },
  { id: 2, titleKr: "애플북", titleEn: "AppleBook", year: 2024, categories: ["Illustration", "Editorial"], ratio: "square", thumbnail: "assets/works/2_thumb.webp",
    summary: "", body: "" },
  { id: 3, titleKr: "괴상식물상점", titleEn: "Plant Shop 'goesangsigmulsangjeom'", year: 2024, categories: ["Identity"], ratio: "square", thumbnail: "assets/works/3_thumb.webp",
    summary: "", body: "" },
  { id: 4, titleKr: "유연한 태도 가지기", titleEn: "Be flexible", year: 2025, categories: ["Lettering"], ratio: "square", thumbnail: "assets/works/4_thumb.webp",
    summary: "", body: "" },
  { id: 5, titleKr: "행복, 우연", titleEn: "Happiness, Coincidence", year: 2025, categories: ["Lettering"], ratio: "square", thumbnail: "assets/works/5_thumb.gif",
    summary: "", body: "" },
  { id: 6, titleKr: "일하는 것을 멈추지 마", titleEn: "Keep working.", year: 2026, categories: ["Lettering"], ratio: "square", thumbnail: "assets/works/6_thumb.webp",
    summary: "", body: "" },
  { id: 7, titleKr: "멸종,위기,사랑(팬아트)", titleEn: "Endangered Love(Fan Art)", year: 2026, categories: ["Lettering"], ratio: "square", thumbnail: "assets/works/7_thumb.webp",
    summary: "", body: "" },
  { id: 8, titleKr: "바지락", titleEn: "Manila clam", year: 2026, categories: ["Lettering"], ratio: "square", thumbnail: "assets/works/8_thumb.webp",
    summary: "", body: "" },
  { id: 9, titleKr: "2026 연하장, 퀘이츠 링 넣기", titleEn: "2026 New Year's Card: Including the Quates Ring", year: 2026, categories: ["Lettering"], ratio: "square", thumbnail: "assets/works/9_thumb.webp",
    summary: "", body: "" },
  { id: 10, titleKr: "물에 빠진 시소", titleEn: "A Seesaw Submerged in Water", year: 2025, categories: ["Graphic", "Lettering"], ratio: "square", thumbnail: "assets/works/10_thumb.webp",
    summary: "", body: "" },
  { id: 11, titleKr: "걱정 수리사 가만씨", titleEn: "Mr. Gaman,' the Worry Repairman", year: 2021, categories: ["Illustration", "Editorial"], ratio: "square", thumbnail: "assets/works/11_thumb.gif",
    summary: "", body: "" },
];

PROJECTS.forEach((p) => {
  p.category = p.categories.join(", ");
});
