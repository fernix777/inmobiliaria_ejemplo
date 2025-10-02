// includeTemplates.js
// Carga header/footer desde templates/ y los inyecta en el DOM.
(function(){
  async function fetchText(path){
    try{
      const res = await fetch(path, {cache: 'no-store'});
      if(!res.ok) return '';
      return await res.text();
    }catch(e){
      console.error('No se pudo cargar plantilla:', path, e);
      return '';
    }
  }

  async function includeTemplates(){
    const headerHolder = document.getElementById('site-header');
    const footerHolder = document.getElementById('site-footer');

    let headerHtml = '';
    if(headerHolder){
      headerHtml = await fetchText('templates/header.html');
      // If header fragment contains a Tailwind CDN script, move it to <head> so styles load first
      try{
        const hasTailwindScript = /cdn\.tailwindcss\.com/.test(headerHtml);
        if(hasTailwindScript){
          // Extract any <script>...</script> blocks and insert them into head
          const scriptMatches = [...headerHtml.matchAll(/<script[\s\S]*?<\/script>/gi)];
          for(const m of scriptMatches){
            const scriptHtml = m[0];
            // Create a DOM node in head
            const tmp = document.createElement('div');
            tmp.innerHTML = scriptHtml;
            const scriptNode = tmp.querySelector('script');
            if(scriptNode){
              const newScript = document.createElement('script');
              if(scriptNode.src) newScript.src = scriptNode.src;
              newScript.text = scriptNode.text;
              document.head.appendChild(newScript);
            }
            // remove the script from headerHtml so it won't be duplicated
            headerHtml = headerHtml.replace(scriptHtml, '');
          }
        }
      }catch(err){
        console.warn('Error moving scripts to head:', err);
      }
      headerHolder.innerHTML = headerHtml;
    }
    if(footerHolder){
      footerHolder.innerHTML = await fetchText('templates/footer.html');
      const yearEl = document.getElementById('year');
      if(yearEl) yearEl.textContent = new Date().getFullYear();
      const yearBottom = document.getElementById('year-bottom');
      if(yearBottom) yearBottom.textContent = new Date().getFullYear();
    }

    // Señalizar que las plantillas fueron inyectadas
    document.body.classList.add('templates-injected');

    // Esperar hasta que Tailwind esté disponible (si fue movido a head). Esto reduce parpadeos.
    try{
      const waitForTailwind = async () => {
        if(typeof window.tailwind !== 'undefined') return;
        const start = Date.now();
        return new Promise((resolve) => {
          const iv = setInterval(() => {
            if(typeof window.tailwind !== 'undefined' || Date.now() - start > 1200){
              clearInterval(iv);
              resolve();
            }
          }, 80);
        });
      };
      await waitForTailwind();
    }catch(e){
      console.warn('Timeout/wait tailwind failed', e);
    }

    // Ocultar/eliminar controles relacionados a sesión cuando estamos en la página pública (index)
    try{
      const path = window.location.pathname || '';
      const page = path.split('/').pop() || 'index.html';
      const isIndex = page === '' || page === 'index.html' || page === '/';
      if(isIndex){
        // Buscar botón de cerrar sesión y removerlo
        const logoutBtn = document.querySelector('.header-actions .btn-logout');
        if(logoutBtn){
          logoutBtn.remove();
        }
      }
    }catch(e){
      // No bloquear la ejecución si algo falla
      console.warn('No se pudo ajustar controles de sesión en header:', e);
    }
    // Mobile menu toggle handling (delegated, unificado)
    document.body.addEventListener('click', function(e){
      const toggle = e.target.closest('.mobile-menu-toggle');
      if(!toggle) return;
      const nav = document.querySelector('.main-nav');
      if(!nav) return;
      const isOpen = nav.classList.toggle('open');
      nav.classList.toggle('hidden', !isOpen);
      // Accesibilidad
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  // Run after DOMContentLoaded to ensure holders exist
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', includeTemplates);
  }else{
    includeTemplates();
  }
})();
