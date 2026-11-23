function mountProjectBook(viewer, book, fallback) {
  const canvas = viewer.querySelector("canvas");
  const context = canvas.getContext("2d");
  if (!context) return;

  const previous = viewer.querySelector("[data-book-prev]");
  const next = viewer.querySelector("[data-book-next]");
  const jump = viewer.querySelector("[data-book-jump]");
  const pageInput = viewer.querySelector("[data-book-page]");
  const go = jump.querySelector("button");
  const position = viewer.querySelector("[role=status]");
  pageInput.max = book.count;
  viewer.querySelector("[data-book-total]").textContent = `/ ${book.count}`;
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  const images = new Map();
  const loading = new Map();
  const cssPixelsPerMm = 96 / 25.4;
  const ratio = book.widthMm / book.heightMm;
  const inset = 8;
  let page = 1;
  let single = false;
  let width = 0;
  let height = 0;
  let pageWidth = 0;
  let pageHeight = 0;
  let devicePixelRatio = 0;
  let pending = false;
  let drag;
  let turn;
  let frame;
  let generation = 0;

  function load(number) {
    if (!number) return Promise.resolve();
    if (images.has(number)) {
      const image = images.get(number);
      images.delete(number);
      images.set(number, image);
      return Promise.resolve();
    }
    if (loading.has(number)) return loading.get(number);
    const image = new Image();
    image.src = `${book.folder}/${String(number).padStart(2, "0")}.webp`;
    const promise = image.decode().then(() => {
      images.set(number, image);
      if (images.size > 10) images.delete(images.keys().next().value);
    }).finally(() => loading.delete(number));
    loading.set(number, promise);
    return promise;
  }

  function spread(number) {
    if (single) return [number];
    if (number === 1) return [0, 1];
    const left = number - number % 2;
    return [left, left < book.count ? left + 1 : 0];
  }

  function destination(number, direction) {
    if (single) return number + direction;
    const left = spread(number)[0];
    if (direction > 0) return left + 2;
    return left === 2 ? 1 : left - 2;
  }

  function valid(number) {
    return Number.isInteger(number) && number >= 1 && number <= book.count;
  }

  function prepare(number) {
    return Promise.all(spread(number).map(load));
  }

  function prefetch() {
    for (const direction of [-1, 1]) {
      const neighbor = destination(page, direction);
      if (valid(neighbor)) prepare(neighbor).catch(() => {});
    }
  }

  function syncControls(message) {
    const busy = pending || Boolean(turn);
    previous.setAttribute("aria-disabled", String(busy || !valid(destination(page, -1))));
    next.setAttribute("aria-disabled", String(busy || !valid(destination(page, 1))));
    pageInput.readOnly = busy;
    go.disabled = busy;
    if (!busy) pageInput.value = page;
    position.textContent = message || "";
  }

  function spine(number) {
    if (single) return (width - pageWidth) / 2;
    if (number === 1) return (width - pageWidth) / 2;
    if (!spread(number)[1]) return (width + pageWidth) / 2;
    return width / 2;
  }

  function drawPage(number, x) {
    const image = images.get(number);
    if (!image) return;
    context.drawImage(image, x, inset, pageWidth, pageHeight);
  }

  function drawSpread(number) {
    const center = spine(number);
    const [left, right] = spread(number);
    if (single) {
      drawPage(left, center);
    } else {
      drawPage(left, center - pageWidth);
      drawPage(right, center);
    }
  }

  function drawCurl(axis, side, progress, front, reverse) {
    const strips = Math.ceil(pageWidth / 5);
    const curl = Math.sin(progress * Math.PI) * 0.75;
    const angle = Math.PI * progress;

    // Project a bent sheet as narrow textured strips, then paint the closest strips last.
    function project(u) {
      const localAngle = angle + curl * (u - 0.5);
      const offset = curl > 0.0001
        ? (Math.sin(localAngle) - Math.sin(angle - curl / 2)) / curl
        : u * Math.cos(angle);
      const depth = curl > 0.0001
        ? (Math.cos(angle - curl / 2) - Math.cos(localAngle)) / curl
        : u * Math.sin(angle);
      const vertical = depth * Math.min(13, pageWidth * 0.035);
      return { x: axis + side * pageWidth * offset, y: inset - vertical, depth, localAngle };
    }

    const segments = [];
    let start = project(0);
    for (let i = 0; i < strips; i += 1) {
      const end = project((i + 1) / strips);
      segments.push({ start, end, i, depth: (start.depth + end.depth) / 2 });
      start = end;
    }

    const shadowWidth = pageWidth * (0.12 + 0.4 * Math.sin(angle));
    const shadow = context.createLinearGradient(axis, 0, axis + side * shadowWidth, 0);
    shadow.addColorStop(0, `rgba(19, 31, 38, ${0.26 * Math.sin(angle)})`);
    shadow.addColorStop(1, "rgba(19, 31, 38, 0)");
    context.fillStyle = shadow;
    context.fillRect(side > 0 ? axis : axis - shadowWidth, inset, shadowWidth, pageHeight);

    segments.sort((a, b) => a.depth - b.depth);
    for (const { start: from, end: to, i } of segments) {
      const dx = to.x - from.x;
      if (Math.abs(dx) < 0.05) continue;
      const facing = Math.cos((from.localAngle + to.localAngle) / 2);
      const isFront = facing >= 0;
      const image = images.get(isFront ? front : reverse);
      const stripIndex = (isFront ? side : -side) > 0 ? i : strips - 1 - i;
      const y = from.y;
      const stripHeight = pageHeight + 2 * (inset - (from.y + to.y) / 2);
      const bleed = Math.sign(dx) * 0.7;

      context.save();
      context.transform(dx + bleed, to.y - y, 0, stripHeight, from.x, y);
      if (image) {
        const sourceWidth = image.naturalWidth / strips;
        if (dx < 0) {
          context.translate(1, 0);
          context.scale(-1, 1);
        }
        context.drawImage(image, stripIndex * sourceWidth, 0, sourceWidth, image.naturalHeight, 0, 0, 1, 1);
      } else {
        context.fillStyle = "#fafafa";
        context.fillRect(0, 0, 1, 1);
      }
      context.fillStyle = `rgba(21, 29, 38, ${0.24 * (1 - Math.abs(facing))})`;
      context.fillRect(0, 0, 1, 1);
      context.restore();
    }
  }

  function render() {
    context.clearRect(0, 0, width, height);
    if (!turn || turn.progress <= 0) {
      drawSpread(page);
      return;
    }
    const { target, direction, progress } = turn;
    if (single) {
      drawSpread(target);
      const axis = spine(page) + (direction < 0 ? pageWidth : 0);
      drawCurl(axis, direction, progress, page, 0);
      return;
    }
    const oldPages = spread(page);
    const newPages = spread(target);
    const axis = spine(page) + (spine(target) - spine(page)) * progress;
    const turningIndex = direction > 0 ? 1 : 0;
    const stillIndex = 1 - turningIndex;
    const left = direction > 0 ? oldPages[0] : newPages[0];
    const right = direction > 0 ? newPages[1] : oldPages[1];
    drawPage(left, axis - pageWidth);
    drawPage(right, axis);
    drawCurl(axis, direction, progress, oldPages[turningIndex], newPages[stillIndex]);
  }

  function resize() {
    cancelAnimationFrame(frame);
    generation += 1;
    pending = false;
    turn = undefined;
    drag = undefined;
    width = viewer.clientWidth;
    if (!width) return;
    single = width < 632;
    const availableWidth = Math.max(1, width - inset * 2);
    pageWidth = Math.min(availableWidth / (single ? 1 : 2), book.widthMm * cssPixelsPerMm);
    pageHeight = pageWidth / ratio;
    height = pageHeight + inset * 2;
    devicePixelRatio = window.devicePixelRatio || 1;
    const pixelRatio = Math.min(devicePixelRatio, book.widthMm * book.pixelsPerMm / pageWidth);
    canvas.style.height = `${height}px`;
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    context.setTransform(canvas.width / width, 0, 0, canvas.height / height, 0, 0);
    context.imageSmoothingQuality = "high";
    const ticket = generation;
    render();
    prepare(page).then(() => {
      if (ticket === generation) render();
    }).catch(() => {
      if (ticket === generation) syncControls("페이지 로딩 실패");
    });
    syncControls();
    prefetch();
  }

  function finish(complete) {
    if (complete) page = turn.target;
    turn = undefined;
    render();
    syncControls();
    prefetch();
  }

  function animate(complete) {
    if (motion.matches) {
      finish(complete);
      return;
    }
    const start = turn.progress;
    const end = complete ? 1 : 0;
    const duration = Math.max(150, 690 * Math.abs(end - start));
    const started = performance.now();

    function tick(now) {
      const time = Math.min(1, (now - started) / duration);
      const ease = 0.5 - 0.5 * Math.cos(Math.PI * time);
      turn.progress = start + (end - start) * ease;
      if (time < 1) {
        render();
        frame = requestAnimationFrame(tick);
      } else {
        finish(complete);
      }
    }
    frame = requestAnimationFrame(tick);
  }

  async function reveal(target, direction) {
    if (turn || pending || drag || !valid(target)) return;
    if (spread(target)[0] === spread(page)[0] && spread(target)[1] === spread(page)[1]) {
      page = target;
      syncControls();
      return;
    }
    const ticket = generation;
    pending = true;
    syncControls();
    try {
      await prepare(target);
    } catch {
      if (ticket !== generation) return;
      pending = false;
      syncControls("페이지 로딩 실패");
      return;
    }
    if (ticket !== generation) return;
    pending = false;
    if (!direction) {
      page = target;
      render();
      syncControls();
      prefetch();
      return;
    }
    turn = { target, direction, progress: 0 };
    syncControls();
    animate(true);
  }

  function step(direction) {
    reveal(destination(page, direction), direction);
  }

  pageInput.addEventListener("focus", () => pageInput.select());
  jump.addEventListener("submit", (event) => {
    event.preventDefault();
    const target = pageInput.valueAsNumber;
    const direction = [-1, 1].find((stepDirection) => {
      const neighbor = destination(page, stepDirection);
      return valid(neighbor) && spread(neighbor).includes(target);
    });
    reveal(target, direction);
  });

  canvas.addEventListener("pointerdown", (event) => {
    if (!event.isPrimary || event.button !== 0 || pending || turn) return;
    const x = event.offsetX;
    const center = spine(page);
    const left = single || page === 1 ? center : center - pageWidth;
    const right = single || spread(page)[1] ? center + pageWidth : center;
    if (x < left || x > right) return;
    const direction = x >= (single ? (left + right) / 2 : center) ? 1 : -1;
    if (!(single && event.pointerType === "touch") && !valid(destination(page, direction))) return;
    drag = { id: event.pointerId, direction, start: event.clientX, y: event.clientY };
    canvas.setPointerCapture(event.pointerId);
  });

  canvas.addEventListener("pointermove", (event) => {
    if (!drag || drag.id !== event.pointerId) return;
    const delta = drag.start - event.clientX;
    if (Math.abs(delta) < 7 && !turn) return;
    if (!turn) {
      const direction = single && event.pointerType === "touch" ? Math.sign(delta) : drag.direction;
      const target = destination(page, direction);
      if (!valid(target)) return;
      if (motion.matches || !spread(target).every((number) => !number || images.has(number))) {
        drag.direction = direction;
        return;
      }
      turn = { target, direction, progress: 0 };
      syncControls();
    }
    turn.progress = Math.max(0, Math.min(0.96, delta * turn.direction / (pageWidth * 0.85)));
    render();
  });

  function endDrag(event, canceled) {
    if (!drag || drag.id !== event.pointerId) return;
    const distance = drag.start - event.clientX;
    const tap = Math.abs(distance) < 7 && Math.abs(drag.y - event.clientY) < 7;
    const direction = drag.direction;
    drag = undefined;
    if (turn) {
      animate(!canceled && (tap || turn.progress >= 0.25));
    } else if (!canceled && (tap || distance * direction >= pageWidth * 0.25)) {
      step(direction);
    }
  }

  canvas.addEventListener("pointerup", (event) => endDrag(event, false));
  canvas.addEventListener("pointercancel", (event) => endDrag(event, true));
  canvas.addEventListener("lostpointercapture", (event) => endDrag(event, true));
  previous.addEventListener("click", () => step(-1));
  next.addEventListener("click", () => step(1));
  viewer.addEventListener("keydown", (event) => {
    if (jump.contains(event.target) || (event.key !== "ArrowLeft" && event.key !== "ArrowRight")) return;
    event.preventDefault();
    step(event.key === "ArrowRight" ? 1 : -1);
  });

  load(1).then(() => {
    viewer.hidden = false;
    fallback.hidden = true;
    resize();
    const observer = new ResizeObserver(() => {
      if (viewer.clientWidth !== width) resize();
    });
    observer.observe(viewer);
    window.addEventListener("resize", () => {
      if ((window.devicePixelRatio || 1) !== devicePixelRatio) resize();
    });
  }).catch(() => {
    // Keep the existing project image available if the cover cannot be decoded.
  });
}
