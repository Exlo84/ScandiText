# Hotfix for ScandiText v2.0.0 - PDF Export

## 🐛 Bug Fix: PDF-eksport feil fikset

### Problem
Fakturagenerator PDF-eksport feilet med error:
```
Cannot read properties of null (reading 'words')
```

### Løsning
1. **InvoiceGenerator.js**: Opprettet mock stats-objekt i stedet for å sende `null`
2. **ExportUtils.js**: Lagt til null-sjekk og fallback stats-objekt i `exportToPdf()`

### Endringer
- ✅ PDF-eksport fungerer nå korrekt for fakturaer
- ✅ Robust feilhåndtering for manglende statistikk-data
- ✅ Fallback til print-dialog hvis moderne PDF-API ikke er tilgjengelig

### Tekniske detaljer
```javascript
// InvoiceGenerator sender nå gyldig stats-objekt
const mockStats = {
    words: invoiceData.items.length,
    characters: htmlContent.length,
    sentences: 1,
    paragraphs: 1,
    readingTime: '1 min'
};

// ExportUtils har null-sjekk
stats = stats || {
    words: 0,
    characters: text ? text.length : 0,
    sentences: 0,
    paragraphs: 0
};
```

Denne hotfixen sikrer at alle eksport-funksjoner fungerer stabilt på tvers av verktøysuite.
