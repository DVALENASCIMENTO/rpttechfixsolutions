function salvar() {
  alert('Relatório salvo localmente (simulado).');
}

function previewImagem(inputId, previewId) {
  const input = document.getElementById(inputId);
  const preview = document.getElementById(previewId);
  input.addEventListener('change', () => {
    const file = input.files[0];
    preview.innerHTML = '';
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        const img = document.createElement('img');
        img.src = e.target.result;
        preview.appendChild(img);
      };
      reader.readAsDataURL(file);
    }
  });
}

previewImagem('imgDownload', 'previewDownload');
previewImagem('imgVerificacao', 'previewVerificacao');
previewImagem('imgPendrive', 'previewPendrive');
previewImagem('assinaturaUpload', 'assinaturaPreview');

function exportarPDF() {
  const main = document.querySelector('main');
  
  // Clona o conteúdo do main
  const clone = main.cloneNode(true);

  // Substitui todos os <textarea> por <pre> com o conteúdo formatado
  clone.querySelectorAll('textarea').forEach(textarea => {
    const pre = document.createElement('pre');
    pre.style.whiteSpace = 'pre-wrap';
    pre.style.border = '1px solid #ccc';
    pre.style.padding = '4px';
    pre.style.minHeight = textarea.offsetHeight + 'px';
    pre.style.width = textarea.offsetWidth + 'px';
    pre.textContent = textarea.value;
    textarea.parentNode.replaceChild(pre, textarea);
  });

  // Cria um contêiner invisível para renderizar
  const hiddenContainer = document.createElement('div');
  hiddenContainer.style.position = 'fixed';
  hiddenContainer.style.left = '-9999px';
  hiddenContainer.appendChild(clone);
  document.body.appendChild(hiddenContainer);

  import('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js').then(() => {
    import('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js').then(() => {
      const { jsPDF } = window.jspdf;

      html2canvas(clone, {
        scale: 2,
        useCORS: true,
        scrollY: -window.scrollY
      }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');

        const pageWidth = 210;
        const pageHeight = 297;
        const imgWidth = pageWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        let position = 0;
        let heightLeft = imgHeight;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);

        while (heightLeft > pageHeight) {
          position -= pageHeight;
          heightLeft -= pageHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        }

        pdf.save('relatorio_tecnico.pdf');

        // Limpa o clone oculto após salvar
        document.body.removeChild(hiddenContainer);
      });
    });
  });
}
