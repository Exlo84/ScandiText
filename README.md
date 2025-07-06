# ScandiText - Nordisk Verktøysuite

En komplett verktøysuite for nordiske brukere som kombinerer avansert tekstredigering med praktiske forretningsverktøy. Profesjonell, brukervennlig og optimalisert for nordisk språk og kultur. Bygget med vanilla JavaScript og moderne web-teknologier.

## 🌟 Verktøy og Funksjoner

### 📝 Tekstredigering
Den opprinnelige og kraftige teksteditoren for nordiske språk:

#### 🔄 Oversettelse
- **Google Translate API**: Oversett mellom norsk, svensk og dansk
- **Én-klikk oversettelse**: Hurtig oversettelse mellom nordiske språk
- **Automatisk språkgjenkjenning**: Intelligent gjenkjenning av kildespråk
- **Sikker API-håndtering**: API-nøkler lagres sikkert i miljøvariabler

#### Tekstanalyse
- **Sanntidsstatistikker**: Ord, tegn, setninger, avsnitt
- **Lesbarhetsscore**: Tilpasset Flesch-Kincaid for nordiske språk
- **Gjennomsnittsmålinger**: Ordlengde og setningslengde
- **Lesetidsestimering**: Basert på gjennomsnittlig lesehastighet
- **Sammensatte ord**: Automatisk gjenkjenning av nordiske sammensatte ord

#### Språkvalg
- **Manuelt språkvalg**: Velg mellom norsk (bokmål/nynorsk), svensk og dansk
- **Språkspesifikke funksjoner**: Tilpasset tekstanalyse for hvert språk
- **Språkindikatorer**: Tydelig visning av valgt språk

#### Teksttransformasjoner
- **Store/små bokstaver**: Intelligent konvertering
- **Tittelformatering**: Smart kapitalisering som respekterer navn og forkortelser
- **Tekstrengjøring**: Fjerner ekstra mellomrom og normaliserer formatering
- **Nordiske tegn**: Konvertering mellom æ/ø/å ↔ ae/oe/aa
- **Sammensatte ord**: Legg til eller fjern bindestreker
- **Tegnsetting**: Normaliser mellomrom og tegnsetting

### 📄 Fakturagenerator (Fullstendig oppgradert v2.0.5!)
Profesjonell fakturaløsning for norske småbedrifter:
- **Firmaopplysninger**: Navn, adresse, organisasjonsnummer
- **Kundeinformasjon**: Komplett navn og adressebehandling  
- **Dynamiske varer/tjenester**: Legg til og fjern linjer enkelt
- **MVA-beregning**: Automatisk norsk MVA (25%) med klare totaler
- **Live forhåndsvisning**: Profesjonell midtstilt visning med optimal kontrast
- **Høykvalitets PDF**: Ren eksport uten browser-elementer via window.print()
- **Intelligent mal-system**: Lagre og gjenbruk firmainformasjon med validering
- **Forskuddsfaktura**: Støtte for forskuddsbetaling og normale fakturaer
- **Forfallsdato**: Automatisk 30-dagers betalingsfrist
- **Responsive design**: Perfekt på alle enheter og utskriftsformater

**Nyeste forbedringer i v2.0.5:**
- 🎨 Komplett redesign av forhåndsvisning - midtstilt og profesjonell
- 📄 Maksimal kontrast (svart tekst på hvit bakgrunn) for optimal lesbarhet  
- 🖨️ Perfekt PDF-eksport med clean layout uten browser-elementer
- 💾 Forbedret "Lagre mal" funksjon med bedre validering og tilbakemelding
- 🔄 "Last inn mal" gjenoppretter alle lagrede firmadetaljer automatisk
- ✨ Profesjonell footer med link til nordisk.exlo.no på alle fakturaer
- 🎯 Forbedret responsivt design for tablet og mobil
- 🔧 Bedre feilhåndtering og bruker-feedback
- ✅ Bedre validering og feilhåndtering
- 💬 Forbedret toast-meldinger og bruker-feedback
- 🖨️ Automatisk print-dialog for enkel PDF-lagring
- 🔢 Forbedret fakturanummer-generering (YYYY-MMDD-XXXX format)
- 🎯 Mer robust popup-håndtering og feilmeldinger

