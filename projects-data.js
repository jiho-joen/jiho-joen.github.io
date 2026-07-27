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
  { id: 1, titleKr: "숲의 기록", titleEn: "Forest Notes", year: 2025, category: "Illustration", ratio: "portrait",
    summary: "계절이 바뀌는 숲의 순간들을 기록한 일러스트레이션 시리즈.",
    body: "사계절 동안 같은 숲을 반복해서 관찰하며 그린 드로잉을 엮었다. 빛과 공기의 미묘한 변화를 색과 질감으로 옮기는 데 초점을 두었다." },
  { id: 2, titleKr: "여름 소묘", titleEn: "Summer Sketch", year: 2025, category: "Illustration", ratio: "square",
    summary: "여름의 색과 빛을 스케치로 옮긴 개인 작업.",
    body: "짧은 여행 중 스케치북에 남긴 순간들을 다듬어 하나의 시리즈로 완성했다. 빠른 선과 제한된 팔레트로 여름 특유의 온도를 표현했다." },
  { id: 3, titleKr: "도시의 결", titleEn: "Urban Grain", year: 2024, category: "Graphic", ratio: "landscape",
    summary: "도시의 표면과 질감을 그래픽 패턴으로 재구성한 프로젝트.",
    body: "건축물의 외벽과 보도블록에서 발견한 반복 패턴을 사진으로 채집하고, 이를 벡터 그래픽 시스템으로 재해석했다." },
  { id: 4, titleKr: "낱장", titleEn: "Loose Leaf", year: 2025, category: "Editorial", ratio: "square",
    summary: "독립출판물을 위한 에디토리얼 디자인.",
    body: "낱장으로 분리·재조합이 가능한 제본 방식을 기반으로 한 실험적 출판 디자인. 그리드와 여백의 비율을 호흡 단위로 설계했다." },
  { id: 5, titleKr: "브랜드 마크", titleEn: "Brand Mark", year: 2025, category: "Identity", ratio: "square",
    summary: "소규모 브랜드를 위한 아이덴티티 디자인.",
    body: "브랜드의 태도를 하나의 마크로 압축하는 작업. 로고, 컬러 시스템, 적용 가이드를 포함한 기본 아이덴티티 세트를 구축했다." },
  { id: 6, titleKr: "정기 간행물", titleEn: "Periodical", year: 2024, category: "Editorial", ratio: "portrait",
    summary: "계간 발행되는 문화 매거진의 에디토리얼 시스템.",
    body: "매 호 다른 주제를 다루면서도 일관된 톤을 유지하도록 타이포그래피 규칙과 그리드 시스템을 설계했다." },
  { id: 7, titleKr: "제품 상세", titleEn: "Product Page", year: 2025, category: "Web", ratio: "landscape",
    summary: "제품 상세 페이지를 위한 웹 디자인 및 퍼블리싱.",
    body: "제품의 정보 구조를 재정리하고, 스크롤 흐름에 따라 핵심 메시지가 순차적으로 드러나도록 레이아웃을 구성했다." },
  { id: 8, titleKr: "색채 연구", titleEn: "Color Study", year: 2025, category: "Illustration", ratio: "portrait",
    summary: "색채 조합을 탐구하는 연작 드로잉.",
    body: "동일한 구도에 다른 색채 조합을 반복 적용하며 색이 만들어내는 분위기의 차이를 기록한 연구성 작업이다." },
  { id: 9, titleKr: "로고 시스템", titleEn: "Logo System", year: 2024, category: "Identity", ratio: "square",
    summary: "가변형 로고 시스템을 활용한 아이덴티티 프로젝트.",
    body: "고정된 심볼 대신 상황에 따라 형태가 변형되는 가변형 로고를 설계해, 다양한 매체에 유연하게 대응하도록 했다." },
  { id: 10, titleKr: "포스터", titleEn: "Poster", year: 2025, category: "Graphic", ratio: "portrait",
    summary: "전시를 위한 포스터 디자인 연작.",
    body: "전시의 주제 의식을 하나의 이미지로 압축하는 대신, 연작 형태로 여러 장의 포스터에 나누어 담았다." },
  { id: 11, titleKr: "랜딩 페이지", titleEn: "Landing Page", year: 2025, category: "Web", ratio: "landscape",
    summary: "서비스 소개를 위한 랜딩 페이지 디자인.",
    body: "서비스의 핵심 가치를 첫 화면에서 바로 전달할 수 있도록 메시지 우선순위를 재구성하고 인터랙션을 더했다." },
  { id: 12, titleKr: "잡지 표지", titleEn: "Magazine Cover", year: 2024, category: "Editorial", ratio: "square",
    summary: "매거진 표지 디자인 시리즈.",
    body: "매 호의 특집 주제를 표지 한 장으로 압축하는 작업으로, 타이포그래피와 이미지의 관계를 매번 다르게 실험했다." },
];
