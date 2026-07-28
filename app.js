/* ==========================================================================
   uuina.github.io - Interactive Application Script
   Handles: StyleSpec v2 Generator, Modal Article Reader, Scroll Highlighting
   ========================================================================== */

// Articles Data Store
const articlesData = {
  'mcp-guide': {
    title: "从零了解 Model Context Protocol (MCP) 在科研中的应用",
    content: `
      <p>Model Context Protocol (MCP) 是由 Anthropic 提出的开源标准协议，旨在大模型（LLM）与本地数据、工具和系统之间建立安全、标准化的双向通信通道。</p>
      
      <h4>为什么科研学习者需要 MCP？</h4>
      <p>在传统的科研工作中，大模型虽然聪明，但“手脚受限”——它无法直接读取你的本地数据文件，也无法直接调用 OriginLab 画图或操控本地仿真工具。</p>
      <p>通过编写简单的 Python MCP 服务端（Server），我们可以将以下功能包装为 Tool 暴露给大模型：</p>
      <ul>
        <li><code>read_worksheet</code>：直接读取实验测得的数据表格。</li>
        <li><code>create_graph</code>：传入 StyleSpec JSON 规范在本地 OriginLab 中绘制 600 DPI 出版矢量图。</li>
        <li><code>fit_curve</code>：自动进行多项式拟合或动力学方程拟合。</li>
      </ul>

      <h4>核心架构示意</h4>
      <p><code>Claude/ChatGPT Client <---> MCP Protocol <---> Local Python Server <---> OriginLab / Datasets</code></p>
      
      <p>这种架构极大释放了 AI 的生产力，将重复画图与格式微调的时间缩短了 90% 以上。</p>
    `
  },
  'stylespec-v2': {
    title: "出版级 Origin 科研图表 StyleSpec v2 规范设计",
    content: `
      <p>学术期刊（如 IEEE Transactions、Nature、ACS 等）对论文图表有极其严格的格式规定，包括单双栏尺寸限制（IEEE 单栏 8.5cm）、字体族、线条粗细及色彩对比度。</p>
      
      <h4>StyleSpec v2 的设计理念</h4>
      <p>StyleSpec v2 是一种基于 JSON 的领域专用配置规范（DSL）。它的核心目的是让自然语言或者 AI Agent 的输出拥有确定的、百分之百可预测的样式。</p>
      
      <pre><code>{
  "schema_version": "2.0",
  "preset": "ieee_standard",
  "figure": { "size_cm": [8.5, 6.5], "dpi": 600 },
  "axes": { "x": { "title": "Time t (s)" }, "y": { "title": "Voltage (V)" } }
}</code></pre>
      
      <h4>关键规则规范：</h4>
      <ul>
        <li><strong>色盲友好配色</strong>：默认选用 Okabe-Ito 配色，避免纯红纯绿对比。</li>
        <li><strong>字体收敛</strong>：主标题与刻度字体收敛至 Arial 或 Times New Roman。</li>
        <li><strong>矢量可编辑导出</strong>：直接生成 OPJU 原生工程，方便后续微调。</li>
      </ul>
    `
  },
  'cloudflare-pages': {
    title: "学生党免费建站指南：GitHub Pages + Cloudflare Pages 架构避坑",
    content: `
      <p>作为学生或者独立开发者，搭建个人主页和博客最理想的状态是：<strong>零成本、速度快、维护简单、域名逼格高</strong>。</p>
      
      <h4>架构设计（全免费方案）</h4>
      <ul>
        <li><strong>代码托管</strong>：GitHub 仓库（版本控制 + 开源）。</li>
        <li><strong>全球 CDN 静态托管</strong>：Cloudflare Pages（无限带宽、无限请求、全球加速）。</li>
        <li><strong>自定义域名</strong>：通过 DNS 绑定个人域名（如 <code>hnnilovey.me</code>）。</li>
      </ul>
      
      <h4>踩坑经验总结：Host Error 522 怎么破？</h4>
      <p>在绑定自定义域名时，很容易遇到 Cloudflare 抛出 522 超时错误。根本原因通常有两个：</p>
      <ol>
        <li>DNS 记录里残留了占位测试 IP（如 <code>192.0.2.1</code>）。把 A 记录删掉，改为指向 <code>your-app.pages.dev</code> 的 <strong>CNAME 记录</strong>。</li>
        <li>Cloudflare 会提示“CNAME 记录不能位于区域顶级”，直接确认即可，这就是 Cloudflare 强大的 <strong>CNAME Flattening（CNAME 拉平）</strong> 黑科技。</li>
      </ol>
    `
  }
};

// Global Article Modal Functions
function openArticle(id) {
  const article = articlesData[id];
  if (!article) return;

  const modal = document.getElementById('article-modal');
  const modalTitle = document.getElementById('modal-article-title');
  const modalContent = document.getElementById('modal-article-content');

  modalTitle.textContent = article.title;
  modalContent.innerHTML = article.content;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeArticle() {
  const modal = document.getElementById('article-modal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

// Close Modal on Overlay Click
document.addEventListener('click', (e) => {
  const modal = document.getElementById('article-modal');
  if (e.target === modal) {
    closeArticle();
  }
});

// ESC Key to close Modal
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeArticle();
  }
});

document.addEventListener('DOMContentLoaded', () => {
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

    jsonCodeBlock.textContent = JSON.stringify(spec, null, 2);
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
  if (btnCopyJson) {
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
