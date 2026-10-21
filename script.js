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

/* ---------- Project case-study disclosures ---------- */
document.querySelectorAll('.case-toggle').forEach(button => {
  button.addEventListener('click', () => {
    const details = document.getElementById(button.getAttribute('aria-controls'));
    const isOpen = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!isOpen));
    button.querySelector('span').textContent = isOpen ? '+' : '−';
    details.hidden = isOpen;
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

/* ---------- Interactive terminal (signature element) ---------- */
const terminalEl = document.getElementById('terminal');
const terminalBody = document.getElementById('terminal-body');
const terminalForm = document.getElementById('terminal-form');
const terminalInput = document.getElementById('terminal-input');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!terminalEl) {
  console.error('Live availability terminal element not found.');
} else {
  const introLines = [
    { text: '$ whoami', cls: 'text-teal' },
    { text: 'Darius Agbon', cls: 'text-paper' },
    { text: 'Virtual Assistant / Programmer · Davao City, PH', cls: 'text-steel' },
    { text: '', cls: '' },
    { text: '$ check_availability --zone=PST', cls: 'text-teal' },
    { text: 'status: AVAILABLE', cls: 'text-amber font-semibold' },
    { text: 'hours: 07:00 – 15:00 PST · full-time & part-time', cls: 'text-steel' },
    { text: '', cls: '' },
    { text: "Type 'help' to see what else you can ask.", cls: 'text-steel' },
  ];

  // Each command returns lines; a line can carry an href to render as a link.
  const commands = {
    help: () => [
      { text: 'Available commands:', cls: 'text-paper' },
      { text: '  whoami     who I am', cls: 'text-steel' },
      { text: '  skills     what I work with', cls: 'text-steel' },
      { text: '  projects   selected works', cls: 'text-steel' },
      { text: '  contact    how to reach me', cls: 'text-steel' },
      { text: '  resume     download my resume', cls: 'text-steel' },
      { text: '  github     open my GitHub', cls: 'text-steel' },
      { text: '  linkedin   open my LinkedIn', cls: 'text-steel' },
      { text: '  clear      clear the screen', cls: 'text-steel' },
    ],
    whoami: () => [
      { text: 'Darius Agbon — Virtual Assistant & Programmer', cls: 'text-paper' },
      { text: 'BS Information Technology, University of Mindanao.', cls: 'text-steel' },
      { text: 'I build practical software and keep digital operations organized.', cls: 'text-steel' },
    ],
    skills: () => [
      { text: 'code   Java · Python · PHP · Laravel · SQL · JS', cls: 'text-paper' },
      { text: 'ops    CRM · Product Research · Content', cls: 'text-paper' },
      { text: 'tools  SharePoint · Salesforce · WordPress · n8n', cls: 'text-paper' },
    ],
    projects: () => [
      ...Array.from(document.querySelectorAll('#works-grid .project-card h3'))
        .map(h => ({ text: `→ ${h.textContent.trim()}`, cls: 'text-paper' })),
      { text: 'See them all in the Works section.', cls: 'text-steel', href: '#works' },
    ],
    contact: () => [
      { text: 'email  dariusjayoagbon@gmail.com', cls: 'text-paper', href: 'mailto:dariusjayoagbon@gmail.com' },
      { text: 'phone  +63 963 063 7927', cls: 'text-paper' },
      { text: 'Or send a message in the Contact section.', cls: 'text-steel', href: '#contact' },
    ],
    resume: () => [{ text: 'Darius-Agbon-Resume.pdf', cls: 'text-amber', href: 'Darius-Agbon-Resume.pdf', download: true }],
    github: () => {
      window.open('https://github.com/dariusagbon', '_blank', 'noopener');
      return [{ text: 'Opening github.com/dariusagbon…', cls: 'text-amber', href: 'https://github.com/dariusagbon' }];
    },
    linkedin: () => {
      window.open('https://www.linkedin.com/in/darius-jay-o-agbon-b80612320', '_blank', 'noopener');
      return [{ text: 'Opening LinkedIn…', cls: 'text-amber', href: 'https://www.linkedin.com/in/darius-jay-o-agbon-b80612320' }];
    },
    sudo: () => [{ text: 'Nice try. Hire me and we can talk about permissions.', cls: 'text-amber' }],
  };
  commands.ls = commands.projects;
  commands.about = commands.whoami;

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  const history = [];
  let historyIndex = 0;

  function appendLine({ text, cls, href, download }) {
    const lineEl = document.createElement('span');
    lineEl.className = `${cls} block`;
    if (href) {
      const link = document.createElement('a');
      link.href = href;
      link.textContent = text;
      if (download) link.setAttribute('download', '');
      if (href.startsWith('http')) { link.target = '_blank'; link.rel = 'noopener noreferrer'; }
      lineEl.appendChild(link);
    } else {
      lineEl.textContent = text || ' ';
    }
    terminalEl.appendChild(lineEl);
    return lineEl;
  }

  function scrollTerminal() { terminalBody.scrollTop = terminalBody.scrollHeight; }

  async function typeIntro() {
    if (reduceMotion) { introLines.forEach(appendLine); return; }
    for (const line of introLines) {
      if (!line.text) { appendLine(line); await sleep(160); continue; }
      const lineEl = appendLine({ ...line, text: '' });
      lineEl.textContent = '';
      const isCommand = line.text.startsWith('$');
      for (const char of line.text) {
        lineEl.textContent += char;
        await sleep(isCommand ? 36 : 12);
      }
      await sleep(200);
    }
  }

  function runCommand(raw) {
    const input = raw.trim();
    appendLine({ text: `$ ${input}`, cls: 'text-teal' });
    if (!input) return;
    history.push(input);
    historyIndex = history.length;

    const name = input.toLowerCase().split(/\s+/)[0];
    if (name === 'clear') { terminalEl.innerHTML = ''; return; }
    const command = commands[name];
    const output = command ? command() : [{ text: `command not found: ${name} — try 'help'`, cls: 'text-red-400' }];
    output.forEach(appendLine);
    appendLine({ text: '', cls: '' });
  }

  terminalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    runCommand(terminalInput.value);
    terminalInput.value = '';
    scrollTerminal();
  });

  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' && historyIndex > 0) {
      historyIndex -= 1;
      terminalInput.value = history[historyIndex];
      e.preventDefault();
    } else if (e.key === 'ArrowDown' && historyIndex < history.length) {
      historyIndex += 1;
      terminalInput.value = history[historyIndex] || '';
      e.preventDefault();
    } else if (e.key === 'Tab' && terminalInput.value) {
      const match = Object.keys(commands).concat('clear').find(c => c.startsWith(terminalInput.value.toLowerCase()));
      if (match) { terminalInput.value = match; e.preventDefault(); }
    }
  });

  // Clicking anywhere in the terminal focuses the prompt (unless selecting text or clicking a link)
  terminalBody.addEventListener('click', (e) => {
    if (e.target.closest('a') || window.getSelection().toString()) return;
    terminalInput.focus({ preventScroll: true });
  });

  typeIntro().then(() => {
    terminalForm.classList.remove('hidden');
    terminalForm.classList.add('flex');
  });
}

