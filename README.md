# Nordisk Tekstredigering

En avansert tekstredigeringsapplikasjon spesielt utviklet for nordiske språk (norsk, svensk, dansk). Bygget med vanilla JavaScript og moderne web-teknologier.

## 🌟 Funksjoner

### Tekstanalyse
- **Sanntidsstatistikker**: Ord, tegn, setninger, avsnitt
- **Lesbarhetsscore**: Tilpasset Flesch-Kincaid for nordiske språk
- **Gjennomsnittsmålinger**: Ordlengde og setningslengde
- **Lesetidsestimering**: Basert på gjennomsnittlig lesehastighet
- **Sammensatte ord**: Automatisk gjenkjenning av nordiske sammensatte ord

### Språkvalg
- **Manuelt språkvalg**: Velg mellom norsk (bokmål/nynorsk), svensk og dansk
- **Språkspesifikke funksjoner**: Tilpasset tekstanalyse for hvert språk
- **Språkindikatorer**: Tydelig visning av valgt språk

### Teksttransformasjoner
- **Store/små bokstaver**: Intelligent konvertering
- **Tittelformatering**: Smart kapitalisering som respekterer navn og forkortelser
- **Tekstrengjøring**: Fjerner ekstra mellomrom og normaliserer formatering
- **Nordiske tegn**: Konvertering mellom æ/ø/å ↔ ae/oe/aa
- **Sammensatte ord**: Legg til eller fjern bindestreker
- **Tegnsetting**: Normaliser mellomrom og tegnsetting

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

3. **Åpne i nettleser**:
   - Gå til http://localhost:8000
   - Applikasjonen lastes automatisk

### Alternativ: Direkte filåpning
For testing kan du åpne `index.html` direkte i nettleser, men ES6 modules fungerer best via webserver.

### Testing
```bash
# Kjør tester
npm test
# eller
node tests/basic-tests.js

# Test imports og grunnleggende funksjonalitet
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

Applikasjonen er bygget med modulær vanilla JavaScript:

```
ScandiText/
├── index.html              # Hovedside
├── demo.html              # Demotekster
├── package.json           # Prosjektmetadata
├── README.md              # Denne filen
├── LICENSE                # MIT-lisens
├── css/
│   ├── main.css          # Hovedstyling
│   └── components.css    # UI-komponenter
├── js/
│   ├── app.js            # Hovedapplikasjon
│   ├── textAnalyzer.js   # Tekstanalyse
│   ├── languageDetector.js # Språkgjenkjenning
│   ├── textTransforms.js # Teksttransformasjoner  
│   ├── textCompare.js    # Tekstsammenligning
│   ├── exportUtils.js    # Eksportfunksjoner
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

### Nåværende versjon: 1.1.0
✅ **Fullført:**
- Alle kjernefunksjoner implementert
- Full støtte for norsk, svensk og dansk
- Responsivt og tilgjengelig design
- Modulær arkitektur
- Omfattende tekstanalyse
- Manuelt språkvalg (anbefalt)
- Eksport til flere formater
- Finn og erstatt med avanserte alternativer
- Tekstsammenligning
- Auto-lagring med PWA-støtte
- ✅ **Nye i v1.1:** Utvidede hurtigtaster og tilgjengelighetsforbedrings
- ✅ **Nye i v1.1:** Forbedret PDF-eksport (ikke via print)
- ✅ **Nye i v1.1:** Ekte Word-dokumentstøtte (.docx forbedret RTF)
- ✅ **Nye i v1.1:** Bedre mobile-experience med sidebar-toggle
- ✅ **Nye i v1.1:** PWA-støtte (offline bruk, installasjon)

## 🗺️ Roadmap

### Kort sikt (v1.2) - Nå tilgjengelig! ✅
- ✅ Forbedret PDF-eksport (ikke via print)
- ✅ Ekte Word-dokumentstøtte (.docx)
- ✅ Flere hurtigtaster og tilgjengelighetsforbedrings
- ✅ Bedre mobile-experience
- ✅ PWA-støtte (offline bruk)

### Mellomlang sikt (v1.3-1.5)
- [ ] Grammatikksjekking for nordiske språk
- [ ] Synonymforslag og ordbok
- [ ] Stilguide-sjekking
- [ ] Plugin-system for utvidelser
- [ ] Avansert diff-algoritme for tekstsammenligning

### Lang sikt (v2.0+)
- [ ] Samarbeidsredigering (real-time)
- [ ] Integrasjon med populære tekstredigerere
- [ ] API for tredjepartsintegrasjon
- [ ] Avansert AI-assistert skriving
- [ ] Flerspråklig dokument-støtte

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

**Nordisk Tekstredigering** - Bygget med ❤️ for nordiske språk