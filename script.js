/* ===========================
   scarlett's.
   script.js
   =========================== */

// ============ PRELOADER ============
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('preloader').classList.add('gone');
    setTimeout(() => {
      document.querySelectorAll('.fade-up').forEach((el, i) => {
        setTimeout(() => el.classList.add('visible'), i * 170);
      });
    }, 200);
  }, 2000);
});

// ============ CURSOR ============
const csr  = document.getElementById('csr');
const csr2 = document.getElementById('csr2');
let mx = 0, my = 0, fx = 0, fy = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  csr.style.left  = mx + 'px';
  csr.style.top   = my + 'px';
});
(function lagCursor() {
  fx += (mx - fx) * 0.13;
  fy += (my - fy) * 0.13;
  csr2.style.left = fx + 'px';
  csr2.style.top  = fy + 'px';
  requestAnimationFrame(lagCursor);
})();

document.querySelectorAll('a, button, .mc, .gi, .btab, .cgll').forEach(el => {
  el.addEventListener('mouseenter', () => csr.classList.add('hover'));
  el.addEventListener('mouseleave', () => csr.classList.remove('hover'));
});

// ============ NAVBAR ============
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ============ HAMBURGER ============
const hamburger = document.getElementById('hamburger');
const mobMenu   = document.getElementById('mob-menu');
let menuOpen = false;

hamburger.addEventListener('click', () => {
  menuOpen = !menuOpen;
  mobMenu.classList.toggle('open', menuOpen);
  const sp = hamburger.querySelectorAll('span');
  if (menuOpen) {
    sp[0].style.transform = 'translateY(6px) rotate(45deg)';
    sp[1].style.transform = 'translateY(-6px) rotate(-45deg)';
  } else {
    sp.forEach(s => { s.style.transform = ''; });
  }
});

function closeMob() {
  menuOpen = false;
  mobMenu.classList.remove('open');
  hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; });
}

// ============ SMOOTH SCROLL ============
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const t = document.querySelector(a.getAttribute('href'));
    if (t) window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
  });
});

// ============ SCROLL REVEAL ============
const revObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

[
  '.story-wrap', '.story-imgs', '.story-text',
  '.menu-intro', '.menu-tabs', '.menu-grid', '.mc',
  '.lokasi-intro', '.branch-tabs',
  '.galeri-intro', '.galeri-grid', '.gi',
  '.quote-wrap',
  '.contact-grid', '.cg-brand', '.cg-lokasi', '.cg-order',
  '.reveal'
].forEach(sel => {
  document.querySelectorAll(sel).forEach((el, i) => {
    el.classList.add('scroll-reveal');
    el.style.transitionDelay = (i * 0.07) + 's';
    revObs.observe(el);
  });
});

// ============ COUNTER ============
function countUp(el) {
  const target = parseInt(el.dataset.target);
  const suffix = target >= 1000 ? 'K' : '';
  const displayTarget = target >= 1000 ? target / 1000 : target;
  let cur = 0;
  const step = displayTarget / (2000 / 16);
  const t = setInterval(() => {
    cur = Math.min(cur + step, displayTarget);
    const val = displayTarget % 1 === 0
      ? Math.floor(cur)
      : cur.toFixed(1);
    el.textContent = val + suffix;
    if (cur >= displayTarget) clearInterval(t);
  }, 16);
}

const cntObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('[data-target]').forEach(countUp);
      cntObs.unobserve(e.target);
    }
  });
}, { threshold: 0.4 });

document.querySelectorAll('.story-imgs, .story-nums').forEach(el => cntObs.observe(el));

// ============ MENU CATEGORY FILTER ============
const mtabs  = document.querySelectorAll('.mtab');
const mcards = document.querySelectorAll('.mc:not(.mc-cta)');

function showCat(cat) {
  mcards.forEach((card, i) => {
    const match = card.dataset.cat === cat;
    if (!match) {
      card.style.display = 'none';
    } else {
      card.style.display = 'block';
      card.style.opacity = '0';
      card.style.transform = 'translateY(16px)';
      card.style.transition = 'opacity 0.45s ease, transform 0.45s ease, box-shadow 0.4s';
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'none';
      }, i * 70);
    }
  });
}

mtabs.forEach(tab => {
  tab.addEventListener('click', () => {
    mtabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    showCat(tab.dataset.cat);
  });
});

// Init: show cakes
showCat('cakes');

// ============ BRANCH TABS ============
const btabs   = document.querySelectorAll('.btab');
const bpanels = document.querySelectorAll('.bpanel');

btabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const idx = tab.dataset.branch;
    btabs.forEach(t => t.classList.remove('active'));
    bpanels.forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('branch-' + idx).classList.add('active');
  });
});

