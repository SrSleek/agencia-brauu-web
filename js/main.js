/* ===========================
   Navigation
   =========================== */
const nav    = document.querySelector('.nav');
const toggle = document.querySelector('.nav__toggle');
const links  = document.querySelector('.nav__links');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

toggle?.addEventListener('click', () => {
  toggle.classList.toggle('open');
  links.classList.toggle('open');
  document.body.style.overflow = links.classList.contains('open') ? 'hidden' : '';
});

links?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    toggle.classList.remove('open');
    links.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ===========================
   Blog preview on homepage
   =========================== */
async function loadBlogPreview() {
  const grid = document.getElementById('blog-preview-grid');
  if (!grid) return;

  try {
    const res  = await fetch('/blog/posts.json');
    const data = await res.json();
    const posts = data.slice(0, 3);

    if (!posts.length) {
      grid.innerHTML = '<p class="blog-empty">Próximamente publicaremos contenido.</p>';
      return;
    }

    grid.innerHTML = posts.map(post => postCardHTML(post)).join('');
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

    grid.innerHTML = posts.map(post => postCardHTML(post)).join('');
  } catch {
    grid.innerHTML = '<p class="blog-empty">No se pudo cargar el blog.</p>';
  }
}

function postCardHTML(post) {
  const date = new Date(post.date).toLocaleDateString('es-MX', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
  return `
    <article class="post-card">
      <div class="post-card__body">
        <p class="post-card__category">${post.category}</p>
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
form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = form.querySelector('[type="submit"]');
  btn.disabled = true;
  btn.textContent = 'Enviando...';

  const body = Object.fromEntries(new FormData(form));

  try {
    // TODO: configure n8n webhook URL before launch
    await fetch('', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    btn.textContent = '¡Mensaje enviado!';
    form.reset();
  } catch {
    btn.textContent = 'Error, intenta de nuevo';
    btn.disabled = false;
  }
});

/* ===========================
   Init
   =========================== */
loadBlogPreview();
loadBlogListing();
