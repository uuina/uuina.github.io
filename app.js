/* ==========================================================================
   uuina.github.io - Interactive Application Script
   Handles: StyleSpec v2 Generator, Modal Article Reader (Non-confidential),
   Direct DOM Display Toggle, Scroll Highlighting
   ========================================================================== */

// Non-confidential Public Articles Data Store
const articlesData = {
  'ect-ecvt-research': {
    title: "过程层析成像 (ECT/ECVT) 技术概述与研究简述",
    content: `
      <h4>一、 研究背景</h4>
      <p>在能源、化工以及工业流体传输领域，管道内气液/气固等多相流体的实时分布检测至关重要。<strong>过程层析成像 (Process Tomography, PT)</strong> 技术作为一种先进的非接触式检测手段，能够在不干扰流体运动的前提下，获取管道内部截面及三维空间内的介质分布信息。</p>
      
      <h4>二、 技术优势</h4>
      <ul>
        <li><strong>非接触与无损检测</strong>：传感器贴附或环绕在管道外壁，无需侵入管道内部，保证流场原始状态。</li>
        <li><strong>高时间分辨率</strong>：响应速度极快，适用于捕捉高速暂态流型（如弹状流、泡状流等变化）。</li>
        <li><strong>安全与低成本</strong>：相比射线类层析成像（如 CT），电容层析成像无辐射风险，设备维护与运行成本更低。</li>
      </ul>

      <h4>三、 研究简要内容</h4>
      <p>本研究主要关注电容层析成像（ECT）与三维电容过程层析成像（ECVT）系统的基本原理应用与三维流型重构：</p>
      <ul>
        <li><strong>电容数据预处理</strong>：研究微弱电容信号的归一化与数据质量校验方法。</li>
        <li><strong>三维可视化与相分布分析</strong>：探索流型场的三维空间呈现，分析管道内相含率在不同工况下的演化趋势。</li>
      </ul>
    `
  },
  'mcp-guide': {
    title: "Model Context Protocol (MCP) 在科研辅助中的探索",
    content: `
      <h4>一、 背景介绍</h4>
      <p>Model Context Protocol (MCP) 是由 Anthropic 提出的开源协议，旨在为大语言模型（LLM）与本地开发工具、数据接口之间建立标准化的通信桥梁。</p>
      
      <h4>二、 技术优势</h4>
      <ul>
        <li><strong>标准化接口</strong>：统一的 Tool 与 Resource 协议规范。</li>
        <li><strong>本地安全受控</strong>：数据在本地完成解析，避免敏感信息外流。</li>
      </ul>

      <h4>三、 简要实践内容</h4>
      <p>尝试利用 Python 编写简易 MCP 服务端，协助完成本地学术图表格式校验与自动化数据整理。</p>
    `
  },
  'stylespec-v2': {
    title: "学术图表 StyleSpec v2 规范设计概要",
    content: `
      <h4>一、 背景介绍</h4>
      <p>不同学术期刊（如 IEEE、ACS 等）对论文插图有严格的尺寸、DPI 与字体规范。手动调整往往耗时耗力。</p>
      
      <h4>二、 技术优势</h4>
      <p>通过基于 JSON 的声明式规则，将排版要求参数化，确保输出的图表一次性满足期刊出版要求。</p>

      <h4>三、 简要内容</h4>
      <p>规范包含了常见的单双栏尺寸预设、色盲友好调色板选型以及矢量格式导出约束。</p>
    `
  }
};

// Global Article Modal Functions (Direct Inline Display Control for absolute reliability)
window.openArticle = function(id) {
  const article = articlesData[id];
  if (!article) {
    alert("文章加载中，请稍后再试");
    return;
  }

  const modal = document.getElementById('article-modal');
  const modalTitle = document.getElementById('modal-article-title');
  const modalContent = document.getElementById('modal-article-content');

  if (modal && modalTitle && modalContent) {
    modalTitle.textContent = article.title;
    modalContent.innerHTML = article.content;
    
    // Direct DOM display toggle
    modal.style.display = 'flex';
    modal.style.opacity = '1';
    modal.style.pointerEvents = 'auto';
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  } else {
    alert(article.title + "\n\n" + article.content.replace(/<[^>]+>/g, ''));
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

  // Elements for StyleSpec Generator
  const presetSelect = document.getElementById('preset-select');
  const typeSelect = document.getElementById('type-select');
  const paletteSelect = document.getElementById('palette-select');
  const fontSelect = document.getElementById('font-select');
  const xTitleInput = document.getElementById('x-title');
  const y1TitleInput = document.getElementById('y1-title');
  const jsonCodeBlock = document.getElementById('json-code-block');
  const btnCopyJson = document.getElementById('btn-copy-json');

  // Function to build and update StyleSpec JSON preview
  function updateStyleSpecPreview() {
    if (!presetSelect) return;

    const preset = presetSelect.value;
    const figureType = typeSelect.value;
    const palette = paletteSelect.value;
    const font = fontSelect.value;
    const xTitle = xTitleInput.value.trim() || 't (s)';
    const y1Title = y1TitleInput.value.trim() || 'F (N)';

    const isGrayscale = palette === 'grayscale';
    const activePalette = isGrayscale ? 'okabe-ito' : palette;

    const spec = {
      schema_version: "2.0",
      preset: preset,
      figure: {
        type: figureType,
        size_cm: [8.5, 6.5],
        color_mode: isGrayscale ? "grayscale" : "color",
        palette: activePalette
      },
      axes: {
        x: { title: xTitle, major_step: 5 },
        y: { title: y1Title, major_step: 1.0 }
      },
      plots: [
        { axis: "y", symbol: "circle", legend: "Exp. Data" },
        { axis: "y", line_style: "solid", width: 1.8, legend: "Fit Model" }
      ],
      fonts: { family: font, axis_title_pt: 10, tick_pt: 9 },
      export: { project: "opju", formats: ["png", "pdf"], dpi: 600 }
    };

    if (jsonCodeBlock) {
      jsonCodeBlock.textContent = JSON.stringify(spec, null, 2);
    }
  }

  // Event Listeners for Controls
  const inputs = [presetSelect, typeSelect, paletteSelect, fontSelect, xTitleInput, y1TitleInput];
  inputs.forEach(input => {
    if (input) {
      input.addEventListener('change', updateStyleSpecPreview);
      input.addEventListener('input', updateStyleSpecPreview);
    }
  });

  // Initial Spec Render
  updateStyleSpecPreview();

  // Copy JSON to Clipboard
  if (btnCopyJson && jsonCodeBlock) {
    btnCopyJson.addEventListener('click', () => {
      const textToCopy = jsonCodeBlock.textContent;
      navigator.clipboard.writeText(textToCopy).then(() => {
        const originalText = btnCopyJson.innerHTML;
        btnCopyJson.innerHTML = '<i class="fa-solid fa-check"></i> 已复制！';
        btnCopyJson.style.background = 'rgba(99, 102, 241, 0.2)';
        btnCopyJson.style.color = '#818cf8';
        
        setTimeout(() => {
          btnCopyJson.innerHTML = originalText;
          btnCopyJson.style.background = '';
          btnCopyJson.style.color = '';
        }, 2000);
      }).catch(err => {
        console.error('Failed to copy: ', err);
      });
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