function scrollToBranch(idx) {
  btabs.forEach(t => t.classList.remove('active'));
  bpanels.forEach(p => p.classList.remove('active'));
  btabs[idx].classList.add('active');
  document.getElementById('branch-' + idx).classList.add('active');
  document.getElementById('lokasi').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ============ GALLERY LIGHTBOX ============
document.querySelectorAll('.gi').forEach(item => {
  // Add hover overlay dynamically
  const ov = document.createElement('div');
  ov.className = 'gi-hover';
  const sp = document.createElement('span');
  sp.textContent = item.dataset.label || '';
  ov.appendChild(sp);
  item.appendChild(ov);

  item.addEventListener('click', () => {
    openLightbox(item.querySelector('img').src, item.dataset.label || '');
  });
});

function openLightbox(src, label) {
  const sty = document.createElement('style');
  sty.textContent = '@keyframes lbIn{from{opacity:0;transform:scale(0.95)}to{opacity:1;transform:none}}';
  document.head.appendChild(sty);

  const overlay = document.createElement('div');
  overlay.style.cssText = [
    'position:fixed;inset:0;background:rgba(92,74,66,0.95);z-index:9000;',
    'display:flex;flex-direction:column;align-items:center;justify-content:center;',
    'cursor:pointer;animation:lbIn 0.35s ease;'
  ].join('');

  const img = document.createElement('img');
  img.src = src;
  img.style.cssText = 'max-width:88vw;max-height:80vh;object-fit:contain;';

  const cap = document.createElement('p');
  cap.textContent = label;
  cap.style.cssText = 'font-family:"Great Vibes",cursive;font-size:24px;color:rgba(245,232,231,0.7);margin-top:16px;letter-spacing:2px;';

  const close = document.createElement('button');
  close.textContent = '✕';
  close.style.cssText = [
    'position:fixed;top:24px;right:32px;background:none;',
    'border:1px solid rgba(196,128,122,0.4);color:#C4807A;',
    'width:44px;height:44px;font-size:16px;cursor:pointer;border-radius:50%;'
  ].join('');

  overlay.append(img, cap, close);
  document.body.appendChild(overlay);

  const remove = () => {
    overlay.style.transition = 'opacity 0.25s';
    overlay.style.opacity = '0';
    setTimeout(() => overlay.remove(), 250);
  };
  overlay.addEventListener('click', e => { if (e.target === overlay) remove(); });
  close.addEventListener('click', remove);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') remove(); }, { once: true });
}

// ============ WA BRANCH DATA ============
const branches = [
  {
    name: 'Menteng, Jakarta Pusat',
    phone: '628XXXXXXXXXX',   // ← ganti dengan nomor WA Menteng
    msg: "Halo scarlett's! Saya ingin order/reservasi di Menteng..."
  },
  {
    name: 'PIK, Jakarta Utara',
    phone: '628XXXXXXXXXX',   // ← ganti dengan nomor WA PIK
    msg: "Halo scarlett's! Saya ingin order/reservasi di PIK..."
  },
  {
    name: 'Blok M, Jakarta Selatan',
    phone: '628XXXXXXXXXX',   // ← ganti dengan nomor WA Blok M
    msg: "Halo scarlett's! Saya ingin order/reservasi di Blok M..."
  }
];

function openWABranch(idx) {
  const b = branches[idx];
  window.open(`https://wa.me/${b.phone}?text=${encodeURIComponent(b.msg)}`, '_blank');
  closeWAModal();
}

function openWAChooser() {
  document.getElementById('wa-modal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeWAModal() {
  document.getElementById('wa-modal').classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('wa-modal').addEventListener('click', e => {
  if (e.target === document.getElementById('wa-modal')) closeWAModal();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeWAModal();
});

// ============ WA FAB SHOW/HIDE ============
const waFab = document.getElementById('wa-fab');
waFab.style.transition = 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.34,1.56,0.64,1)';

window.addEventListener('scroll', () => {
  const show = window.scrollY > 300;
  waFab.style.opacity   = show ? '1' : '0';
  waFab.style.transform = show ? 'scale(1)' : 'scale(0.8)';
});

// ============ HERO PARALLAX ============
window.addEventListener('scroll', () => {
  const heroImg = document.querySelector('.hero-img');
  if (heroImg) {
    heroImg.style.transform = `scale(1.06) translateY(${window.scrollY * 0.08}px)`;
  }
});

// ============ MENU CARD STAGGER ON LOAD ============
document.querySelectorAll('.mc').forEach((c, i) => {
  c.style.opacity = '0';
  c.style.transform = 'translateY(20px)';
  c.style.transition = 'opacity 0.5s ease, transform 0.5s ease, box-shadow 0.4s, transform 0.4s';
});

const menuObs = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    const visible = document.querySelectorAll('.mc[style*="block"], .mc:not([style*="none"])');
    visible.forEach((c, i) => {
      setTimeout(() => {
        c.style.opacity = '1';
        c.style.transform = 'none';
      }, i * 80);
    });
    menuObs.disconnect();
  }
}, { threshold: 0.05 });

const menuGrid = document.getElementById('menu-grid');
if (menuGrid) menuObs.observe(menuGrid);

console.log('%cscarlett\'s.', 'color:#C4807A; font-family: Georgia, serif; font-size:28px; font-style:italic;');
console.log('%cBakery · Café · Jakarta', 'color:#A89A97; font-size:12px; letter-spacing:4px;');
