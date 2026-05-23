/* ============================================================
   uno.ganddal.net – app.js
   ============================================================ */

'use strict';

/* ── Nav: scroll-effect + mobil-toggle ── */
const nav       = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.classList.toggle('open', open);
  navToggle.setAttribute('aria-label', open ? 'Lukk meny' : 'Åpne meny');
});

// Lukk mobil-meny ved klikk på lenke
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-label', 'Åpne meny');
  });
});

/* ── Scroll reveal (IntersectionObserver) ── */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    // Staggered forsinkelse for grid-barn
    const grid  = entry.target.closest('.products-grid, .steps');
    const delay = grid
      ? [...grid.children].indexOf(entry.target) * 80
      : 0;

    setTimeout(() => entry.target.classList.add('visible'), delay);
    revealObs.unobserve(entry.target);
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ── 3D-tilt på produktkort ── */
document.querySelectorAll('[data-tilt]').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r  = card.getBoundingClientRect();
    const rx = ((e.clientY - r.top)  / r.height - 0.5) * -8;
    const ry = ((e.clientX - r.left) / r.width  - 0.5) *  8;
    card.style.transform =
      `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ── Easter egg: klikk på hero-hunden ── */
const heroDog   = document.getElementById('heroDog');
const woofPopup = document.getElementById('woofPopup');
let   clickCount = 0;
let   woofTimer;

const woofs = [
  'Voff! 🐾',
  'Voff voff! 🐕',
  'Au au! 🦴',
  'Hrrr... 🐾',
  'VOFF!!! 🐾🐾🐾',
  '...bæsj. 💩',
  'Ok, ok – nok nå! 😅',
];

heroDog.addEventListener('click', () => {
  clickCount++;
  clearTimeout(woofTimer);

  woofPopup.textContent = woofs[(clickCount - 1) % woofs.length];
  woofPopup.classList.add('show');

  // Liten hopp-animasjon
  heroDog.style.transform = 'scale(1.08) rotate(-3deg)';
  setTimeout(() => { heroDog.style.transform = ''; }, 200);

  woofTimer = setTimeout(() => woofPopup.classList.remove('show'), 2200);
});

/* ── Kontaktskjema: hundens humør ── */
const contactDog = document.getElementById('contactDog');
const formFields = document.querySelectorAll('#contactForm input, #contactForm select, #contactForm textarea');

function updateDogMood() {
  const filled = [...formFields].every(f => f.value.trim() !== '');
  contactDog.src = filled ? 'img/btommel.png' : 'img/btenke.png';
}

formFields.forEach(f => {
  f.addEventListener('input',  updateDogMood);
  f.addEventListener('change', updateDogMood);
});

/* ── Kontaktskjema: innsending (Formspree) ──
   Slik setter du det opp gratis:
   1. Gå til https://formspree.io og opprett en konto
   2. Lag et nytt skjema – velg e-postadressen din
   3. Kopier din unike form-ID (f.eks. "xbjnrpkz")
   4. Erstatt "DITT_FORM_ID" i action-attributten i index.html
   ── */
const contactForm = document.getElementById('contactForm');
const submitBtn   = document.getElementById('submitBtn');
const formSuccess = document.getElementById('formSuccess');

contactForm.addEventListener('submit', async e => {
  e.preventDefault();

  submitBtn.textContent = 'Sender... 🐾';
  submitBtn.disabled = true;

  // Demo-modus: vis suksess uten Formspree hvis action inneholder "DITT_FORM_ID"
  if (contactForm.action.includes('DITT_FORM_ID')) {
    await new Promise(r => setTimeout(r, 900)); // simuler nettverk
    showSuccess();
    return;
  }

  try {
    const res = await fetch(contactForm.action, {
      method:  'POST',
      body:    new FormData(contactForm),
      headers: { 'Accept': 'application/json' },
    });
    if (res.ok) {
      showSuccess();
    } else {
      throw new Error('Nettverksfeil');
    }
  } catch {
    submitBtn.textContent = 'Prøv igjen 🐾';
    submitBtn.disabled = false;
    alert('Noe gikk galt. Send gjerne en e-post direkte i stedet.');
  }
});

function showSuccess() {
  contactForm.style.display = 'none';
  formSuccess.hidden = false;
  if (contactDog) contactDog.src = 'img/bvinke.png';
}

/* ── Forhåndsvelg i kontaktskjema ved klikk på produkt-knapper ── */
document.querySelectorAll('[data-preselect]').forEach(btn => {
  btn.addEventListener('click', () => {
    const select = document.getElementById('type');
    if (select) {
      select.value = btn.dataset.preselect;
      updateDogMood();
    }
  });
});

/* ── Jevn scroll for ankre (fallback for eldre nettlesere) ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
