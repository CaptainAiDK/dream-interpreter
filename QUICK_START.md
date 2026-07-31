# Drømmetolker - Quick Start Guide

## Installation & Setup

### 1. Klon eller udpak projektet
```bash
cd dream-interpreter
```

### 2. Installer dependencies
```bash
pnpm install
```

### 3. Opsæt database
```bash
pnpm db:push
```

### 4. Start development server
```bash
pnpm dev
```

Applikationen åbner på `http://localhost:3000`

---

## Første Gang - Login

1. Klik "Log ind" knappen
2. Autentificer med Google/Facebook/Microsoft/Apple
3. Du bliver omdirigeret tilbage til applikationen
4. Du kan nu bruge alle tre faner

---

## Tre Faner Forklaret

### 1. **Fuld drøm** 
Skriv din drøm i detaljer (min. 10 tegn, max 5000 tegn). Klik "Tolks drøm" for at få AI-powered analyse.

### 2. **Scenarier**
Vælg et foruddefineret drømscenario fra dropdown-menuen. Tilføj valgfrit mere kontekst. Klik "Tolks scenario".

### 3. **Information**
Læs om drømmesymboler, psykologisk perspektiv og praktiske tips til drømmetolkning.

---

## Vigtige Kommandoer

```bash
# Development
pnpm dev              # Start dev server

# Testing
pnpm test             # Kør vitest

# Building
pnpm build            # Build for production
pnpm start            # Kør production build

# Database
pnpm db:push          # Sync schema til database
pnpm db:studio        # Åbn Drizzle Studio (GUI)

# Code Quality
pnpm check            # TypeScript check
pnpm format           # Format kode med Prettier
```

---

## Projekt Struktur - Vigtige Filer

```
dream-interpreter/
├── client/src/
│   ├── pages/DreamInterpreter.tsx    ← Hovedside (tre faner)
│   └── components/tabs/              ← Tab komponenter
├── server/
│   ├── routers/dream.ts              ← Backend logik
│   └── db.ts                         ← Database queries
├── drizzle/schema.ts                 ← Database schema
├── shared/danish.ts                  ← Dansk tekster
└── PROJECT_DOCUMENTATION.md          ← Fuld dokumentation
```

---

## Tilføj Ny Feature - Eksempel

### 1. Tilføj database felt
Rediger `drizzle/schema.ts`:
```typescript
export const dreams = mysqlTable("dreams", {
  // ... eksisterende felter
  mood: varchar("mood", { length: 50 }), // Nyt felt
});
```

### 2. Deploy schema
```bash
pnpm db:push
```

### 3. Tilføj backend procedure
Rediger `server/routers/dream.ts`:
```typescript
export const dreamRouter = router({
  // ... eksisterende procedures
  analyzeMood: protectedProcedure
    .input(z.object({ dreamId: z.number() }))
    .query(async ({ input, ctx }) => {
      // Din logik her
    }),
});
```

### 4. Brug fra frontend
```typescript
const { data } = trpc.dream.analyzeMood.useQuery({ dreamId: 1 });
```

---

## Fejlfinding

### "Cannot find module" fejl
```bash
pnpm install
```

### Database forbindelsesfejl
```bash
# Tjek DATABASE_URL er sat
echo $DATABASE_URL

# Prøv igen
pnpm db:push
```

### LLM fejl (AI analyse virker ikke)
- Tjek at `BUILT_IN_FORGE_API_KEY` er sat
- Se server logs: `pnpm dev` output

### Tests fejler
```bash
pnpm test -- --reporter=verbose
```

---

## Deployment til Production

1. **Lav checkpoint** i Manus UI
2. **Klik Publish** knappen
3. App deployed til `https://your-domain.manus.space`

---

## Environment Variables

Disse sættes automatisk af Manus:
- `DATABASE_URL` - MySQL forbindelses-string
- `BUILT_IN_FORGE_API_KEY` - LLM API nøgle
- `JWT_SECRET` - Session signing nøgle
- Og flere...

Du behøver IKKE at konfigurere disse manuelt.

---

## Næste Trin

Se `PROJECT_DOCUMENTATION.md` for:
- Detaljeret API dokumentation
- Database schema forklaring
- Frontend komponenter guide
- Videreudviklingsmuligheder

---

**Spørgsmål?** Se `PROJECT_DOCUMENTATION.md` eller `todo.md`
