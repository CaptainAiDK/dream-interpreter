# Drømmetolker - Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React + Vite)                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              DreamInterpreter.tsx (Main Page)            │   │
│  │  ┌─────────────────────────────────────────────────────┐ │   │
│  │  │ Tab Navigation (Fuld drøm | Scenarier | Information)│ │   │
│  │  └─────────────────────────────────────────────────────┘ │   │
│  │                                                            │   │
│  │  ┌──────────────────┐  ┌──────────────────┐  ┌──────────┐│   │
│  │  │ FullDreamTab     │  │ ScenariosTab     │  │ Info Tab ││   │
│  │  │ - Textarea       │  │ - Dropdown       │  │ - Content││   │
│  │  │ - Submit button  │  │ - Context input  │  │ - Edu    ││   │
│  │  │ - Results        │  │ - Results        │  │ - Tips   ││   │
│  │  └──────────────────┘  └──────────────────┘  └──────────┘│   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              tRPC Client (React Query)                   │   │
│  │  - dream.interpretFullDream.useMutation()               │   │
│  │  - dream.interpretScenario.useMutation()                │   │
│  │  - dream.getScenarios.useQuery()                        │   │
│  │  - dream.getDreamHistory.useQuery()                     │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓ HTTP/tRPC
┌─────────────────────────────────────────────────────────────────┐
│                    API Gateway (/api/trpc)                       │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                  BACKEND (Express + tRPC)                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              Dream Router (tRPC Procedures)              │   │
│  │                                                            │   │
│  │  ┌─────────────────────────────────────────────────────┐ │   │
│  │  │ interpretFullDream (protected)                      │ │   │
│  │  │ - Validate input (10-5000 chars)                   │ │   │
│  │  │ - Call LLM API                                     │ │   │
│  │  │ - Save to database                                │ │   │
│  │  │ - Return interpretation                           │ │   │
│  │  └─────────────────────────────────────────────────────┘ │   │
│  │                                                            │   │
│  │  ┌─────────────────────────────────────────────────────┐ │   │
│  │  │ interpretScenario (protected)                       │ │   │
│  │  │ - Validate scenario enum                           │ │   │
│  │  │ - Call LLM API with scenario prompt                │ │   │
│  │  │ - Save to database                                │ │   │
│  │  │ - Return interpretation                           │ │   │
│  │  └─────────────────────────────────────────────────────┘ │   │
│  │                                                            │   │
│  │  ┌─────────────────────────────────────────────────────┐ │   │
│  │  │ getScenarios (public)                              │ │   │
│  │  │ - Return 10 predefined scenarios                   │ │   │
│  │  └─────────────────────────────────────────────────────┘ │   │
│  │                                                            │   │
│  │  ┌─────────────────────────────────────────────────────┐ │   │
│  │  │ getDreamHistory (protected)                         │ │   │
│  │  │ - Query dreams for current user                    │ │   │
│  │  │ - Return paginated results                         │ │   │
│  │  └─────────────────────────────────────────────────────┘ │   │
│  │                                                            │   │
│  │  ┌─────────────────────────────────────────────────────┐ │   │
│  │  │ getDream (protected)                               │ │   │
│  │  │ - Get dream + interpretation by ID                 │ │   │
│  │  │ - Verify ownership                                 │ │   │
│  │  │ - Return full details                              │ │   │
│  │  └─────────────────────────────────────────────────────┘ │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              Authentication (OAuth + Session)            │   │
│  │  - Manus OAuth 2.0                                      │   │
│  │  - JWT session cookies                                 │   │
│  │  - Protected procedures require ctx.user               │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Manus Built-in LLM API (Forge)                         │   │
│  │  - Endpoint: BUILT_IN_FORGE_API_URL                    │   │
│  │  - Auth: BUILT_IN_FORGE_API_KEY                        │   │
│  │  - Used for: Dream interpretation                      │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Manus OAuth 2.0                                        │   │
│  │  - Endpoint: OAUTH_SERVER_URL                          │   │
│  │  - Portal: VITE_OAUTH_PORTAL_URL                       │   │
│  │  - Used for: User authentication                       │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE (MySQL)                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ users                                                    │   │
│  │ - id (PK)                                               │   │
│  │ - openId (OAuth identifier)                             │   │
│  │ - name, email, role                                     │   │
│  │ - createdAt, updatedAt, lastSignedIn                    │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ dreams                                                   │   │
│  │ - id (PK)                                               │   │
│  │ - userId (FK → users)                                   │   │
│  │ - dreamText (full dream or scenario name)               │   │
│  │ - type (full | scenario)                                │   │
│  │ - scenario (optional, for scenario type)                │   │
│  │ - additionalContext (optional)                          │   │
│  │ - createdAt                                             │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ dreamInterpretations                                     │   │
│  │ - id (PK)                                               │   │
│  │ - dreamId (FK → dreams)                                 │   │
│  │ - interpretation (full text)                            │   │
│  │ - symbols (JSON array)                                  │   │
│  │ - psychologicalInsights (text)                          │   │
│  │ - createdAt                                             │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow - Full Dream Interpretation

