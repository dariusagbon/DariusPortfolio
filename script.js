/* ---------- EmailJS Configuration ---------- */
// Sign up at https://www.emailjs.com/ and replace 'YOUR_PUBLIC_KEY' with your actual public key
const emailjsAvailable = typeof window.emailjs !== 'undefined';
if (emailjsAvailable) {
  emailjs.init('hUuMmfld80KsHPOxa');
  console.log('EmailJS initialized');
} else {
  console.warn('EmailJS library not loaded; contact form email will be disabled.');
}

/* ---------- Dynamic copyright year ---------- */
document.getElementById('footer-year').textContent = new Date().getFullYear();

/* ---------- Live timezone clocks ---------- */
function updateClocks() {
  const now = new Date();
  const davao = now.toLocaleTimeString('en-PH', { timeZone: 'Asia/Manila', hour: '2-digit', minute: '2-digit' });
  const pacific = now.toLocaleTimeString('en-US', { timeZone: 'America/Los_Angeles', hour: '2-digit', minute: '2-digit' });
  ['clock-davao', 'clock-davao-m'].forEach(id => { const el = document.getElementById(id); if (el) el.textContent = davao; });
  ['clock-pacific', 'clock-pacific-m'].forEach(id => { const el = document.getElementById(id); if (el) el.textContent = pacific; });
}
updateClocks();
setInterval(updateClocks, 30000);

/* ---------- Mobile menu toggle ---------- */
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const iconOpen = document.getElementById('menu-icon-open');
const iconClose = document.getElementById('menu-icon-close');

menuBtn.addEventListener('click', () => {
  const isHidden = mobileMenu.classList.contains('hidden');
  mobileMenu.classList.toggle('hidden');
  iconOpen.classList.toggle('hidden');
  iconClose.classList.toggle('hidden');
  menuBtn.setAttribute('aria-expanded', String(isHidden));
  menuBtn.setAttribute('aria-label', isHidden ? 'Close navigation menu' : 'Open navigation menu');
});

// Close mobile menu after tapping a link
document.querySelectorAll('#mobile-menu a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
    iconOpen.classList.remove('hidden');
    iconClose.classList.add('hidden');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-label', 'Open navigation menu');
  });
});

/* ---------- Scrollspy: highlight active nav link ---------- */
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('[data-nav]');

const spy = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        const isActive = link.getAttribute('href') === `#${entry.target.id}`;
        link.classList.toggle('active', isActive);
        link.setAttribute('aria-current', isActive ? 'true' : 'false');
      });
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });

sections.forEach(section => spy.observe(section));

/* ---------- Copy to clipboard ---------- */
document.querySelectorAll('[data-copy]').forEach(btn => {
  const feedback = btn.querySelector('.copy-feedback');
  const original = feedback.textContent;
  let timer = null;
  btn.addEventListener('click', async () => {
    const value = btn.getAttribute('data-copy');
    try {
      await navigator.clipboard.writeText(value);
      feedback.textContent = 'Copied!';
    } catch {
      feedback.textContent = 'Copy failed';
    }
    clearTimeout(timer);
    timer = setTimeout(() => { feedback.textContent = original; }, 1600);
  });
});

/* ---------- Contact form with inline validation ---------- */
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

function setFieldError(inputId, errorId, message) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  if (message) {
    input.classList.add('field-error');
    input.setAttribute('aria-invalid', 'true');
    error.textContent = message;
  } else {
    input.classList.remove('field-error');
    input.setAttribute('aria-invalid', 'false');
    error.textContent = '';
  }
}

