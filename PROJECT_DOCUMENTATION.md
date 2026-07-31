# Drømmetolker - Danish Dream Interpretation Application

## Projektformål

**Drømmetolker** er en webapplikation designet til at hjælpe danske brugere med at forstå og tolke deres drømme. Applikationen bruger kunstig intelligens (LLM) til at give personaliserede drømmefortolkninger baseret på brugerens input.

### Kernefunktionalitet

1. **Fuld drøm tolkning** - Brugeren skriver sin drøm i detaljer, og applikationen analyserer den ved hjælp af AI
2. **Scenario-baseret tolkning** - Brugeren vælger fra 10 foruddefinerede drømscenarier og får specifik analyse
3. **Uddannelsesmateriale** - Informationsfane med baggrundsviden om drømmesymboler og psykologisk perspektiv

---

## Teknisk Stack

### Frontend
- **Framework**: React 19 + Vite (moderne, hurtig udvikling)
- **Styling**: Tailwind CSS 4 + shadcn/ui komponenter
- **State Management**: tRPC + React Query (type-safe API kommunikation)
- **Sprog**: TypeScript
- **Routing**: Wouter (lightweight router)

### Backend
- **Framework**: Express.js + tRPC (type-safe RPC)
- **Sprog**: TypeScript/Node.js
- **Database**: MySQL via Drizzle ORM
- **AI Integration**: Manus Built-in LLM API (Forge)
- **Authentication**: Manus OAuth 2.0

### Database
- **Engine**: MySQL (TiDB compatible)
- **ORM**: Drizzle ORM (type-safe, migrations)
- **Tabeller**: users, dreams, dreamInterpretations

### Deployment
- **Hosting**: Manus WebDev (autoscale serverless)
- **Build**: Vite (frontend) + esbuild (backend)
- **Testing**: Vitest (unit tests)

---

## Projektstruktur

```
dream-interpreter/
├── client/                          # React frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── DreamInterpreter.tsx # Hovedside med tre faner
│   │   │   ├── Home.tsx             # Landing page
│   │   │   └── NotFound.tsx         # 404 side
│   │   ├── components/
│   │   │   ├── tabs/
│   │   │   │   ├── FullDreamTab.tsx      # Fuld drøm fane
│   │   │   │   ├── ScenariosTab.tsx      # Scenarier fane
│   │   │   │   └── InformationTab.tsx    # Information fane
│   │   │   ├── DashboardLayout.tsx       # Layout wrapper
│   │   │   ├── ErrorBoundary.tsx         # Fejlhåndtering
│   │   │   └── ui/                       # shadcn/ui komponenter
│   │   ├── contexts/
│   │   │   └── ThemeContext.tsx          # Tema (light/dark)
│   │   ├── hooks/
│   │   │   └── useAuth.ts                # Auth hook
│   │   ├── lib/
│   │   │   └── trpc.ts                   # tRPC client setup
│   │   ├── App.tsx                       # Routing og layout
│   │   ├── main.tsx                      # React entry point
│   │   └── index.css                     # Global styles
│   ├── public/                      # Statiske assets
│   └── index.html                   # HTML template
│
├── server/                          # Express backend
│   ├── routers/
│   │   └── dream.ts                 # Dream interpretation procedures
│   ├── db.ts                        # Database query helpers
│   ├── routers.ts                   # Main tRPC router
│   ├── auth.logout.test.ts          # Auth tests
│   ├── dream.test.ts                # Dream router tests
│   └── _core/                       # Framework internals
│       ├── index.ts                 # Server entry point
│       ├── context.ts               # tRPC context (auth)
│       ├── trpc.ts                  # tRPC setup
│       ├── env.ts                   # Environment variables
│       ├── llm.ts                   # LLM integration
│       ├── cookies.ts               # Session management
│       └── systemRouter.ts          # System procedures
│
├── drizzle/                         # Database schema
│   ├── schema.ts                    # Table definitions
│   └── migrations/                  # Auto-generated migrations
│
├── shared/                          # Shared code
│   ├── danish.ts                    # Danish language constants
│   ├── const.ts                     # Global constants
│   └── types.ts                     # Shared types
│
├── package.json                     # Dependencies
├── tsconfig.json                    # TypeScript config
├── vite.config.ts                   # Vite config
├── drizzle.config.ts                # Drizzle config
├── vitest.config.ts                 # Vitest config
├── todo.md                          # Project TODO list
└── PROJECT_DOCUMENTATION.md         # This file
```

---

## Database Schema

### users tabel
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  openId VARCHAR(64) NOT NULL UNIQUE,
  name TEXT,
  email VARCHAR(320),
  loginMethod VARCHAR(64),
  role ENUM('user', 'admin') DEFAULT 'user',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  lastSignedIn TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### dreams tabel
