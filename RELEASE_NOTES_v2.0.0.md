# 🎉 ScandiText v2.0.0 - Nordisk Verktøysuite

**Release Date:** 5. juli 2025

Vi er stolte av å presentere en helt ny versjon av ScandiText som utvider seg fra en tekstredigerer til en komplett **Nordisk Verktøysuite**! 

## 🌟 Hovedfunksjoner

### ✨ Helt ny tab-basert navigasjon
- **4 verktøy i én applikasjon**: Tekstredigering, Faktura, Sosiale medier, Passord
- **Sømløs navigasjon** mellom verktøy med moderne tab-design
- **Lazy loading** for optimal ytelse
- **Browser hash navigation** for direkte lenking til verktøy

### 📄 Fakturagenerator (Nytt!)
En komplett løsning for norske småbedrifter:

#### 🏢 Omfattende skjema
- **Firmaopplysninger**: Navn, adresse, organisasjonsnummer
- **Kundeinformasjon**: Fleksibel håndtering av kunder
- **Dynamiske varer/tjenester**: Legg til og fjern linjer etter behov

#### 💰 Automatisk MVA-beregning
- **25% norsk MVA** beregnes automatisk
- **Subtotal og total** oppdateres live
- **Profesjonell layout** med alle nødvendige felter

#### 📊 Live forhåndsvisning
- **Sanntids oppdatering** mens du fyller ut skjemaet
- **Profesjonell faktura-layout** 
- **Alle beregninger synlige** før eksport

#### 🔧 Avanserte funksjoner
- **PDF-eksport**: Generer profesjonelle fakturaer
- **Mal-system**: Lagre firmainformasjon for gjenbruk
- **Template loading**: Last inn eksisterende maler

### 🙏 Donasjonsstøtte (Nytt!)
Enkel måte å støtte prosjektet på:

#### ☕ Coffee-integrasjon
- **Direkte lenke** til Coffee-donasjon
- **Internasjonal støtte** for alle brukere

#### 📱 Vipps-integrasjon
- **QR-kode modal** for norske brukere  
- **Enkel skanning** med Vipps-appen
- **Diskret plassering** uten å forstyrre arbeidsflyten

### 🛠️ Kommende verktøy (HTML/CSS klare)
- **📱 Sosiale medier formatter**: Optimaliser innlegg for LinkedIn, Instagram, Facebook, Twitter/X
- **🔐 Passordgenerator**: Norsk-tilpasset passordgenerering med sterke alternativer

## 🎨 Design og brukeropplevelse

### 📱 Responsivt design
- **Mobile-first tilnærming** med touch-optimalisering
- **Fleksibel layout** som tilpasser seg alle skjermstørrelser
- **Moderne CSS Grid og Flexbox** for perfekt layout

### 🌙 Dark mode støtte
- **Automatisk deteksjon** av systempreferanser
- **Komplett styling** for alle komponenter
- **Høy kontrast** for best mulig lesbarhet

### ♿ Tilgjengelighet
- **ARIA-labels** på alle interaktive elementer
- **Keyboard navigation** optimalisert
- **Screen reader** kompatibilitet
- **Touch targets** minimum 44px for mobil

## 🏗️ Tekniske forbedringer

### 📦 Modulær arkitektur
- **ToolManager**: Ny klasse for verktøynavigasjon
- **InvoiceGenerator**: Komplett faktura-funksjonalitet
- **Global utilities**: Delte funksjoner på tvers av verktøy

### 🔧 Kodeforbedringer
- **ES6 modules** med lazy loading
- **Event-driven arkitektur** for loose coupling
- **Error handling** og robust feilhåndtering
- **TypeScript-style JSDoc** for bedre dokumentasjon

### 🎯 Ytelse
- **Lazy loading** av verktøy-JavaScript
- **Optimaliserte bilder** og ressurser
- **Minimal initial bundle** for rask lasting

## 🔄 Bakoverkompatibilitet

### ✅ Alle eksisterende funksjoner bevart
- **Komplett tekstanalyse** med nordisk språkstøtte
- **Google Translate API** integrasjon
- **Finn og erstatt** med regex-støtte
- **Tekstsammenligning** med diff-visning
- **Eksport til TXT, HTML, Word og PDF**
- **PWA-funksjonalitet** med offline støtte

### 🔧 Forbedret funksjonalitet
- **Bedre error handling** i alle moduler
- **Optimaliserte ytelse** på tvers av verktøy
- **Konsistent UI/UX** mellom alle verktøy

## 🗂️ Filstruktur (nye filer)

```
js/tools/
├── toolManager.js          # Tab-navigasjon og verktøyhåndtering
├── invoiceGenerator.js     # Komplett faktura-funksjonalitet
├── socialFormatter.js      # (Kommer i v2.1)
└── passwordGenerator.js    # (Kommer i v2.1)

css/
└── components.css          # Utvidet med nye verktøy-styling

vipps-qr.png               # QR-kode for Vipps-donasjoner
```

## 🚀 Oppgradering

### Fra v1.x til v2.0.0
- **Ingen breaking changes** for eksisterende brukere
- **Automatisk migrering** av lagrede innstillinger
- **Alle hurtigtaster** fungerer som før
- **Samme URL-struktur** for bookmarks

### Installasjon
```bash
git pull origin main
# eller last ned den nye versjonen
```

Ingen ytterligere konfigurasjon nødvendig - alt fungerer out-of-the-box!

## 🎯 Fremtidig utvikling

### v2.1 (planlagt innen august 2025)
- **Komplett sosiale medier formatter** med platform-optimalisering
- **Passordgenerator** med norske ord og sikkerhetsfunksjoner
- **Forbedret clipboard-støtte** for alle verktøy

### v2.2+ 
- **Flere forretningsverktøy**: Timeregistrering, prosjektplanlegging
- **Grammatikksjekking** for nordiske språk
- **Synonymforslag** og ordbok-integrasjon

## 💬 Tilbakemelding og support

Vi setter stor pris på tilbakemelding på den nye verktøysuite!

- **🐛 Bug reports**: [GitHub Issues](https://github.com/Exlo84/ScandiText/issues)
- **💡 Feature requests**: [GitHub Discussions](https://github.com/Exlo84/ScandiText/discussions)
- **❤️ Støtt prosjektet**: Via Coffee eller Vipps direkte i appen

## 🙏 Takk

Stor takk til alle som har testet beta-versjonen og gitt verdifull tilbakemelding. Deres input har vært avgjørende for å forme denne nye versjonen.

---

**Happy coding!** 🎉  
*ScandiText-teamet*

---

### Tekniske notater for utviklere

#### Breaking changes
- Ingen breaking changes i public API
- Nye CSS-klasser kan påvirke custom styling

#### Dependencies
- Ingen nye eksterne dependencies
- Fortsatt vanilla JavaScript

#### Browser support
- Samme browser support som v1.x
- ES6 modules påkrevd
- Modern browsers (Chrome 60+, Firefox 60+, Safari 12+, Edge 79+)