### 📱 Sosiale medier formatter (NYT!)
Optimaliser innlegg for ulike plattformer:
- **Plattformoptimalisering**: LinkedIn, Instagram, Facebook, Twitter/X
- **Tegngrenser**: Automatisk telling og advarsler
- **Hashtag-forslag**: Relevante hashtags for nordisk innhold
- **Formatering**: Optimalisert layout for hver plattform
- **Live forhåndsvisning**: Se formatert innhold i sanntid
- **Beste praksis**: Plattformspesifikke tips og anbefalinger

### 🔐 Passordgenerator (NYT!)
Generer sterke passord med nordisk tilpasning:
- **Nordiske ord**: Inkluder norske, svenske eller danske ord for lettere memorering
- **Tilpassbar lengde**: 8-50 tegn
- **Kompleksitet**: Tall, spesialtegn og store/små bokstaver
- **Flere alternativer**: Generer flere passord samtidig
- **Sikker generering**: Kryptografisk sikre algoritmer
- **Språktilpasning**: Automatisk bruk av ord fra valgt språk

### 🙏 Donasjonsstøtte (NYT!)
Støtt videreutvikling av verktøysuite:
- **Coffee-donasjon**: Enkel støtte via Coffee-tjeneste
- **Vipps-integrasjon**: QR-kode for norske brukere
- **Enkel prosess**: Rask donasjon uten registrering

### Finn og Erstatt
- **Avansert søk** med regex-støtte
- **Erstatningsalternativer**: Erstatt neste eller alle
- **Søkefilter**: Case-sensitive, hele ord, kun i utvalg
- **Visuell feedback**: Uthev av søkeresultater
- **Hurtigtaster**: Ctrl+F for rask tilgang

### Tekstsammenligning
- **Side-ved-side** sammenligning
- **Diff-uthevning**: Visuell markering av forskjeller
- **Statistikksammenligning**: Sammenlign tekstmålinger
- **Ord- og linjenivå**: Velg detaljnivå for sammenligning
- **Kopier diff**: Eksporter forskjeller som tekst

### Eksportfunksjoner
- **Flere formater**: TXT, HTML, Word (RTF), PDF (via print)
- **Formatert output**: Inkluderer tekststatistikk og metadata
- **Utskriftsvennlig**: Optimalisert for utskrift og PDF-generering

### 🔐 Sikkerhet og konfigurasjon
- **Miljøvariabler**: Sikker lagring av API-nøkler i .env filer
- **Build system**: Automatisk generering av klientkonfigurasjon
- **Git sikkerhet**: Sensitive data ekskluderes automatisk fra versjonskontroll

### Avanserte funksjoner
- **Auto-lagring**: Automatisk lagring til nettleserens lokale lagring
- **Hurtigtaster**: Omfattende tastaturstøtte
- **Responsivt design**: Fungerer på desktop, tablet og mobil
- **Modulær arkitektur**: Lett å utvide og vedlikeholde

## 🚀 Kom i gang

### Rask start

1. **Last ned prosjektet**:
```bash
git clone https://github.com/exlo84/ScandiText.git
cd ScandiText
```

2. **Start en lokal webserver** (nødvendig for ES6 modules):

**Med Python 3:**
```bash
python -m http.server 8000
```

## 🚀 Installasjon og oppsett

### Forutsetninger
- Moderne nettleser med ES6 module støtte
- Google Translate API-nøkkel (for oversettelsestjenester)
- Lokal webserver (anbefalt)

### 1. Last ned prosjektet
```bash
git clone https://github.com/exlo84/ScandiText.git
cd ScandiText
```

### 2. Konfigurer miljøvariabler
```bash
# Kopier eksempel-konfigurasjon
cp .env.example .env

# Rediger .env og legg inn din Google Translate API-nøkkel
nano .env
```