```sql
CREATE TABLE dreams (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  dreamText TEXT NOT NULL,
  type ENUM('full', 'scenario') NOT NULL,
  scenario VARCHAR(50),
  additionalContext TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id)
);
```

### dreamInterpretations tabel
```sql
CREATE TABLE dreamInterpretations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  dreamId INT NOT NULL,
  interpretation TEXT NOT NULL,
  symbols JSON,
  psychologicalInsights TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (dreamId) REFERENCES dreams(id)
);
```

---

## API Endpoints (tRPC Procedures)

### Dream Router (`/api/trpc/dream.*`)

#### `getScenarios` (public)
Henter liste over alle tilgængelige drømscenarier.

**Response:**
```typescript
Array<{
  id: string;
  name: string;
  description: string;
}>
```

#### `interpretFullDream` (protected)
Analyserer en fuld drømbeskrivelse ved hjælp af LLM.

**Input:**
```typescript
{
  dreamText: string; // Min. 10 tegn, max 5000 tegn
}
```

**Response:**
```typescript
{
  success: boolean;
  dreamId: number;
  interpretation: string;
  symbols: string[];
  psychologicalInsights: string;
}
```

#### `interpretScenario` (protected)
Analyserer et foruddefineret drømscenario.

**Input:**
```typescript
{
  scenario: 'flying' | 'falling' | 'water' | 'animals' | 'people' | 'chase' | 'death' | 'house' | 'school' | 'work';
  additionalContext?: string;
}
```

**Response:**
```typescript
{
  success: boolean;
  dreamId: number;
  scenario: string;
  interpretation: string;
  psychologicalInsights: string;
}
```

#### `getDreamHistory` (protected)
Henter brugerens drømmehistorie.

**Input:**
```typescript
{
  limit?: number; // Default: 10
  offset?: number; // Default: 0
}
```

**Response:**
```typescript
Array<{
  id: number;
  dreamText: string;
  type: 'full' | 'scenario';
  scenario?: string;
  createdAt: Date;
  interpretation?: string;
}>
```

#### `getDream` (protected)
Henter detaljer om en specifik drøm.

**Input:**
```typescript
{
  dreamId: number;
}
```

**Response:**
```typescript
{
  id: number;
  dreamText: string;
  type: 'full' | 'scenario';
  scenario?: string;
  interpretation: string;
  symbols: string[];
  psychologicalInsights: string;
  createdAt: Date;
}
```

---

## Frontend Komponenter

### DreamInterpreter.tsx
Hovedkomponent med tre faner. Håndterer tab-navigation og layout.

**Props:** Ingen

**State:**
- `activeTab`: Aktiv fane ('full-dream', 'scenarios', 'information')

### FullDreamTab.tsx
Textarea til drømbeskrivelse og resultatvisning.

**Features:**
- Textarea med placeholder på dansk
- Tegntæller (0/5000)
- "Tolks drøm" knap
- Resultatvisning med markdown rendering
- Loading state
- Error handling

### ScenariosTab.tsx
Dropdown til scenarievalg og resultatvisning.

**Features:**
- Dropdown med 10 scenarier
- Valgfrit tekstfelt til yderligere kontekst
- "Tolks scenario" knap
- Resultatvisning
- Loading state
- Error handling

### InformationTab.tsx
Uddannelsesmateriale om drømmesymboler.

**Indhold:**
- Introduktion til drømmetolkning
- Almindelige drømmesymboler
- Psykologisk perspektiv (Freud, Jung)
- Praktiske tips til tolkning
- Vigtige noter

---

## Backend Procedures

### dream.ts Router

**LLM Prompts:**

For fuld drømme:
```
Du er en erfaren drømmetolker med viden om psykologi, symbolisme og kulturel betydning.
Analyser følgende drøm på dansk og giv en grundig tolkning:

[Drøm tekst]

Giv svar på dansk med:
1. Symboler og deres betydning
2. Psykologisk perspektiv
3. Mulige budskaber fra det ubevidste
```

For scenarier:
```
Du er en erfaren drømmetolker. Analyser dette drømscenario på dansk:

Scenario: [Scenarienavn]
Yderligere kontekst: [Brugerinput]

Giv en grundig tolkning på dansk med fokus på:
1. Hvad dette scenarie typisk betyder
2. Psykologisk fortolkning
3. Mulige budskaber
```

---

## Dansk Sprog Integration

### Danish Constants (`shared/danish.ts`)

Alle UI-tekster er centraliseret:
- Tab labels: "Fuld drøm", "Scenarier", "Information"
- Buttons: "Tolks drøm", "Tolks scenario"
- Placeholders og labels
- Error messages
- Scenario names og descriptions

### Scenarier (10 stk.)

