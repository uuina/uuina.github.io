/* ==========================================================================
   aspen.hnnilovey.me / uuina.space/aspen
   Interactive script for Tabs, Copy-to-Clipboard, Accordions, and Drawer
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Mobile drawer toggle
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      mobileDrawer.classList.toggle('active');
    });

    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('active');
      });
    });

    document.addEventListener('click', (e) => {
      if (mobileDrawer.classList.contains('active') && !mobileDrawer.contains(e.target) && e.target !== mobileToggle) {
        mobileDrawer.classList.remove('active');
      }
    });
  }

  // Tabs Switcher
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabTarget = btn.getAttribute('data-tab');
      const parentCard = btn.closest('.card') || document;

      parentCard.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      parentCard.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const targetContent = parentCard.querySelector(`#${tabTarget}`);
      if (targetContent) {
        targetContent.classList.add('active');
      }
    });
  });

  // Accordion Pitfalls
  const pitfallHeaders = document.querySelectorAll('.pitfall-header');
  pitfallHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.pitfall-item');
      item.classList.toggle('open');
    });
  });

  // Copy code buttons
  const copyBtns = document.querySelectorAll('.btn-copy-code');
  copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-copy-target');
      let textToCopy = '';
      if (targetId) {
        const targetEl = document.getElementById(targetId);
        textToCopy = targetEl ? targetEl.innerText.trim() : '';
      } else {
        const pre = btn.closest('.cmd-box')?.querySelector('pre');
        textToCopy = pre ? pre.innerText.trim() : '';
      }

      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast('已复制到剪贴板！');
          const originalText = btn.innerHTML;
          btn.innerHTML = '<i class="fa-solid fa-check"></i> 已复制';
          setTimeout(() => {
            btn.innerHTML = originalText;
          }, 2000);
        }).catch(err => {
          console.error('复制失败:', err);
          showToast('复制失败，请手动选取复制');
        });
      }
    });
  });

  // Copy AI Prompt
  const copyPromptBtns = document.querySelectorAll('.btn-copy-prompt');
  copyPromptBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const promptEl = document.getElementById('ai-agent-prompt-text');
      if (promptEl) {
        const text = promptEl.innerText.trim();
        navigator.clipboard.writeText(text).then(() => {
          showToast('🎉 AI Agent 提示词已成功复制！可直接发送给 AI');
          const originalHtml = btn.innerHTML;
          btn.innerHTML = '<i class="fa-solid fa-check"></i> 已复制到剪贴板！';
          setTimeout(() => {
            btn.innerHTML = originalHtml;
          }, 2500);
        }).catch(err => {
          console.error('复制失败:', err);
          showToast('复制失败，请手动选中文本复制');
        });
      }
    });
  });
});

// Toast notification helper
function showToast(message) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span id="toast-msg"></span>`;
    document.body.appendChild(toast);
  }

  const msgSpan = document.getElementById('toast-msg');
  if (msgSpan) msgSpan.textContent = message;

  toast.classList.add('show');
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}
