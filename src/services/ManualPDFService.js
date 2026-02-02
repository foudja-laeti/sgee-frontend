// src/services/ManualPDFService.js
import jsPDF from 'jspdf';

class ManualPDFService {
  
  /**
   * Générer un PDF du manuel complet
   */
  generatePDF(manual) {
    try {
      const doc = new jsPDF();
      let yPosition = 20;
      const pageHeight = doc.internal.pageSize.height;
      const margin = 20;
      const lineHeight = 7;

      // ✅ Page de garde
      doc.setFontSize(24);
      doc.setFont(undefined, 'bold');
      doc.text(manual.title || 'Manuel d\'utilisation', margin, yPosition);
      
      yPosition += 15;
      doc.setFontSize(12);
      doc.setFont(undefined, 'normal');
      doc.text(manual.description || 'Guide complet', margin, yPosition);
      
      yPosition += 10;
      doc.setFontSize(10);
      const currentDate = new Date().toLocaleDateString('fr-FR');
      doc.text(`Généré le ${currentDate}`, margin, yPosition);
      
      // ✅ Nouvelle page pour le contenu
      doc.addPage();
      yPosition = 20;

      // ✅ Table des matières
      doc.setFontSize(18);
      doc.setFont(undefined, 'bold');
      doc.text('Table des matières', margin, yPosition);
      yPosition += 15;

      doc.setFontSize(12);
      doc.setFont(undefined, 'normal');
      
      if (manual.sections && Array.isArray(manual.sections)) {
        manual.sections.forEach((section) => {
          if (yPosition > pageHeight - 30) {
            doc.addPage();
            yPosition = 20;
          }
          doc.text(`${section.icon || ''} ${section.title}`, margin + 5, yPosition);
          yPosition += lineHeight;
        });
      }

      // ✅ Sections détaillées
      if (manual.sections && Array.isArray(manual.sections)) {
        manual.sections.forEach((section) => {
          doc.addPage();
          yPosition = 20;

          // Titre de section
          doc.setFontSize(16);
          doc.setFont(undefined, 'bold');
          doc.text(`${section.icon || ''} ${section.title}`, margin, yPosition);
          yPosition += 12;

          // Contenu de la section
          if (section.content && Array.isArray(section.content)) {
            section.content.forEach((item) => {
              if (yPosition > pageHeight - 40) {
                doc.addPage();
                yPosition = 20;
              }

              // Titre de l'étape
              doc.setFontSize(14);
              doc.setFont(undefined, 'bold');
              doc.text(`${item.step || ''} - ${item.title || ''}`, margin, yPosition);
              yPosition += 10;

              // Description
              doc.setFontSize(11);
              doc.setFont(undefined, 'normal');
              const descLines = doc.splitTextToSize(item.description || '', 170);
              doc.text(descLines, margin, yPosition);
              yPosition += descLines.length * lineHeight;

              // Détails
              if (item.details && Array.isArray(item.details) && item.details.length > 0) {
                yPosition += 5;
                doc.setFontSize(10);
                
                item.details.forEach((detail) => {
                  if (yPosition > pageHeight - 20) {
                    doc.addPage();
                    yPosition = 20;
                  }
                  
                  const detailLines = doc.splitTextToSize(`• ${detail}`, 165);
                  doc.text(detailLines, margin + 5, yPosition);
                  yPosition += detailLines.length * 6;
                });
              }

              yPosition += 10;
            });
          }
        });
      }

      // ✅ Sauvegarder avec nom sécurisé
      const role = manual.role || 'manuel';
      const date = new Date().toISOString().split('T')[0];
      const fileName = `${role}_manuel_${date}.pdf`;
      
      doc.save(fileName);
      
      console.log('✅ PDF généré avec succès:', fileName);
      return { success: true, fileName };
      
    } catch (error) {
      console.error('❌ Erreur génération PDF:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Générer un PDF d'une section spécifique
   */
  generateSectionPDF(section, manualTitle = 'Manuel') {
    try {
      const doc = new jsPDF();
      let yPosition = 20;
      const pageHeight = doc.internal.pageSize.height;
      const margin = 20;

      // Titre
      doc.setFontSize(18);
      doc.setFont(undefined, 'bold');
      doc.text(`${section.icon || ''} ${section.title}`, margin, yPosition);
      yPosition += 15;

      // Contenu
      if (section.content && Array.isArray(section.content)) {
        section.content.forEach((item) => {
          if (yPosition > pageHeight - 40) {
            doc.addPage();
            yPosition = 20;
          }

          doc.setFontSize(14);
          doc.setFont(undefined, 'bold');
          doc.text(`${item.step || ''} - ${item.title || ''}`, margin, yPosition);
          yPosition += 10;

          doc.setFontSize(11);
          doc.setFont(undefined, 'normal');
          const descLines = doc.splitTextToSize(item.description || '', 170);
          doc.text(descLines, margin, yPosition);
          yPosition += descLines.length * 7 + 5;

          if (item.details && Array.isArray(item.details)) {
            doc.setFontSize(10);
            item.details.forEach((detail) => {
              if (yPosition > pageHeight - 20) {
                doc.addPage();
                yPosition = 20;
              }
              const detailLines = doc.splitTextToSize(`• ${detail}`, 165);
              doc.text(detailLines, margin + 5, yPosition);
              yPosition += detailLines.length * 6;
            });
          }

          yPosition += 10;
        });
      }

      const fileName = `section_${section.id || 'section'}.pdf`;
      doc.save(fileName);
      
      console.log('✅ Section PDF générée:', fileName);
      return { success: true, fileName };
      
    } catch (error) {
      console.error('❌ Erreur génération section PDF:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * ✅ NOUVELLE : Générer PDF du flowchart d'inscription
   */
  generateEnrollementFlowchartPDF(flowchartData, flowchartsASCII) {
    try {
      const doc = new jsPDF();
      let yPosition = 20;
      const pageHeight = doc.internal.pageSize.height;
      const margin = 20;

      // Page de garde
      doc.setFontSize(24);
      doc.setFont(undefined, 'bold');
      doc.text(flowchartData.title || 'Flowchart Inscription', margin, yPosition);
      
      yPosition += 15;
      doc.setFontSize(12);
      doc.setFont(undefined, 'normal');
      doc.text(flowchartData.description || '', margin, yPosition);
      
      yPosition += 10;
      doc.setFontSize(10);
      doc.text(`Durée estimée: ${flowchartData.estimatedTime || '15-20 min'}`, margin, yPosition);

      // Parcourir les sections
      if (flowchartData.sections && Array.isArray(flowchartData.sections)) {
        flowchartData.sections.forEach((section) => {
          doc.addPage();
          yPosition = 20;

          // Titre section
          doc.setFontSize(18);
          doc.setFont(undefined, 'bold');
          doc.text(`${section.icon || ''} ${section.title}`, margin, yPosition);
          yPosition += 15;

          // Flowchart ASCII si disponible
          if (section.flowchart && flowchartsASCII && flowchartsASCII[section.flowchart]) {
            doc.setFontSize(9);
            doc.setFont('courier', 'normal');
            const flowchartLines = flowchartsASCII[section.flowchart].split('\n');
            
            flowchartLines.forEach(line => {
              if (yPosition > pageHeight - 20) {
                doc.addPage();
                yPosition = 20;
              }
              doc.text(line, margin, yPosition);
              yPosition += 5;
            });
            
            yPosition += 10;
          }

          // Contenu détaillé
          if (section.content && Array.isArray(section.content)) {
            section.content.forEach((item) => {
              if (yPosition > pageHeight - 40) {
                doc.addPage();
                yPosition = 20;
              }

              doc.setFontSize(12);
              doc.setFont(undefined, 'bold');
              doc.text(`${item.step} - ${item.title}`, margin, yPosition);
              yPosition += 8;

              doc.setFontSize(10);
              doc.setFont(undefined, 'normal');
              const descLines = doc.splitTextToSize(item.description, 170);
              doc.text(descLines, margin, yPosition);
              yPosition += descLines.length * 6 + 5;

              if (item.details && Array.isArray(item.details)) {
                item.details.forEach(detail => {
                  if (yPosition > pageHeight - 20) {
                    doc.addPage();
                    yPosition = 20;
                  }
                  const detailLines = doc.splitTextToSize(`• ${detail}`, 165);
                  doc.text(detailLines, margin + 5, yPosition);
                  yPosition += detailLines.length * 5;
                });
              }

              yPosition += 8;
            });
          }
        });
      }

      const fileName = `flowchart_inscription_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      
      console.log('✅ Flowchart PDF généré:', fileName);
      return { success: true, fileName };
      
    } catch (error) {
      console.error('❌ Erreur génération flowchart PDF:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new ManualPDFService();