/* ---------- Rotating role line ---------- */
const roleEl = document.getElementById('role-rotator');
if (roleEl && !reduceMotion) {
  const roles = ['Virtual Assistant & Programmer', 'Automation Builder', 'Web Developer', 'Operations Support'];
  let roleIndex = 0;
  setInterval(() => {
    roleIndex = (roleIndex + 1) % roles.length;
    roleEl.style.opacity = '0';
    setTimeout(() => { roleEl.textContent = roles[roleIndex]; roleEl.style.opacity = '1'; }, 250);
  }, 2800);
}

/* ---------- Scroll progress bar ---------- */
const progressEl = document.getElementById('scroll-progress');
function updateProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progressEl.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
}
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

/* ---------- Pointer effects: hero glow, card spotlight, card tilt ---------- */
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
if (finePointer && !reduceMotion) {
  const hero = document.getElementById('home');
  const glow = document.querySelector('.hero-glow');
  hero.addEventListener('pointermove', (e) => {
    const rect = glow.getBoundingClientRect();
    glow.style.setProperty('--gx', `${e.clientX - rect.left}px`);
    glow.style.setProperty('--gy', `${e.clientY - rect.top}px`);
  });

  document.querySelectorAll('.spotlight').forEach(card => {
    const tilt = card.classList.contains('project-card');
    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mx', `${x}px`);
      card.style.setProperty('--my', `${y}px`);
      if (tilt) {
        const rx = ((y / rect.height) - 0.5) * -3;
        const ry = ((x / rect.width) - 0.5) * 3;
        card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
      }
    });
    if (tilt) card.addEventListener('pointerleave', () => { card.style.transform = ''; });
  });
}

/* ---------- Stagger indexes for entrance animation ---------- */
document.querySelectorAll('.stagger').forEach(group => {
  Array.from(group.children).forEach((child, i) => {
    child.style.setProperty('--i', i);
    // After the entrance plays, drop the delay so hover effects respond instantly
    child.addEventListener('transitionend', (e) => { if (e.target === child) child.classList.add('settled'); });
  });
});

/* ---------- Works filter ---------- */
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('#works-grid .project-card');

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filterButtons.forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    projectCards.forEach(card => {
      card.hidden = filter !== 'all' && card.dataset.category !== filter;
    });
  });
});

/* ---------- Video mute toggle ---------- */
document.querySelectorAll('[data-unmute]').forEach(button => {
  const video = button.closest('.project-media').querySelector('video');
  button.addEventListener('click', () => {
    video.muted = !video.muted;
    button.setAttribute('aria-pressed', String(!video.muted));
    button.setAttribute('aria-label', video.muted ? 'Unmute video' : 'Mute video');
    button.querySelector('.mute-icon').classList.toggle('hidden', !video.muted);
    button.querySelector('.unmute-icon').classList.toggle('hidden', video.muted);
  });
});

/* ---------- Reveal sections on scroll ---------- */
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const revealer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  revealEls.forEach(el => revealer.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('is-visible'));
}
