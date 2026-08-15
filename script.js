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

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    statusEl.textContent = '';
    statusEl.className = 'form-status';
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviant…';

    const formData = new FormData(form);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData,
      });
      const result = await response.json();

      if (result.success) {
        statusEl.textContent = 'Sol·licitud enviada. Et respondrem molt aviat.';
        statusEl.classList.add('ok');
        form.reset();
      } else {
        throw new Error(result.message || 'Error desconegut');
      }
    } catch (err) {
      statusEl.textContent = 'No hem pogut enviar el formulari. Torna-ho a provar o escriu-nos per WhatsApp.';
      statusEl.classList.add('error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Enviar sol·licitud';
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