I `.env` filen:
```
GOOGLE_TRANSLATE_API_KEY=din_api_nøkkel_her
NODE_ENV=development
```

### 3. Bygg konfigurasjon
```bash
# Gjør build-script kjørbart
chmod +x build.sh

# Generer klient-konfigurasjon
./build.sh
```

### 4. Start lokal webserver

**Med Python 3:**
```bash
python3 -m http.server 8080
```

**Med Node.js:**
```bash
# Installer http-server globalt (engangs)
npm install -g http-server

# Start server
http-server -p 8000
```

**Med PHP:**
```bash
php -S localhost:8000
```

**Med VS Code Live Server:**
- Installer "Live Server" extension
- Høyreklikk på `index.html` → "Open with Live Server"

### 5. Åpne i nettleser
- Gå til http://localhost:8080 (eller din valgte port)
- Applikasjonen lastes automatisk

### ⚠️ Sikkerhet
- `.env` og `config.js` inneholder sensitive API-nøkler
- Disse filene skal ALDRI committes til versjonskontroll
- De er automatisk ekskludert via `.gitignore`

### Alternativ: Direkte filåpning
For testing kan du åpne `index.html` direkte i nettleser, men ES6 modules og API-funksjonalitet krever webserver.

### Testing
```bash
# Test grunnleggende funksjonalitet
node tests/basic-tests.js

# Test imports og modules
node test-imports.js
```

## 📖 Brukerveiledning

### Grunnleggende bruk

1. **Skriv eller lim inn tekst** i hovedtekstområdet
2. **Velg språk** med språkknappene (NO/SE/DK) øverst
3. **Se sanntidsstatistikk** i høyre panel
4. **Bruk verktøyene** i verktøylinjen for tekstbearbeiding

### Hurtigtaster

| Hurtigtast | Funksjon |
|------------|----------|
| `Ctrl+F` | Åpne finn og erstatt |
| `Ctrl+S` | Lagre tekst (auto-lagring) |
| `Escape` | Lukk modaler |
| `F5` | Oppdater statistikk |

### Teksttransformasjoner

1. **Merk tekst** eller la alt være valgt
2. **Klikk på en transformasjonsknapp**:
   - 🔤 Store bokstaver
   - 🔡 Små bokstaver  
   - 🔠 Tittelformat
   - 🧹 Rens tekst
   - 🔄 Konverter nordiske tegn

### Finn og erstatt

1. **Trykk Ctrl+F** eller klikk søkeikonet
2. **Skriv søkeord** i "Finn"-feltet
3. **Valgfritt**: Skriv erstatning i "Erstatt"-feltet
4. **Bruk alternativene**:
   - ☐ Store/små bokstaver
   - ☐ Hele ord
   - ☐ Regulære uttrykk
   - ☐ Kun i utvalg
5. **Klikk "Finn neste"** eller "Erstatt alle"

### Tekstsammenligning

1. **Klikk "Sammenlign tekster"**-knappen
2. **Lim inn tekst** i begge feltene
3. **Velg sammenligningsmodus**:
   - Ord-nivå (standard)
   - Linje-nivå
4. **Se forskjeller** markert med farger
5. **Kopier diff** om ønskelig

### Eksport

1. **Klikk "Eksporter"**-knappen
2. **Velg format**:
   - **TXT**: Ren tekst
   - **HTML**: Formatert med statistikk
   - **DOCX**: Word-kompatibel (RTF-format)
   - **PDF**: Via utskriftsdialog
3. **Filen lastes ned** automatisk

## 🏗️ Arkitektur

Applikasjonen er bygget med modulær vanilla JavaScript og en moderne verktøysuite-arkitektur:

