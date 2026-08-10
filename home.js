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

/* ---------- Weather (footer) ---------- */
const WEATHER_CITIES = [
  { key: "seoul", lat: 37.5665, lon: 126.978 },
  { key: "yangsan", lat: 35.335, lon: 129.1378 },
];
const WEATHER_CACHE_KEY = "oho-weather-cache";
const WEATHER_CACHE_TTL = 10 * 60 * 1000; // 10 minutes

function applyWeather(temps) {
  Object.entries(temps).forEach(([city, value]) => {
    document.querySelectorAll(`.temp[data-city="${city}"]`).forEach((el) => {
      el.textContent = `${value}°C`;
    });
  });
}

async function updateWeather() {
  try {
    const cached = JSON.parse(sessionStorage.getItem(WEATHER_CACHE_KEY) || "null");
    if (cached && Date.now() - cached.timestamp < WEATHER_CACHE_TTL) {
      applyWeather(cached.temps);
      return;
    }
  } catch (e) {
    /* ignore malformed cache */
  }

  const lat = WEATHER_CITIES.map((c) => c.lat).join(",");
  const lon = WEATHER_CITIES.map((c) => c.lon).join(",");
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m&timezone=Asia%2FSeoul`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Weather request failed: ${res.status}`);
    const data = await res.json();
    const list = Array.isArray(data) ? data : [data];

    const temps = {};
    WEATHER_CITIES.forEach((city, i) => {
      const value = list[i]?.current?.temperature_2m;
      if (typeof value === "number") temps[city.key] = Math.round(value);
    });

    applyWeather(temps);
    sessionStorage.setItem(
      WEATHER_CACHE_KEY,
      JSON.stringify({ temps, timestamp: Date.now() })
    );
  } catch (err) {
    console.warn("Weather update failed:", err);
  }
}

updateWeather();