1. **Flyve** - Frihed, ambition, perspektiv
2. **Falde** - Angst, tab af kontrol, usikkerhed
3. **Vand** - Følelser, det ubevidste, fornyelse
4. **Dyr** - Instinkter, primitive kræfter, personlighedstræk
5. **Mennesker** - Sociale forhold, selv-projektion
6. **Forfølgelse** - Angst, undvigelse, konflikt
7. **Død** - Transformation, afslutning, nybegyndelse
8. **Hus** - Selv, psyke, forskellige livsfaser
9. **Skole** - Læring, udvikling, prøvelser
10. **Arbejde** - Produktivitet, identitet, stress

---

## Authentication & Authorization

### OAuth Flow
1. Bruger klikker "Log ind"
2. Omdirigeres til Manus OAuth portal
3. Autentificeres via Google/Facebook/Microsoft/Apple
4. Callback til `/api/oauth/callback`
5. Session cookie sættes
6. Bruger omdirigeres til app

### Protected Procedures
Alle dream-procedures kræver autentifikation:
```typescript
export const protectedProcedure = baseProcedure.use(({ ctx, next }) => {
  if (!ctx.user) throw new TRPCError({ code: 'UNAUTHORIZED' });
  return next({ ctx });
});
```

---

## Environment Variables

### Automatisk injiceret (fra Manus)
```
DATABASE_URL=mysql://...
JWT_SECRET=...
VITE_APP_ID=...
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://manus.im/login
OWNER_OPEN_ID=...
OWNER_NAME=...
BUILT_IN_FORGE_API_URL=...
BUILT_IN_FORGE_API_KEY=...
VITE_FRONTEND_FORGE_API_KEY=...
VITE_FRONTEND_FORGE_API_URL=...
```

---

## Testing

### Vitest Tests (9 tests)

**Passing Tests:**
- `getScenarios` - Returns all scenarios
- `getScenarios` - Returns Danish names
- `interpretFullDream` - Requires authentication
- `interpretFullDream` - Validates dream text length
- `interpretScenario` - Requires authentication
- `interpretScenario` - Validates scenario enum
- `getDreamHistory` - Requires authentication
- `getDream` - Requires authentication
- `auth.logout` - Clears session cookie

**Run tests:**
```bash
pnpm test
```

---

## Development Workflow

### Setup
```bash
cd /home/ubuntu/dream-interpreter
pnpm install
pnpm db:push  # Deploy database schema
```

### Development Server
```bash
pnpm dev  # Starts on http://localhost:3000
```

### Build
```bash
pnpm build  # Builds frontend + backend
```

### Testing
```bash
pnpm test   # Runs vitest
```

### Deployment
1. Create checkpoint in Manus UI
2. Click "Publish" button
3. App deployed to production

---

## Vigtige Filer til Videreudvikling

### For at tilføje nye features:

1. **Database ændringer**: `drizzle/schema.ts` → `pnpm db:push`
2. **Backend procedures**: `server/routers/dream.ts`
3. **Frontend komponenter**: `client/src/components/tabs/`
4. **Dansk tekster**: `shared/danish.ts`
5. **Tests**: `server/dream.test.ts`

### For at ændre styling:

1. **Global styles**: `client/src/index.css`
2. **Komponenter**: Brug Tailwind classes + shadcn/ui
3. **Tema**: `client/src/contexts/ThemeContext.tsx`

---

## Videreudviklingsmuligheder

### Kortsigtet (Næste iteration)
- [ ] Dream history/journal view
- [ ] Export til PDF
- [ ] Dele fortolkninger
- [ ] Favoritter/bookmarks

### Mellemlang sigt
- [ ] Personaliserede anbefalinger baseret på historik
- [ ] Søgning i tidligere drømme
- [ ] Statistik og mønstre
- [ ] Notifikationer for nye fortolkninger

### Langsigtet
- [ ] Mobile app (React Native)
- [ ] Social features (dele drømme med venner)
- [ ] Drømmegrupper/communities
- [ ] Premium features (avanceret analyse)

---

## Fejlfinding

### Hvis applikationen ikke starter:
```bash
# Tjek dependencies
pnpm install

# Tjek database forbindelse
pnpm db:push

# Se dev server logs
pnpm dev
```

### Hvis tests fejler:
```bash
# Kør tests med verbose output
pnpm test -- --reporter=verbose
```

### Hvis LLM integration fejler:
- Tjek at `BUILT_IN_FORGE_API_KEY` er sat
- Tjek at `BUILT_IN_FORGE_API_URL` er korrekt
- Se server logs for fejlbeskeder

---

## Kontakt & Support

For spørgsmål om arkitektur eller videreudvikling, se:
- `todo.md` - Projektets progress
- `server/routers/dream.ts` - Backend logik
- `client/src/pages/DreamInterpreter.tsx` - Frontend logik
- Vitest tests for eksempler på API brug

---

**Sidst opdateret:** 2026-07-24
**Version:** 1.0.0
**Status:** Production Ready ✅
