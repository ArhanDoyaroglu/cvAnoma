const $ = (id) => document.getElementById(id);

function setTextSync(inputId, previewId, transform = (v) => v) {
  const input = $(inputId);
  const preview = $(previewId);
  const update = () => {
    const value = input.value.trim();
    preview.textContent = value ? transform(value) : preview.dataset.placeholder || preview.textContent;
  };
  input.addEventListener('input', update);
  update();
}

function loadImageTo(imgInputId, imgPreviewId) {
  const input = $(imgInputId);
  const img = $(imgPreviewId);
  const container = img.parentElement;
  const placeholder = container.querySelector('.placeholder');
  
  input.addEventListener('change', () => {
    const file = input.files && input.files[0];
    if (!file) {
      img.style.display = 'none';
      placeholder.style.display = 'block';
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => { 
      img.src = e.target.result; 
      img.style.display = 'block';
      placeholder.style.display = 'none';
    };
    reader.readAsDataURL(file);
  });
}

// Initialize text bindings
setTextSync('discordInput', 'discordPreview', (v) => v ? `Discord: ${v}` : 'discord');
setTextSync('xInput', 'xPreview', (v) => v ? `X: ${v}` : 'x');
setTextSync('reasonInput', 'reasonPreview');

// Initialize image bindings
loadImageTo('ssProfile', 'imgProfile');
loadImageTo('ssMessages', 'imgMessages');
loadImageTo('ssRank', 'imgRank');
// Special: multiple X posts -> gallery
(() => {
  const input = $('ssX');
  const gallery = document.getElementById('xGallery');
  input.addEventListener('change', () => {
    gallery.innerHTML = '';
    const files = Array.from(input.files || []);
    if (files.length === 0) {
      gallery.innerHTML = '<div class="placeholder">No images uploaded</div>';
      return;
    }
    files.slice(0, 100).forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement('img');
        img.src = e.target.result;
        img.alt = 'X post';
        gallery.appendChild(img);
      };
      reader.readAsDataURL(file);
    });
  });
})();
loadImageTo('ssRoles', 'imgRoles');



// Download button
$('downloadBtn').addEventListener('click', async () => {
  const node = $('cvCard');
  const canvas = await html2canvas(node, {
    backgroundColor: '#0f1625',
    scale: Math.min(3, window.devicePixelRatio * 2),
    useCORS: true,
    windowWidth: document.documentElement.scrollWidth,
    windowHeight: node.scrollHeight
  });
  const link = document.createElement('a');
  link.download = `anoma-fan-cv-${Date.now()}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
});


