/* ==========================================================================
   uuina.github.io - Interactive Application Script
   Handles: StyleSpec v2 Live Generator, Clipboard Copy, Counter Animations
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Elements for StyleSpec Generator
  const presetSelect = document.getElementById('preset-select');
  const typeSelect = document.getElementById('type-select');
  const paletteSelect = document.getElementById('palette-select');
  const fontSelect = document.getElementById('font-select');
  const xTitleInput = document.getElementById('x-title');
  const y1TitleInput = document.getElementById('y1-title');
  const y2TitleInput = document.getElementById('y2-title');
  const jsonCodeBlock = document.getElementById('json-code-block');
  const btnCopyJson = document.getElementById('btn-copy-json');

  // Function to build and update StyleSpec JSON preview
  function updateStyleSpecPreview() {
    const preset = presetSelect.value;
    const figureType = typeSelect.value;
    const palette = paletteSelect.value;
    const font = fontSelect.value;
    const xTitle = xTitleInput.value.trim() || 't (s)';
    const y1Title = y1TitleInput.value.trim() || 'F (N)';
    const y2Title = y2TitleInput.value.trim() || 'T (°C)';

    const isGrayscale = palette === 'grayscale';
    const activePalette = isGrayscale ? 'okabe-ito' : palette;

    const spec = {
      schema_version: "2.0",
      preset: preset,
      figure: {
        type: figureType,
        size_cm: [9.5, 7.0],
        color_mode: isGrayscale ? "grayscale" : "color",
        palette: activePalette
      },
      axes: {
        x: { title: xTitle, major_step: 5, grid: "none" },
        y: { title: y1Title, major_step: 1.0, grid: "none" }
      },
      plots: [
        { axis: "y", symbol: "circle", legend: "Exp. Data" },
        { axis: "y", line_style: "solid", width: 1.8, legend: "Fit Model" }
      ],
      legend: { visible: true, position: "inside-tr", frame: false },
      fonts: { family: font, axis_title_pt: 10.5, tick_pt: 9.5 },
      export: { project: "opju", formats: ["png", "pdf", "emf"], dpi: 600 }
    };

    if (figureType === 'double_y') {
      spec.axes.y2 = { title: y2Title, major_step: 1.0, grid: "none" };
      spec.plots.push({
        axis: "y2",
        line_style: "dash",
        width: 1.8,
        legend: "Secondary Response"
      });
    }

    jsonCodeBlock.textContent = JSON.stringify(spec, null, 2);
  }

  // Event Listeners for Controls
  const inputs = [presetSelect, typeSelect, paletteSelect, fontSelect, xTitleInput, y1TitleInput, y2TitleInput];
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
        btnCopyJson.style.background = 'rgba(16, 185, 129, 0.25)';
        btnCopyJson.style.color = '#10b981';
        
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
