import jsPDF from 'jspdf';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core';
import { categories } from './appUtils';

// --- Modern Design Constants ---
const COLORS = {
  primary: [79, 70, 229],    // Indigo 600
  secondary: [16, 185, 129], // Emerald 500
  danger: [239, 68, 68],     // Red 500
  textDark: [15, 23, 42],    // Slate 900
  textLight: [100, 116, 139],// Slate 500
  bgLight: [248, 250, 252],  // Slate 50
  white: [255, 255, 255],
  divider: [226, 232, 240]   // Slate 200
};

// Helper: Fix currency symbols for PDF
const getSafeCurrency = (symbol) => {
  if (!symbol) return '$';
  const map = { '₹': 'Rs.', '€': 'EUR', '£': 'GBP', '¥': 'JPY' };
  return map[symbol] || symbol; 
};

export const generateTripReport = async (trip, expenses) => {
  try {
    if (!trip || !expenses) throw new Error("Missing trip data");

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let y = 0; 

    const currency = getSafeCurrency(trip.currency);
    const totalSpent = expenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
    const budget = Number(trip.budget) || 0;
    const remaining = budget - totalSpent;

    // --- Helpers ---
    const checkPageBreak = (heightNeeded) => {
      if (y + heightNeeded > pageHeight - margin) {
        doc.addPage();
        y = 20; 
        return true;
      }
      return false;
    };

    const drawSectionHeader = (title) => {
      checkPageBreak(15);
      y += 5;
      doc.setFontSize(11);
      doc.setTextColor(...COLORS.textLight);
      doc.setFont('helvetica', 'bold');
      doc.text(title.toUpperCase(), margin, y);
      
      doc.setDrawColor(...COLORS.divider);
      doc.setLineWidth(0.5);
      doc.line(margin, y + 3, pageWidth - margin, y + 3);
      y += 12;
    };

    // --- 1. HERO HEADER ---
    doc.setFillColor(...COLORS.primary);
    doc.rect(0, 0, pageWidth, 50, 'F');
    
    doc.setFontSize(26);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text(trip.name || 'Trip Report', margin, 25);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(226, 232, 240); 
    const dateStr = trip.startDate ? new Date(trip.startDate).toLocaleDateString() : 'Date N/A';
    doc.text(`${dateStr} • ${trip.duration || 1} Days`, margin, 33);

    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    const totalTxt = `Total: ${currency}${totalSpent.toLocaleString()}`;
    const txtWidth = doc.getTextWidth(totalTxt);
    doc.text(totalTxt, pageWidth - margin - txtWidth, 30);

    y = 65; 

    // --- 2. SUMMARY CARDS ---
    const cardWidth = (pageWidth - (margin * 2) - 10) / 3;
    const cardHeight = 25;
    
    const drawCard = (x, label, value, color) => {
      doc.setFillColor(...COLORS.bgLight);
      doc.setDrawColor(...COLORS.divider);
      doc.roundedRect(x, y, cardWidth, cardHeight, 3, 3, 'FD');
      
      doc.setFontSize(8);
      doc.setTextColor(...COLORS.textLight);
      doc.setFont('helvetica', 'bold');
      doc.text(label.toUpperCase(), x + 5, y + 8);
      
      doc.setFontSize(12);
      doc.setTextColor(...color);
      doc.text(value, x + 5, y + 18);
    };

    drawCard(margin, 'Total Spent', `${currency}${totalSpent.toLocaleString()}`, COLORS.textDark);
    drawCard(margin + cardWidth + 5, 'Budget', `${currency}${budget.toLocaleString()}`, COLORS.textDark);
    drawCard(margin + (cardWidth + 5) * 2, 'Remaining', `${currency}${remaining.toLocaleString()}`, remaining < 0 ? COLORS.danger : COLORS.secondary);
    
    y += cardHeight + 15;

    // --- 3. SPENDING ANALYSIS ---
    drawSectionHeader("Spending Breakdown");
    
    const catStats = categories.map(cat => {
        const total = expenses.filter(e => e.category === cat).reduce((s, i) => s + (parseFloat(i.amount)||0), 0);
        return { name: cat, total };
    }).filter(c => c.total > 0).sort((a, b) => b.total - a.total);

    catStats.forEach(cat => {
        checkPageBreak(12);
        const percent = totalSpent > 0 ? cat.total / totalSpent : 0;
        
        doc.setFontSize(10);
        doc.setTextColor(...COLORS.textDark);
        doc.setFont('helvetica', 'normal');
        doc.text(cat.name, margin, y + 3);
        
        doc.setFont('helvetica', 'bold');
        doc.text(`${currency}${cat.total.toLocaleString()}`, pageWidth - margin, y + 3, { align: 'right' });
        
        y += 5;
        doc.setFillColor(...COLORS.bgLight);
        doc.roundedRect(margin, y, pageWidth - (margin * 2), 4, 1, 1, 'F');
        
        const barMaxW = pageWidth - (margin * 2);
        const barW = barMaxW * percent;
        
        if (cat.name === 'Food') doc.setFillColor(249, 115, 22); 
        else if (cat.name === 'Transport') doc.setFillColor(59, 130, 246); 
        else if (cat.name === 'Accommodation') doc.setFillColor(99, 102, 241); 
        else if (cat.name === 'Shopping') doc.setFillColor(234, 179, 8); 
        else doc.setFillColor(...COLORS.textLight); 
        
        doc.roundedRect(margin, y, barW, 4, 1, 1, 'F');
        y += 10;
    });

    if(catStats.length === 0) {
       doc.setFontSize(10);
       doc.setTextColor(...COLORS.textLight);
       doc.text("No data to display.", margin, y + 5);
       y += 10;
    }

    y += 5;

    // --- 4. DETAILED TRANSACTIONS ---
    drawSectionHeader("Transaction History");

    doc.setFillColor(...COLORS.bgLight);
    doc.rect(margin, y, pageWidth - (margin * 2), 10, 'F');
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.textLight);
    doc.setFont('helvetica', 'bold');
    doc.text("DATE", margin + 4, y + 7);
    doc.text("CATEGORY", margin + 35, y + 7);
    doc.text("DESCRIPTION", margin + 80, y + 7);
    doc.text("AMOUNT", pageWidth - margin - 4, y + 7, { align: 'right' });
    y += 10;

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.textDark);

    expenses.forEach((exp, i) => {
      checkPageBreak(10);
      
      if (i % 2 !== 0) {
         doc.setFillColor(252, 252, 253); 
         doc.rect(margin, y, pageWidth - (margin * 2), 8, 'F');
      }

      doc.text(exp.date || '-', margin + 4, y + 5);
      doc.text(String(exp.category).substring(0, 15), margin + 35, y + 5);
      
      let desc = exp.description || '-';
      if (desc.length > 35) desc = desc.substring(0, 32) + '...';
      doc.text(desc, margin + 80, y + 5);
      
      doc.setFont('helvetica', 'bold');
      doc.text(`${currency}${Number(exp.amount).toLocaleString()}`, pageWidth - margin - 4, y + 5, { align: 'right' });
      doc.setFont('helvetica', 'normal');

      doc.setDrawColor(241, 245, 249);
      doc.line(margin, y + 8, pageWidth - margin, y + 8);
      
      y += 8;
    });

    // --- 5. FOOTER ---
    const pageCount = doc.internal.getNumberOfPages();
    for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(...COLORS.textLight);
        doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
        doc.text(`Generated by TripTracker`, margin, pageHeight - 10);
    }

    // --- 6. SAVE & SHARE ---
    const fileName = `${(trip.name || 'trip').replace(/[^a-z0-9]/gi, '_')}_Report.pdf`;

    if (Capacitor.isNativePlatform()) {
        const pdfOutput = doc.output('datauristring');
        const base64 = pdfOutput.split(',')[1];
        
        // Use Cache directory (safest for sharing)
        const path = await Filesystem.writeFile({
            path: fileName,
            data: base64,
            directory: Directory.Cache, 
        });
        
        const uriResult = await Filesystem.getUri({
            directory: Directory.Cache,
            path: fileName
        });
        
        await Share.share({
            title: `Report: ${trip.name}`,
            url: uriResult.uri,
            dialogTitle: 'Share PDF Report'
        });
        return true;
    } else {
        doc.save(fileName);
        return true;
    }

  } catch (err) {
    console.error("PDF Error:", err);
    // Only alert on native to avoid disrupting web flow too much
    if(Capacitor.isNativePlatform()) alert("PDF Error: " + err.message);
    return false;
  }
};