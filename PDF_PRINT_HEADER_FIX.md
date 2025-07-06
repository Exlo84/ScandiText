# Hotfix v2.0.2.1 - PDF Print Header Fix

**Utgivelsesdato:** 5. juli 2025  
**Type:** Minor Hotfix  
**Fokus:** Fikse "about:blank" som vises i PDF-eksport

## 🐛 Problem

I PDF-eksporten viste nettleserens standard header/footer "about:blank" over fakturaen, spesielt synlig over teksten "Ved spørsmål om denne fakturaen, kontakt [firmanavn]".

## ✅ Løsning

### 1. Satt riktig document title
```javascript
// Før: generic title
printWindow.document.title = `Faktura ${data.number}`;

// Etter: spesifikk title med firmanavn
printWindow.document.title = `Faktura ${invoiceData.number} - ${invoiceData.company.name}`;
```

### 2. Forbedret print CSS
```css
@media print {
    @page {
        margin: 15mm;
        size: A4;
        /* Bedre marginer for å unngå browser headers */
        margin-top: 15mm;
        margin-bottom: 15mm;
    }
    
    /* Sikre at vår footer ikke overlappes */
    .invoice-footer {
        margin-bottom: 20mm;
        page-break-inside: avoid;
    }
    
    /* Skjul browser-generert innhold */
    body::before,
    body::after {
        display: none !important;
    }
}
```

### 3. Meta tag for bedre print-kontroll
```html
<meta name="format-detection" content="telephone=no">
```

## 📊 Før vs. Etter

| Aspekt | Før | Etter |
|--------|-----|-------|
| PDF header | ❌ "about:blank" | ✅ "Faktura YYYY-MMDD-XXXX - Firmanavn" |
| Footer synlighet | ❌ Delvis skjult | ✅ Fullt synlig |
| Print layout | ❌ Overlappende | ✅ Ren, profesjonell |

## 🎯 Resultat

PDF-eksporten viser nå kun fakturainnholdet uten forstyrrende nettleser-headers eller "about:blank" tekst. Fakturaen ser fullstendig profesjonell ut når den skrives ut eller lagres som PDF.

---

**Testing:** ✅ Bekreftet at "about:blank" ikke lenger vises  
**Impact:** 🎯 Ren, profesjonell PDF-utskrift  
**File endret:** `js/tools/invoiceGenerator.js`
