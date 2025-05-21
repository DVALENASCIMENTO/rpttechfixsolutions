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

  import('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js').then(() => {
    import('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js').then(() => {
      const { jsPDF } = window.jspdf;

      html2canvas(main, {
        scale: 2, // melhora a resolução
        useCORS: true,
        scrollY: -window.scrollY // corrige posição da rolagem
      }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');

        const pageWidth = 210; // A4
        const pageHeight = 297; // A4
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
      });
    });
  });
}