function clearAllErrors() {
  [['cf-name','cf-name-error'],['cf-email','cf-email-error'],['cf-message','cf-message-error']]
    .forEach(([i, e]) => setFieldError(i, e, ''));
  formStatus.textContent = '';
  formStatus.className = 'text-sm min-h-[1.25rem]';
}

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  clearAllErrors();

  const name    = document.getElementById('cf-name').value.trim();
  const email   = document.getElementById('cf-email').value.trim();
  const message = document.getElementById('cf-message').value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  let hasError = false;
  if (!name)                       { setFieldError('cf-name', 'cf-name-error', 'Please enter your name.'); hasError = true; }
  if (!email)                      { setFieldError('cf-email', 'cf-email-error', 'Please enter your email address.'); hasError = true; }
  else if (!emailPattern.test(email)) { setFieldError('cf-email', 'cf-email-error', 'That email address doesn\'t look right — please check it.'); hasError = true; }
  if (!message)                    { setFieldError('cf-message', 'cf-message-error', 'Please write a message before sending.'); hasError = true; }

  if (hasError) return;

  formStatus.textContent = 'Sending...';
  formStatus.className = 'text-sm min-h-[1.25rem] text-steel';

  console.log('Form submitted with:', { name, email, message });

  if (!emailjsAvailable) {
    console.error('Cannot send email because EmailJS is unavailable.');
    formStatus.textContent = 'Message service is unavailable right now. Please email me directly.';
    formStatus.className = 'text-sm min-h-[1.25rem] text-amber';
    return;
  }

  // Send email via EmailJS
  emailjs.send('service_tptl54j', 'template_7ud06gp', {
    to_email: 'dariusjayoagbon@gmail.com',
    from_name: name,
    from_email: email,
    message: message
  }).then(
    (response) => {
      console.log('Email sent successfully:', response);
      formStatus.textContent = 'Message sent successfully! I\'ll get back to you soon.';
      formStatus.className = 'text-sm min-h-[1.25rem] text-teal';
      contactForm.reset();
    },
    (error) => {
      console.error('EmailJS error:', error);
      formStatus.textContent = 'Failed to send message. Please try again or email me directly.';
      formStatus.className = 'text-sm min-h-[1.25rem] text-amber';
    }
  );
});

/* ---------- Back to top ---------- */
document.getElementById('back-to-top').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ---------- Terminal typewriter (signature element) ---------- */
const terminalEl = document.getElementById('terminal');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!terminalEl) {
  console.error('Live availability terminal element not found.');
} else {
    const terminalLines = [
    { text: '$ whoami', cls: 'text-teal' },
    { text: 'Darius Agbon', cls: 'text-paper' },
    { text: 'Virtual Assistant / Programmer · Davao City, PH', cls: 'text-steel' },
    { text: '', cls: '' },
    { text: '$ check_availability --zone=PST', cls: 'text-teal' },
    { text: 'status: AVAILABLE', cls: 'text-amber font-semibold' },
    { text: 'hours: 07:00 – 15:00 PST · full-time & part-time', cls: 'text-steel' },
    { text: '', cls: '' },
    { text: '$ skills --primary', cls: 'text-teal' },
    { text: 'Java · Python · PHP · Laravel · SQL', cls: 'text-paper' },
    { text: '', cls: '' },
    { text: '$ connect --github', cls: 'text-teal' },
    { text: 'github.com/dariusagbon', cls: 'text-amber' },
  ];

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  function renderStatic() {
    terminalEl.innerHTML = terminalLines
      .map(line => `<span class="${line.cls} block">${line.text || '\u00A0'}</span>`)
      .join('') + '<span class="cursor text-amber" aria-hidden="true">▌</span>';
  }

  async function typeTerminal() {
    if (reduceMotion) { renderStatic(); return; }

    terminalEl.innerHTML = '';
    for (const line of terminalLines) {
      const lineEl = document.createElement('span');
      lineEl.className = `${line.cls} block`;
      terminalEl.appendChild(lineEl);

      if (!line.text) {
        lineEl.innerHTML = '\u00A0';
        await sleep(180);
        continue;
      }

      const cursor = document.createElement('span');
      cursor.className = 'cursor text-amber';
      cursor.textContent = '▌';
      cursor.setAttribute('aria-hidden', 'true');
      terminalEl.appendChild(cursor);

      const isCommand = line.cls.includes('teal');
      for (const char of line.text) {
        lineEl.textContent += char;
        await sleep(isCommand ? 38 : 14);
      }
      cursor.remove();
      await sleep(220);
    }

    const finalCursor = document.createElement('span');
    finalCursor.className = 'cursor text-amber';
    finalCursor.textContent = '▌';
    finalCursor.setAttribute('aria-hidden', 'true');
    terminalEl.appendChild(finalCursor);

    await sleep(3000);
    typeTerminal();
  }

  typeTerminal();
}