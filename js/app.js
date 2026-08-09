
(() => {
  'use strict';
  const $ = s => document.querySelector(s), $$ = s => Array.from(document.querySelectorAll(s));
  const scenes = $$('.scene');

  function showScene(id) {
    scenes.forEach(s => s.classList.toggle('active', s.id === id));
    if (id === 'scene-2') { startMusic(); fireworks(6); }
    if (id === 'scene-5') setTimeout(startNameAnimation, 450);
    if (id === 'scene-6') setTimeout(() => { fireworks(10); confetti(100) }, 300);
  }
  document.addEventListener('click', e => {
    const b = e.target.closest('.next-btn');
    if (!b) return;
    const id = b.dataset.target;
    if (id && document.getElementById(id)) showScene(id);
  });

  const bg = $('#bgCanvas'), bctx = bg.getContext('2d'), fx = $('#fxCanvas'), fctx = fx.getContext('2d');
  let motes = [], particles = [];
  function resize() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    [[bg, bctx], [fx, fctx]].forEach(([c, ctx]) => { c.width = innerWidth * dpr; c.height = innerHeight * dpr; c.style.width = innerWidth + 'px'; c.style.height = innerHeight + 'px'; ctx.setTransform(dpr, 0, 0, dpr, 0, 0) });
    motes = Array.from({ length: Math.min(150, Math.max(70, Math.floor(innerWidth * innerHeight / 9000))) }, () => ({ x: Math.random() * innerWidth, y: Math.random() * innerHeight, r: .4 + Math.random() * 1.6, a: .08 + Math.random() * .45, p: Math.random() * 6.28, v: .05 + Math.random() * .14 }));
  }
  addEventListener('resize', resize); resize();
  function drawBg(t) {
    const g = bctx.createRadialGradient(innerWidth * .5, innerHeight * .42, 20, innerWidth * .5, innerHeight * .5, Math.max(innerWidth, innerHeight) * .8);
    g.addColorStop(0, '#17140f'); g.addColorStop(.45, '#0e0d0b'); g.addColorStop(1, '#050505'); bctx.fillStyle = g; bctx.fillRect(0, 0, innerWidth, innerHeight);
    motes.forEach(m => { m.y -= m.v; if (m.y < -10) { m.y = innerHeight + 10; m.x = Math.random() * innerWidth } const a = Math.max(.02, m.a + Math.sin(t * .0015 + m.p) * .08); bctx.beginPath(); bctx.fillStyle = `rgba(234,205,145,${a})`; bctx.arc(m.x, m.y, m.r, 0, Math.PI * 2); bctx.fill() });
    requestAnimationFrame(drawBg);
  }
  requestAnimationFrame(drawBg);

  function confetti(n = 80) { for (let i = 0; i < n; i++)particles.push({ type: 'c', x: innerWidth / 2, y: innerHeight * .42, vx: (Math.random() - .5) * 12, vy: (Math.random() - 1.4) * 10, g: .18, life: 1, r: 2 + Math.random() * 3 }) }
  function fireworks(n = 6) { for (let k = 0; k < n; k++)setTimeout(() => { const x = innerWidth * (.15 + Math.random() * .7), y = innerHeight * (.12 + Math.random() * .45); for (let i = 0; i < 44; i++) { const a = Math.PI * 2 * i / 44, s = 2 + Math.random() * 4; particles.push({ type: 's', x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, g: .03, life: 1, r: .9 + Math.random() * 1.3 }) } }, k * 150) }
  function drawFx() { fctx.clearRect(0, 0, innerWidth, innerHeight); particles.forEach((p, i) => { p.x += p.vx; p.y += p.vy; p.vy += p.g; p.life -= p.type === 'c' ? .012 : .018; fctx.fillStyle = `rgba(242,221,169,${Math.max(0, p.life)})`; if (p.type === 's') { fctx.shadowBlur = 10; fctx.shadowColor = 'rgba(243,220,170,.8)' } else fctx.shadowBlur = 0; fctx.beginPath(); fctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); fctx.fill(); fctx.shadowBlur = 0; if (p.life <= 0) particles.splice(i, 1) }); requestAnimationFrame(drawFx) } drawFx();

  /* ---------- Background Music ---------- */

  const bgMusic = document.getElementById("bgMusic");
  const musicToggle = document.getElementById("musicToggle");

  let musicOn = true;

  bgMusic.volume = 0;

  function startMusic() {
    if (!musicOn) return;

    bgMusic.volume = 0;

    bgMusic.play()
      .then(() => {
        musicToggle.classList.add("on");
        musicToggle.classList.remove("muted");

        let volume = 0;

        const fadeIn = setInterval(() => {
          volume += 0.01;

          if (volume >= 0.35) {
            volume = 0.35;
            clearInterval(fadeIn);
          }

          bgMusic.volume = volume;
        }, 80);
      })
      .catch(error => {
        console.log("Không thể phát nhạc:", error);
      });
  }

  musicToggle.addEventListener("click", () => {
    if (bgMusic.paused) {
      musicOn = true;

      bgMusic.play();

      musicToggle.classList.add("on");
      musicToggle.classList.remove("muted");
    } else {
      musicOn = false;

      bgMusic.pause();

      musicToggle.classList.remove("on");
      musicToggle.classList.add("muted");
    }
  });

  function openGift() { const box = $('#giftBox'); if (box.classList.contains('open')) return; box.classList.add('open'); confetti(85); fireworks(5); setTimeout(() => { $('#wishCard').classList.remove('hidden'); $('#openGiftBtn').classList.add('hidden') }, 700) }
  $('#giftBox').addEventListener('click', openGift); $('#openGiftBtn').addEventListener('click', openGift);

  function blow() { const cake = $('#cake'); if (cake.classList.contains('blown')) return; cake.classList.add('blown'); $('#blowBtn').classList.add('hidden'); $('#cakeMessage').classList.remove('hidden'); $('#afterCakeBtn').classList.remove('hidden'); fireworks(7); confetti(70) }
  $('#blowBtn').addEventListener('click', blow); $('#cake').addEventListener('click', blow); $('#cake').addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') blow() });

  const nc = $('#nameCanvas'), nctx = nc.getContext('2d'); let running = false;
  function startNameAnimation() {
    if (running) return; running = true; $('#continueAfterName').classList.add('hidden');
    const r = nc.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2); nc.width = r.width * dpr; nc.height = r.height * dpr; nctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const w = r.width, h = r.height, tmp = document.createElement('canvas'); tmp.width = Math.floor(w); tmp.height = Math.floor(h); const t = tmp.getContext('2d');
    const fs = Math.min(h * .62, w * .30); t.font = `700 ${fs}px Georgia, serif`; t.textAlign = 'center'; t.textBaseline = 'middle'; t.fillStyle = '#fff'; t.fillText('NHƯ', w / 2, h / 2);
    const data = t.getImageData(0, 0, tmp.width, tmp.height).data, tar = [], step = Math.max(5, Math.floor(fs / 24));
    for (let y = 0; y < h; y += step)for (let x = 0; x < w; x += step)if (data[(Math.floor(y) * tmp.width + Math.floor(x)) * 4 + 3] > 120) tar.push({ x, y });
    const max = Math.min(650, tar.length), jump = Math.max(1, Math.floor(tar.length / max)), sel = []; for (let i = 0; i < tar.length && sel.length < max; i += jump)sel.push(tar[i]);
    const pts = sel.map(p => ({ x: Math.random() * w, y: Math.random() * h, tx: p.x, ty: p.y, a: 0, r: .8 + Math.random() * 1.3, d: Math.random() * 900 }));
    const start = performance.now();
    function frame(now) { const e = now - start; nctx.clearRect(0, 0, w, h); pts.forEach(p => { if (e < p.d) return; p.a = Math.min(1, p.a + .035); p.x += (p.tx - p.x) * .055; p.y += (p.ty - p.y) * .055; nctx.beginPath(); nctx.fillStyle = `rgba(244,220,170,${p.a})`; nctx.shadowBlur = 10; nctx.shadowColor = 'rgba(244,220,170,.8)'; nctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); nctx.fill(); nctx.shadowBlur = 0 }); if (e < 4200) requestAnimationFrame(frame); else { $('#continueAfterName').classList.remove('hidden'); fireworks(8) } }
    requestAnimationFrame(frame);
  }

  $('#celebrateBtn').addEventListener('click', () => { fireworks(14); confetti(110) });
  $('#replayBtn').addEventListener('click', () => location.reload());
})();