```
ScandiText/
├── index.html              # Hovedside med tab-navigasjon
├── demo.html              # Demotekster
├── package.json           # Prosjektmetadata
├── README.md              # Denne filen
├── LICENSE                # MIT-lisens
├── vipps-qr.png           # QR-kode for Vipps-donasjoner
├── css/
│   ├── main.css          # Hovedstyling
│   ├── components.css    # UI-komponenter og verktøystyling
│   ├── logo.css          # Logo og branding
│   ├── tooltips.css      # Tooltip-styling
│   └── sponsor.css       # Sponsor-banner
├── js/
│   ├── app.js            # Hovedapplikasjon og koordinering
│   ├── textAnalyzer.js   # Tekstanalyse
│   ├── languageDetector.js # Språkgjenkjenning
│   ├── textTransforms.js # Teksttransformasjoner  
│   ├── textCompare.js    # Tekstsammenligning
│   ├── exportUtils.js    # Eksportfunksjoner
│   ├── googleTranslate.js # Google Translate API
│   ├── i18n.js           # Flerspråklig støtte
│   ├── tools/
│   │   ├── toolManager.js     # Tab-navigasjon og verktøyhåndtering
│   │   ├── invoiceGenerator.js # Komplett faktura-funksjonalitet
│   │   ├── socialFormatter.js  # Sosiale medier (kommer i v2.1)
│   │   └── passwordGenerator.js # Passord (kommer i v2.1)
│   └── ui/
│       ├── modal.js      # Modal-komponenter
│       └── findReplace.js # Finn og erstatt
└── tests/
    ├── basic-tests.js    # Grunnleggende tester
    └── test-imports.js   # Import-tester
```

### Moduler

#### TextAnalyzer
Analyserer tekst og gir omfattende statistikk:
- Ordtelling og tegnanalyse
- Setnings- og avsnittstrukturer
- Lesbarhetsscore (tilpasset nordiske språk)
- Sammensatte ord-deteksjon

#### LanguageDetector
Støtter språkgjenkjenning når nødvendig:
- Ordforrådsanalyse for NO/SE/DK
- Konfidensscore for deteksjon
- Primært for teknisk bruk - brukere velger språk manuelt

#### TextTransforms
Utfører intelligente teksttransformasjoner:
- Case-konvertering med kontekst
- Nordiske tegn-konvertering
- Tekstrengjøring og normalisering
- Sammensatt ord-håndtering

#### UI Components
Moderne, responsive brukergrensesnitt-komponenter:
- Modal-dialoge med animasjoner
- Toast-notifikasjoner
- Responsive design
- Tilgjengelighetsfunksjoner

## 🧪 Testing

### Kjør tester
```bash
# Grunnleggende funksjonalitetstester
npm test
# eller
node tests/basic-tests.js

# Test import og grunnleggende API
node test-imports.js
```

### Testdekining
Testene dekker:
- Tekstanalysefunksjoner (ord, setninger, avsnitt)
- Teksttransformasjoner (case, nordiske tegn, rengjøring)
- Språkgjenkjenning (når nødvendig)
- Edge cases og feilhåndtering
- Modulimport og grunnleggende API

### Manuell testing
1. Åpne `demo.html` for eksempeltekster
2. Test alle funksjoner via brukergrensesnittet
3. Sjekk konsollen for eventuelle feil
4. Test på ulike skjermstørrelser

## 🚀 Deployment

### Hosting
Siden dette er en statisk applikasjon kan den hostes på:

**GitHub Pages:**
```bash
# Aktiver GitHub Pages i repository settings
# Velg "Deploy from a branch" → "main"
```

**Netlify:**
```bash
# Dra og slipp hele mappen til Netlify
# eller koble til GitHub repository
```

**Vercel:**
```bash
# Installer Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

**Tradisjonell webserver:**
- Last opp alle filer til webserver
- Sørg for at serveren støtter ES6 modules
- Sett riktige MIME-typer for .js filer

### Konfigurasjon
Ingen spesiell konfigurasjon nødvendig - applikasjonen fungerer ut av boksen.

## 📚 API-dokumentasjon

### TextAnalyzer

```javascript
import { TextAnalyzer } from './js/textAnalyzer.js';

const analyzer = new TextAnalyzer();

// Analyser tekst med språkspesifikke innstillinger
const result = analyzer.analyze(text, language);
// Returns: { words, characters, sentences, paragraphs, readabilityScore, ... }

