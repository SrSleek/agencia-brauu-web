/* ===========================
   Navigation — scroll + mobile toggle
   =========================== */
const nav    = document.getElementById('nav');
const toggle = document.getElementById('nav-toggle');
const links  = document.getElementById('nav-links');

window.addEventListener('scroll', () => {
  nav?.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

toggle?.addEventListener('click', () => {
  const isOpen = links.classList.toggle('open');
  toggle.classList.toggle('open', isOpen);
  toggle.setAttribute('aria-expanded', String(isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

links?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    links.classList.remove('open');
    toggle?.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

/* ===========================
   Scroll-reveal animations
   =========================== */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

// Hero elements fire immediately; everything else triggers on scroll
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    document.querySelectorAll('[data-animate]').forEach(el => {
      if (el.closest('.hero')) {
        el.classList.add('visible');
      } else {
        revealObserver.observe(el);
      }
    });
  });
});

/* ===========================
   Services accordion
   =========================== */
document.querySelectorAll('.service-item__trigger').forEach(trigger => {
  trigger.addEventListener('click', () => {
    const item   = trigger.closest('.service-item');
    const isOpen = item.classList.contains('open');

    // Close any open item
    document.querySelectorAll('.service-item.open').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.service-item__trigger').setAttribute('aria-expanded', 'false');
    });

    // Toggle clicked item
    if (!isOpen) {
      item.classList.add('open');
      trigger.setAttribute('aria-expanded', 'true');
    }
  });
});

/* ===========================
   Blog preview on homepage
   =========================== */
async function loadBlogPreview() {
  const grid    = document.getElementById('blog-preview-grid');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  if (!grid) return;

  try {
    const res  = await fetch('/blog/posts.json');
    const data = await res.json();
    const posts = data.sort((a, b) => new Date(b.date) - new Date(a.date));

    if (!posts.length) {
      grid.innerHTML = '<p class="blog-empty">Próximamente publicaremos contenido.</p>';
      if (prevBtn) prevBtn.hidden = true;
      if (nextBtn) nextBtn.hidden = true;
      return;
    }

    const PAGE = 4;
    let offset = 0;

    function render() {
      grid.innerHTML = posts.slice(offset, offset + PAGE).map(postCardHTML).join('');
      if (prevBtn) prevBtn.disabled = offset === 0;
      if (nextBtn) nextBtn.disabled = offset + PAGE >= posts.length;
    }

    prevBtn?.addEventListener('click', () => { offset = Math.max(0, offset - 1); render(); });
    nextBtn?.addEventListener('click', () => { offset = Math.min(posts.length - PAGE, offset + 1); render(); });

    render();
  } catch {
    grid.innerHTML = '<p class="blog-empty">No se pudo cargar el blog.</p>';
  }
}

/* ===========================
   Blog listing page
   =========================== */
async function loadBlogListing() {
  const grid = document.getElementById('blog-grid');
  if (!grid) return;

  try {
    const res   = await fetch('/blog/posts.json');
    const posts = await res.json();

    if (!posts.length) {
      grid.innerHTML = '<p class="blog-empty">Próximamente publicaremos contenido.</p>';
      return;
    }
    grid.innerHTML = posts.map(postCardHTML).join('');
  } catch {
    grid.innerHTML = '<p class="blog-empty">No se pudo cargar el blog.</p>';
  }
}

function postCardHTML(post) {
  const date = new Date(post.date).toLocaleDateString('es-MX', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
  return `
    <article class="post-card">
      <div class="post-card__body">
        <span class="post-card__category">${post.category}</span>
        <h3><a href="/blog/${post.slug}/">${post.title}</a></h3>
        <p>${post.excerpt}</p>
        <span class="post-card__date">${date}</span>
      </div>
    </article>`;
}

/* ===========================
   Contact form
   =========================== */
const form = document.getElementById('contact-form');
console.log('form found:', form);
form?.addEventListener('submit', async (e) => {
  console.log('form submitted');
  e.preventDefault();
  const btn = form.querySelector('[type="submit"]');
  btn.disabled    = true;
  btn.textContent = 'Enviando...';

  const body = Object.fromEntries(new FormData(form));

  try {
    await fetch('https://n8n.agenciabrauu.com/webhook/contacto-brauu', {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    btn.textContent = '¡Mensaje enviado!';
    form.reset();
  } catch {
    btn.textContent = 'Error, intenta de nuevo';
    btn.disabled    = false;
  }
});

/* ===========================
   Init
   =========================== */
loadBlogPreview();
loadBlogListing();