```
User Input (Dream Text)
        ↓
┌─────────────────────────────────┐
│ FullDreamTab Component          │
│ - Validate length (10-5000)     │
│ - Show loading spinner          │
└─────────────────────────────────┘
        ↓
┌─────────────────────────────────┐
│ tRPC Mutation                   │
│ dream.interpretFullDream()      │
└─────────────────────────────────┘
        ↓
┌─────────────────────────────────┐
│ Backend Procedure               │
│ - Validate input                │
│ - Create dream record           │
└─────────────────────────────────┘
        ↓
┌─────────────────────────────────┐
│ LLM API Call (Forge)            │
│ - Send dream text + prompt      │
│ - Get interpretation            │
└─────────────────────────────────┘
        ↓
┌─────────────────────────────────┐
│ Save to Database                │
│ - Save interpretation           │
│ - Parse symbols                 │
│ - Extract insights              │
└─────────────────────────────────┘
        ↓
┌─────────────────────────────────┐
│ Return Response                 │
│ - dreamId, interpretation       │
│ - symbols, insights             │
└─────────────────────────────────┘
        ↓
┌─────────────────────────────────┐
│ Frontend Display                │
│ - Render markdown               │
│ - Show results                  │
│ - Hide loading spinner          │
└─────────────────────────────────┘
```

---

## Technology Decisions

### Frontend: React + Vite
- **Why**: Fast development, hot reload, modern tooling
- **Alternative**: Vue, Svelte (not chosen for React ecosystem)

### Backend: Express + tRPC
- **Why**: Type-safe RPC, automatic API generation, great DX
- **Alternative**: GraphQL (overkill for this use case)

### Database: MySQL + Drizzle ORM
- **Why**: Type-safe, migrations, good performance
- **Alternative**: PostgreSQL (not available in Manus)

### LLM: Manus Built-in Forge API
- **Why**: Already integrated, no setup needed
- **Alternative**: OpenAI API (would need separate account)

### Styling: Tailwind + shadcn/ui
- **Why**: Fast development, consistent design, reusable components
- **Alternative**: Material-UI (heavier, less customizable)

---

## Deployment Architecture

```
┌──────────────────────────────────────────────────┐
│         Manus WebDev Platform                    │
├──────────────────────────────────────────────────┤
│                                                   │
│  ┌────────────────────────────────────────────┐  │
│  │ Cloud Run (Autoscale)                      │  │
│  │ - 1 vCPU, 512 MB RAM                       │  │
│  │ - 180s request timeout                     │  │
│  │ - Min instances: 0 (cold starts)           │  │
│  │ - Auto-scales based on traffic             │  │
│  └────────────────────────────────────────────┘  │
│                                                   │
│  ┌────────────────────────────────────────────┐  │
│  │ Application                                │  │
│  │ - Express server (Node.js)                 │  │
│  │ - React SPA (Vite build)                   │  │
│  │ - tRPC endpoints                           │  │
│  └────────────────────────────────────────────┘  │
│                                                   │
│  ┌────────────────────────────────────────────┐  │
│  │ Database                                   │  │
│  │ - MySQL (TiDB)                             │  │
│  │ - Managed by Manus                         │  │
│  │ - Automatic backups                        │  │
│  └────────────────────────────────────────────┘  │
│                                                   │
│  ┌────────────────────────────────────────────┐  │
│  │ Custom Domain                              │  │
│  │ - xxx.manus.space (default)                │  │
│  │ - Custom domain support                    │  │
│  │ - SSL/TLS automatic                        │  │
│  └────────────────────────────────────────────┘  │
│                                                   │
└──────────────────────────────────────────────────┘
```

---

## Security Considerations

1. **Authentication**: OAuth 2.0 via Manus (no password storage)
2. **Authorization**: Protected procedures check `ctx.user`
3. **Database**: User can only see their own dreams
4. **API Keys**: Stored securely in environment variables
5. **HTTPS**: Automatic SSL/TLS on Manus platform
6. **CORS**: Configured for same-origin requests
7. **Input Validation**: Zod schema validation on all inputs

---

## Performance Optimizations

1. **Frontend**:
   - Vite for fast builds
   - React Query for caching
   - Lazy loading of components
   - Optimized bundle size

2. **Backend**:
   - Database connection pooling
   - Query optimization with Drizzle
   - LLM response caching (future)
   - Rate limiting (future)

3. **Database**:
   - Indexed foreign keys
   - Efficient schema design
   - Connection pooling

---

## Scalability Considerations

**Current**: Single instance, auto-scaling to 0

**Future improvements**:
- Redis caching for LLM responses
- Database read replicas
- CDN for static assets
- Message queue for async jobs
- Reserved hosting for always-on instances

---

**Last Updated:** 2026-07-24
**Version:** 1.0.0
