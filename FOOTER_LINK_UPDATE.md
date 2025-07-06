# Hotfix v2.0.2.2 - Footer Link og Print Method

**Utgivelsesdato:** 5. juli 2025  
**Type:** Minor Update  
**Fokus:** Lagt til website link og forenklet print-metode

## ✨ Nye endringer

### 1. Lagt til website link i footer
**Både i forhåndsvisning og PDF:**
```
Faktura generert med Nordisk Verktøysuite
https://nordisk.exlo.no/
```

**Implementering:**
- Link lagt til under eksisterende "Faktura generert med..." tekst
- Konsistent styling mellom forhåndsvisning og PDF
- Klikkbar link med blå farge (#2563eb)
- Mindre font-størrelse (9-11pt) for diskret visning

### 2. Gikk tilbake til enkel window.open metode
**Problem:** Blob URL viste "blob:http://0.0.0.0:8080/uuid" i browser header  
**Løsning:** Bruker igjen window.open('', '_blank') som er mest forutsigbar

**Endring:**
```javascript
// Før: Blob URL (viste lange blob-adresser)
const blob = new Blob([htmlContent], { type: 'text/html' });
const url = URL.createObjectURL(blob);
const printWindow = window.open(url, '_blank');

// Etter: Enkel window.open (viser "about:blank")
const printWindow = window.open('', '_blank');
printWindow.document.write(htmlContent);
```

### 3. Oppdatert bruker-instruksjoner
**Ny toast-melding:**
```
"Faktura-vindu åpnet! For ren PDF: Ctrl+P → Mer innstillinger → Fjern 'Headers and footers'"
```

**Kortere og tydeligere instruksjon for å fjerne browser headers.**

## 📊 Sammenligning

| Element | Før | Etter |
|---------|-----|-------|
| Browser header | `blob:http://...uuid` | `about:blank` |
| Footer content | Kun "Faktura generert..." | + website link |
| Bruker-instruksjoner | Lang forklaring | Kort, tydelig instruksjon |
| Print metode | Blob URL | window.open (enklere) |

## 🎯 Resultat

### Footer ser nå slik ut:
```
Ved spørsmål om denne fakturaen, kontakt [Firmanavn]

Faktura generert med Nordisk Verktøysuite
https://nordisk.exlo.no/
```

### Browser header situasjon:
- ✅ Enkelt å forklare: "about:blank" er mer forutsigbart enn random blob URLs
- ✅ Kortere bruker-instruksjon for å fjerne headers
- ✅ Mer stabil print-oppførsel på tvers av nettlesere

## 💡 Bruker-workflow

1. **Generer faktura** → Fylle ut alle felt
2. **Klikk "Eksporter PDF"** → Automatisk popup og print-dialog
3. **Fjern headers** → Ctrl+P → Mer innstillinger → Fjern "Headers and footers" 
4. **Lagre som PDF** → Få ren, profesjonell faktura med website link

---

**Filer endret:** `js/tools/invoiceGenerator.js`  
**Testing:** ✅ Footer link vises korrekt  
**Status:** ✅ Klar for bruk