// Individuelle metoder
analyzer.countWords(text);           // Antall ord
analyzer.countSentences(text);       // Antall setninger
analyzer.countParagraphs(text);      // Antall avsnitt
analyzer.calculateReadability(text, language); // Lesbarhetsscore
```

### TextTransforms

```javascript
import { TextTransforms } from './js/textTransforms.js';

const transforms = new TextTransforms();

// Case-transformasjoner
transforms.toUpperCase(text);
transforms.toLowerCase(text);
transforms.toTitleCase(text, language);
transforms.intelligentCapitalize(text, language);

// Nordiske tegn
transforms.convertNordicChars(text, direction); // 'to-ascii' eller 'to-nordic'

// Tekstrengjøring
transforms.cleanText(text);
transforms.normalizeWhitespace(text);
transforms.normalizePunctuation(text);
```

### LanguageDetector (valgfri bruk)

```javascript
import { LanguageDetector } from './js/languageDetector.js';

const detector = new LanguageDetector();

// Automatisk språkgjenkjenning (ikke nødvendig for normal bruk)
const result = detector.detect(text);
// Returns: { language: 'no'|'se'|'dk'|'unknown', confidence: 0.95, ... }
```

## 🤝 Bidrag

Bidrag er velkomne! Vennligst:

1. **Fork prosjektet**
2. **Opprett en feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit endringene** (`git commit -m 'Add amazing feature'`)
4. **Push til branchen** (`git push origin feature/amazing-feature`)
5. **Åpne en Pull Request**

### Utviklingsretningslinjer
- Følg eksisterende kodestil og modulær struktur
- Legg til JSDoc-kommentarer for nye funksjoner
- Test nye funksjoner med `npm test`
- Oppdater dokumentasjon ved behov
- Fokuser på brukervennlighet og tilgjengelighet

### Rapporter problemer
- Bruk GitHub Issues for bug-rapporter
- Inkluder steg for å reprodusere problemet
- Spesifiser nettleser og versjon
- Inkluder skjermbilder når relevant

## 📄 Lisens

Dette prosjektet er lisensiert under MIT-lisensen - se [LICENSE](LICENSE) filen for detaljer.

## 🙏 Anerkjennelser

- Designet for bedre støtte av nordiske språk i tekstredigering
- Flesch-Kincaid lesbarhetsscore tilpasset nordiske språk
- Brukergrensesnitt inspirert av moderne tekstredigerere
- Takk til alle som bidrar til utvikling og testing

## 📞 Support

**Har du spørsmål eller problemer?**
- 🐛 Åpne en [issue](https://github.com/dittbrukernavn/ScandiText/issues) for bugs
- 💡 Bruk [discussions](https://github.com/dittbrukernavn/ScandiText/discussions) for forslag
- 📧 Kontakt utviklere via GitHub

## 🔄 Versjonering

Vi bruker [SemVer](http://semver.org/) for versjonering.

### Nåværende versjon: 2.0.0 - Nordisk Verktøysuite 🎉
✅ **Hovedfunksjonalitet:**
- Alle opprinnelige tekstredigeringsfunksjoner bevart og forbedret
- **Tab-basert navigasjon** mellom ulike verktøy
- **Fakturagenerator** med MVA-beregning og PDF-eksport
- **Donasjonsstøtte** med Coffee og Vipps-integrasjon
- **Responsivt design** optimalisert for alle enheter
- **Modulær arkitektur** for enkel utvidelse

✅ **Tekstredigering (forbedret):**
- Full støtte for norsk, svensk og dansk
- Sanntids tekstanalyse og statistikk
- Google Translate API-integrasjon
- Avanserte teksttransformasjoner
- Finn og erstatt med regex-støtte
- Tekstsammenligning med diff-visning
- Eksport til TXT, HTML, Word og PDF

✅ **Fakturagenerator (ny):**
- Komplett skjema for norske småbedrifter
- Automatisk MVA-beregning (25%)
- Dynamiske varerader med legg til/fjern
- Live forhåndsvisning av faktura
- PDF-eksport med profesjonell layout
- Mal-system for gjenbruk av firmadata

✅ **Donasjonsstøtte (ny):**
- Coffee-knapp for internasjonale donasjoner
- Vipps QR-kode modal for norske brukere
- Enkel og diskret plassering

### Tidligere versjoner:
#### v1.1.0 - PWA og forbedringer
- ✅ **Nye i v1.1:** Utvidede hurtigtaster og tilgjengelighetsforbedrings
- ✅ **Nye i v1.1:** Forbedret PDF-eksport (ikke via print)
- ✅ **Nye i v1.1:** Ekte Word-dokumentstøtte (.docx forbedret RTF)
- ✅ **Nye i v1.1:** Bedre mobile-experience med sidebar-toggle
- ✅ **Nye i v1.1:** PWA-støtte (offline bruk, installasjon)

## 🗺️ Roadmap

### Neste versjon (v2.1) - Fullføring av verktøysuite
- ✅ **Sosiale medier formatter** - Komplett implementasjon (v2.0.7)
- ✅ **Passordgenerator** - Norsk-tilpasset passordgenerering (v2.0.7)
- [ ] Forbedret clipboard-funksjonalitet
- [ ] Flere eksportformater for faktura
- [ ] Template-deling mellom brukere

### Mellomlang sikt (v2.2-2.5)
- [ ] Grammatikksjekking for nordiske språk
- [ ] Synonymforslag og ordbok
- [ ] Stilguide-sjekking
- [ ] Plugin-system for utvidelser
- [ ] Avansert diff-algoritme for tekstsammenligning
- [ ] Flere forretningsverktøy (timeregistrering, prosjektplanlegging)

### Lang sikt (v3.0+)
- [ ] Samarbeidsredigering (real-time)
- [ ] Integrasjon med populære tekstredigerere
- [ ] API for tredjepartsintegrasjon
- [ ] Avansert AI-assistert skriving
- [ ] Flerspråklig dokument-støtte
- [ ] Enterprise-funksjoner for bedrifter

### 🎉 Nytt i v1.1.0:

#### Utvidede hurtigtaster
- `Ctrl+Shift+U` - Store bokstaver
- `Ctrl+Shift+L` - Små bokstaver  
- `Ctrl+Shift+T` - Tittelformat
- `Ctrl+Shift+R` - Rens tekst
- `Ctrl+1/2/3` - Velg språk (NO/SE/DK)
- `Alt+Enter` - Fokus-modus (skjul distraksjoner)
- `Ctrl+Shift+H` - Vis/skjul sidebar
- `F5` - Oppdater statistikk

#### Forbedret PDF-eksport
- PDF-optimalisert HTML generering
- Bedre formatering og typografi
- Statistikk inkludert i PDF
- Professionell layout for utskrift

#### Forbedret Word-støtte
- Utvidet RTF med bedre formatering
- Nordiske tegn støtte i RTF
- Tabeller for statistikk
- Bedre kompatibilitet med Microsoft Word

#### PWA-funksjoner
- 📱 **Installerbar app** - Installer som desktop/mobil app
- 🔄 **Offline-støtte** - Fungerer uten internett
- 💾 **Background sync** - Synkroniser endringer automatisk
- 🔔 **Update-notifikasjoner** - Automatiske app-oppdateringer
- 📊 **App-ikoner** - Profesjonelle ikoner for alle platformer

#### Tilgjengelighetsforbedringer
- **ARIA-labels** på alle interaktive elementer
- **Keyboard navigation** forbedret
- **Screen reader** støtte
- **High contrast** mode støtte
- **Reduced motion** respektert
- **Touch-vennlige** knapper (44px minimum)

#### Mobil-forbedringer
- 📱 **Sidebar toggle** for mobil
- 👆 **Bedre touch targets** (44px minimum)
- 🎨 **Responsive modal design**
- ⚡ **Raskere loading** på mobil
- 🌙 **Dark mode** støtte (automatisk)

---

**Nordisk Verktøysuite** - Bygget med ❤️ for nordiske brukere