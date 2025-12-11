<footer class="store-footer">
  <div class="inner">
    <div class="footer-content">
      <div class="brand-block">
        <img src="/logo.svg" alt="4A MOTOS" class="brand-mark" />
        <p>Somos una marca latinoamericana que ofrece productos de alta calidad y precios muy competitivos.</p>
        <p>¡No te quedes sin conocer todo nuestro portafolio!</p>
      </div>

      <div class="categories">
        <h5>Categorías</h5>
        <div class="columns">
          <ul>
            <li><a href="/tienda?categoriaNombre=Filtros">Filtros</a></li>
            <li><a href="/tienda?categoriaNombre=Farolas%20y%20Direccionales">Farolas y Direccionales</a></li>
            <li><a href="/tienda?categoriaNombre=Espejos">Espejos</a></li>
            <li><a href="/tienda?categoriaNombre=Guayas">Guayas</a></li>
          </ul>
          <ul>
            <li><a href="/tienda?categoriaNombre=Kit%20de%20Arrastre">Kit de Arrastre</a></li>
            <li><a href="/tienda?categoriaNombre=Maniguetas">Maniguetas</a></li>
            <li><a href="/tienda?categoriaNombre=Retenes">Retenes</a></li>
            <li><a href="/tienda?categoriaNombre=Lubricantes%20y%20Fluidos">Lubricantes y Fluidos</a></li>
          </ul>
        </div>
      </div>

      <div class="contact">
        <div class="social">
          <a href="https://www.facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" class="icon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"
                fill="currentColor"
              />
            </svg>
          </a>
          <a href="https://www.instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" class="icon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="5" ry="5" fill="none" stroke="currentColor" stroke-width="2" />
              <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2" />
              <circle cx="17" cy="7" r="1" fill="currentColor" />
            </svg>
          </a>
          <a href="https://www.youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube" class="icon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M21.8 8s-.2-1.4-.8-2c-.7-.7-1.7-.8-2.6-.8C15.3 5 12 5 12 5s-3.3 0-6.4.2c-.9 0-1.9.1-2.6.8-.6.6-.8 2-.8 2S2 9.6 2 11.2v1.6c0 1.6.2 3.2.2 3.2s.2 1.4.8 2c.7.7 1.6.7 2.6.8 1.8.1 5.8.2 5.8.2s3.3 0 6.4-.2c.9-.1 1.9-.1 2.6-.8.6-.6.8-2 .8-2s.2-1.6.2-3.2v-1.6c0-1.6-.2-3.2-.2-3.2z"
                fill="currentColor"
              />
              <path d="M10 9.75 15.5 12 10 14.25z" fill="#facc15" />
            </svg>
          </a>
        </div>
        <ul>
          <li><a href="tel:3000000000">Tel: 3000000000</a></li>
          <li><a href="mailto:demo@tienda.com">demo@tienda.com</a></li>
          <li><span>Dirección demo, Ciudad</span></li>
          <li><a href="/p/contacto">Escríbenos</a></li>
        </ul>
      </div>
    </div>
  </div>

  <div class="footer-bottom">
    <div class="bottom-inner">
      <div class="bottom-left">
        <span>4A MOTOS</span>
      </div>
      <div class="bottom-links">
        <a href="/p/como-comprar">¿Cómo comprar?</a>
        <span class="sep">|</span>
        <a href="/p/privacidad">¿Cómo cuidamos tu privacidad?</a>
        <span class="sep">|</span>
        <a href="/p/compra-protegida">Compra protegida</a>
        <span class="sep">|</span>
        <a href="/p/cookies">Configurar cookies</a>
      </div>
    </div>
  </div>
</footer>

<style>
  .store-footer {
    background: linear-gradient(120deg, var(--footer-bg-1), var(--footer-bg-2));
    color: var(--footer-ink);
    padding: 36px 0 0;
    border-top: 1px solid var(--footer-border);
  }

  .inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }

  .footer-content {
    display: grid;
    grid-template-columns: 1.1fr 1.2fr 1fr;
    gap: 32px;
    align-items: flex-start;
  }

  .brand-mark {
    height: 44px;
    width: auto;
    margin: 0 0 10px;
    display: block;
  }

  .brand-block p {
    margin: 4px 0;
    line-height: 1.45;
    font-weight: 700;
  }

  .categories h5,

  .columns {
    display: grid;
    grid-template-columns: repeat(2, minmax(140px, 1fr));
    gap: 8px 28px;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    gap: 8px;
  }

  a {
    color: var(--footer-ink);
    text-decoration: none;
    font-weight: 700;
  }

  a:hover {
    text-decoration: underline;
  }

  .contact ul li span {
    font-weight: 700;
  }

  .social {
    display: flex;
    gap: 12px;
    align-items: center;
    margin-bottom: 12px;
  }

  .social .icon {
    width: 32px;
    height: 32px;
    border: 1px solid var(--footer-border);
    border-radius: 50%;
    display: grid;
    place-items: center;
    text-decoration: none;
    color: var(--footer-ink);
    background: var(--footer-chip-bg);
    transition: transform 120ms ease, background 120ms ease;
  }

  .social .icon svg {
    width: 16px;
    height: 16px;
  }

  .social .icon:hover {
    transform: translateY(-1px);
    background: var(--footer-chip-bg);
  }

  .footer-bottom {
    background: var(--footer-bottom-bg);
    color: var(--footer-ink);
    margin-top: 28px;
    padding: 12px 0;
    border-top: 1px solid var(--footer-border);
  }

  .bottom-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    display: flex;
    flex-wrap: wrap;
    gap: 12px 20px;
    align-items: center;
    justify-content: space-between;
    font-size: 13px;
  }

  .bottom-links {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
  }

  .bottom-links a,
  .bottom-inner a {
    color: var(--footer-ink);
    font-weight: 600;
  }


  .sep {
    color: var(--ink-3);
    padding: 0 4px;
  }

  :global([data-theme='dark'] .store-footer .brand-mark) {
    filter: brightness(1.05) invert(1) saturate(0.9);
  }

  @media (max-width: 960px) {
    .footer-content {
      grid-template-columns: 1fr;
      gap: 20px;
    }

    .columns {
      grid-template-columns: 1fr;
    }

    .bottom-inner {
      justify-content: flex-start;
    }
  }
</style>
