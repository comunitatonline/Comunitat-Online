// Idioma de la pàgina (ca o es) per als missatges del formulari
const LANG = document.documentElement.lang === 'es' ? 'es' : 'ca';
const MSG = {
  ca: {
    sending: 'Enviant…',
    send: 'Enviar sol·licitud',
    ok: 'Sol·licitud enviada. Et respondrem molt aviat.',
    error: 'No hem pogut enviar el formulari. Torna-ho a provar o escriu-nos per WhatsApp.',
    privacy: "Per enviar la sol·licitud has d'acceptar la política de privacitat.",
  },
  es: {
    sending: 'Enviando…',
    send: 'Enviar solicitud',
    ok: 'Solicitud enviada. Te responderemos muy pronto.',
    error: 'No hemos podido enviar el formulario. Vuelve a intentarlo o escríbenos por WhatsApp.',
    privacy: 'Para enviar la solicitud tienes que aceptar la política de privacidad.',
  },
}[LANG];

// Any actual al copyright del peu de pàgina
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Menú mòbil
const menuToggle = document.getElementById('menu-toggle');
const mainNav = document.getElementById('main-nav');

if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Formulari de contacte (Web3Forms)
const form = document.getElementById('contact-form');
const statusEl = document.getElementById('form-status');
const submitBtn = document.getElementById('submit-btn');
const privacy = document.getElementById('privacy');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    statusEl.textContent = '';
    statusEl.className = 'form-status';

    if (privacy && !privacy.checked) {
      statusEl.textContent = MSG.privacy;
      statusEl.classList.add('error');
      privacy.focus();
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = MSG.sending;

    const formData = new FormData(form);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData,
      });
      const result = await response.json();

      if (result.success) {
        statusEl.textContent = MSG.ok;
        statusEl.classList.add('ok');
        form.reset();
      } else {
        throw new Error(result.message || 'Error');
      }
    } catch (err) {
      statusEl.textContent = MSG.error;
      statusEl.classList.add('error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = MSG.send;
    }
  });
}

// Amaga el botó flotant de WhatsApp quan la secció de contacte és visible
const waFloat = document.getElementById('wa-float');
const contactSection = document.getElementById('contacte');

if (waFloat && contactSection && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        waFloat.classList.toggle('is-hidden', entry.isIntersecting);
      });
    },
    { threshold: 0.15 }
  );
  observer.observe(contactSection);
}

// Carrusel de serveis (només actua quan la graella fa scroll horitzontal, al mòbil)
const grid = document.querySelector('.services-grid');
const dots = document.getElementById('svc-dots');

if (grid && dots) {
  const cards = [...grid.children];
  const pad = () => parseFloat(getComputedStyle(grid).paddingLeft) || 0;

  cards.forEach((card, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', `${i + 1} / ${cards.length}`);
    b.addEventListener('click', () => {
      grid.scrollTo({ left: card.offsetLeft - grid.offsetLeft - pad(), behavior: 'smooth' });
    });
    dots.appendChild(b);
  });

  const markDot = () => {
    const x = grid.scrollLeft;
    let current = 0;
    let best = Infinity;
    cards.forEach((card, i) => {
      const d = Math.abs(card.offsetLeft - grid.offsetLeft - pad() - x);
      if (d < best) { best = d; current = i; }
    });
    if (x + grid.clientWidth >= grid.scrollWidth - 4) current = cards.length - 1;
    [...dots.children].forEach((b, i) => b.setAttribute('aria-current', i === current ? 'true' : 'false'));
  };

  grid.addEventListener('scroll', () => requestAnimationFrame(markDot), { passive: true });
  window.addEventListener('resize', markDot);
  markDot();
}

// Avís de cookies (només informatiu: la web únicament fa servir elements tècnics)
const cookie = document.getElementById('cookie');
const cookieOk = document.getElementById('cookie-ok');

if (cookie && cookieOk) {
  let seen = false;
  try { seen = localStorage.getItem('co-cookies') === 'ok'; } catch (e) {}
  if (!seen) cookie.hidden = false;
  cookieOk.addEventListener('click', () => {
    cookie.hidden = true;
    try { localStorage.setItem('co-cookies', 'ok'); } catch (e) {}
  });
}
