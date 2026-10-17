(() => {
  const C = CONFIG;
  const $ = (id) => document.getElementById(id);
  const fill = (s) => s.replaceAll("{her}", C.herName).replaceAll("{him}", C.hisName);
  const arDate = (iso) =>
    new Date(iso + "T00:00:00").toLocaleDateString("ar-EG", { day: "numeric", month: "long", year: "numeric" });

  // الأسماء والعمر
  document.title = `عيد ميلاد سعيد يا ${C.herName} 🎂`;
  $("herName").textContent = C.herName;
  $("hisName").textContent = C.hisName;
  $("hisName2").textContent = C.hisName;
  $("age").textContent = C.age;
  $("metText").textContent = arDate(C.metDate);
  $("letterTitle").textContent = fill(C.letterTitle);

  // العداد
  const start = new Date(C.metDate + "T00:00:00");
  function tick() {
    let diff = Math.max(0, Date.now() - start);
    const d = Math.floor(diff / 864e5); diff %= 864e5;
    const h = Math.floor(diff / 36e5); diff %= 36e5;
    const m = Math.floor(diff / 6e4);
    const s = Math.floor((diff % 6e4) / 1e3);
    $("cDays").textContent = d.toLocaleString("ar-EG");
    $("cHours").textContent = h.toLocaleString("ar-EG");
    $("cMins").textContent = m.toLocaleString("ar-EG");
    $("cSecs").textContent = s.toLocaleString("ar-EG");
  }
  tick(); setInterval(tick, 1000);

  // المحطات
  $("timeline").innerHTML = C.timeline.map(t => `
    <li><time>${arDate(t.date)}</time><h3>${t.title}</h3><p>${t.text}</p></li>`).join("");

  // الرسالة
  $("letter").innerHTML = C.letter.map(p => `<p>${fill(p)}</p>`).join("");

  // الصور
  const gal = $("gallery");
  if (C.photos.length) {
    gal.innerHTML = C.photos.map((p, i) => `
      <figure data-i="${i}"><img src="${p.src}" alt="${p.caption || ""}" loading="lazy">
      ${p.caption ? `<figcaption>${p.caption}</figcaption>` : ""}</figure>`).join("");
  } else {
    gal.innerHTML = '<div class="placeholder">📷</div>'.repeat(4);
  }
  const lb = $("lightbox"), lbImg = lb.querySelector("img");
  gal.addEventListener("click", (e) => {
    const f = e.target.closest("figure"); if (!f) return;
    lbImg.src = C.photos[f.dataset.i].src; lb.hidden = false;
  });
  lb.addEventListener("click", () => (lb.hidden = true));

  // الفيديوهات
  if (C.videos.length) {
    $("videos").innerHTML = C.videos.map(v => `
      <div><video controls playsinline preload="metadata" src="${v.src}"></video>
      ${v.caption ? `<p>${v.caption}</p>` : ""}</div>`).join("");
  } else {
    $("videosSec").hidden = true;
  }

  // الموسيقى
  if (C.music) {
    const audio = new Audio(C.music); audio.loop = true;
    const btn = $("musicBtn");
    const play = () => audio.play().then(() => btn.classList.add("on")).catch(() => {});
    audio.addEventListener("canplay", () => { btn.hidden = false; }, { once: true });
    btn.onclick = (e) => {
      e.stopPropagation();
      if (audio.paused) play();
      else { audio.pause(); btn.classList.remove("on"); }
    };
    // أول لمسة في الصفحة تشغّل الأغنية (المتصفحات بتمنع التشغيل التلقائي)
    const first = () => { if (audio.paused) play(); };
    addEventListener("pointerdown", first, { once: true });
  }

  // ظهور تدريجي أثناء السكرول
  const io = new IntersectionObserver((es) => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("show"); io.unobserve(e.target); }
  }), { threshold: 0.15 });
  document.querySelectorAll(".reveal, .letter p").forEach(el => io.observe(el));

  // قلوب طايرة
  const hearts = $("hearts"), icons = ["❤️", "💖", "💕", "🌸", "✨", "🤍"];
  setInterval(() => {
    const h = document.createElement("span");
    h.className = "heart";
    h.textContent = icons[Math.floor(Math.random() * icons.length)];
    h.style.left = Math.random() * 100 + "vw";
    h.style.fontSize = 14 + Math.random() * 22 + "px";
    h.style.animationDuration = 6 + Math.random() * 6 + "s";
    hearts.appendChild(h);
    setTimeout(() => h.remove(), 12500);
  }, 700);

  // المفاجأة + كونفيتي
  const cv = $("confetti"), ctx = cv.getContext("2d");
  let pieces = [];
  function resize() { cv.width = innerWidth; cv.height = innerHeight; }
  resize(); addEventListener("resize", resize);
  function burst() {
    const colors = ["#ff7eb6", "#ffd9a0", "#fff", "#c77dff", "#7ee0ff"];
    for (let i = 0; i < 180; i++) pieces.push({
      x: innerWidth / 2, y: innerHeight / 2,
      vx: (Math.random() - .5) * 16, vy: Math.random() * -14 - 3,
      s: 5 + Math.random() * 7, c: colors[i % colors.length], r: Math.random() * 6
    });
    if (pieces.length === 180) loop();
  }
  function loop() {
    ctx.clearRect(0, 0, cv.width, cv.height);
    pieces.forEach(p => {
      p.vy += .35; p.x += p.vx; p.y += p.vy; p.r += .2;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r);
      ctx.fillStyle = p.c; ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * .6); ctx.restore();
    });
    pieces = pieces.filter(p => p.y < cv.height + 20);
    if (pieces.length) requestAnimationFrame(loop); else ctx.clearRect(0, 0, cv.width, cv.height);
  }
  $("surprise").onclick = () => {
    burst();
    $("surpriseMsg").textContent = `كل سنة وانتي طيبة يا ${C.herName}… بحبك ${C.age} مرة وأكتر 💖`;
  };
})();
