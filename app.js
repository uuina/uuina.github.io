/* ==========================================================================
   uuina.github.io - Interactive Application Script
   Handles: Modal Article Reader (Markdown + Utterances),
   Direct DOM Display Toggle, Scroll Highlighting
   ========================================================================== */

// Global Article Modal Functions
window.openArticle = async function(id) {
  const modal = document.getElementById('article-modal');
  const modalTitle = document.getElementById('modal-article-title');
  const modalContent = document.getElementById('modal-article-content');

  if (!modal || !modalTitle || !modalContent) return;

  // Show loading state
  modalTitle.textContent = "正在加载文章...";
  modalContent.innerHTML = '<div style="text-align:center; padding: 2rem; color: var(--text-muted);"><i class="fa-solid fa-circle-notch fa-spin fa-2x"></i></div>';
  
  // Direct DOM display toggle
  modal.style.display = 'flex';
  modal.style.opacity = '1';
  modal.style.pointerEvents = 'auto';
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  try {
    // Fetch the markdown file
    const response = await fetch(`articles/${id}.md`);
    if (!response.ok) {
      throw new Error("文章未找到或加载失败");
    }
    const markdown = await response.text();
    
    // Parse Markdown to HTML
    const htmlContent = marked.parse(markdown);
    
    // Set title based on id (since markdown files don't have frontmatter yet)
    let title = "阅读文章";
    if (id === 'ect-ecvt-research') title = "过程层析成像 (ECT/ECVT) 技术概述与研究简述";
    if (id === 'mcp-guide') title = "Model Context Protocol (MCP) 在科研辅助中的探索";

    modalTitle.textContent = title;
    
    // Build the content HTML + Utterances container
    modalContent.innerHTML = `
      <div class="markdown-body">
        ${htmlContent}
      </div>
      <div class="utterances-container" id="utterances-container">
        <!-- Utterances comments will load here -->
      </div>
    `;

    // Inject Utterances Script
    const utterancesContainer = document.getElementById('utterances-container');
    const script = document.createElement('script');
    script.src = "https://utteranc.es/client.js";
    script.setAttribute("repo", "uuina/uuina.github.io");
    script.setAttribute("issue-term", id);
    script.setAttribute("theme", "github-dark");
    script.setAttribute("crossorigin", "anonymous");
    script.async = true;
    utterancesContainer.appendChild(script);

  } catch (error) {
    modalTitle.textContent = "加载失败";
    modalContent.innerHTML = `<p style="color: #ef4444;">抱歉，文章加载出错了：${error.message}</p>`;
  }
};

window.closeArticle = function() {
  const modal = document.getElementById('article-modal');
  if (modal) {
    modal.style.display = 'none';
    modal.style.opacity = '0';
    modal.style.pointerEvents = 'none';
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
};

// Close Modal on Overlay Click
document.addEventListener('click', (e) => {
  const modal = document.getElementById('article-modal');
  if (e.target === modal) {
    window.closeArticle();
  }
});

// ESC Key to close Modal
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    window.closeArticle();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  // Bind click listeners to all read buttons and cards
  document.querySelectorAll('.blog-card').forEach(card => {
    card.addEventListener('click', function(e) {
      const articleId = this.getAttribute('data-article-id');
      if (articleId) {
        window.openArticle(articleId);
      }
    });
  });

  // Mobile Drawer Toggle Logic
  const mobileToggleBtn = document.getElementById('mobile-menu-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function toggleMobileDrawer(open) {
    if (!mobileDrawer || !mobileToggleBtn) return;
    const isOpen = open !== undefined ? open : !mobileDrawer.classList.contains('active');
    
    if (isOpen) {
      mobileDrawer.classList.add('active');
      mobileToggleBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
      document.body.style.overflow = 'hidden';
    } else {
      mobileDrawer.classList.remove('active');
      mobileToggleBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
      document.body.style.overflow = '';
    }
  }

  if (mobileToggleBtn) {
    mobileToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMobileDrawer();
    });
  }

  // Close Mobile Drawer when a link inside it is clicked
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleMobileDrawer(false);
    });
  });

  // Close Mobile Drawer when clicking backdrop
  if (mobileDrawer) {
    mobileDrawer.addEventListener('click', (e) => {
      if (e.target === mobileDrawer) {
        toggleMobileDrawer(false);
      }
    });
  }

  // Smooth Active Nav Highlighting on Scroll
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
});
