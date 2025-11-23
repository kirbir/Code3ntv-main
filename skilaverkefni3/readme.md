# Skilaverkefni 3: Express API með PostgreSQL

Verkefni í að byggja REST API með Express og tengja það við PostgreSQL gagnagrunn með pg-promise.

- **Sett fyrir:** [Dagsetning] 8. Nov
- **Skilafrestur:** [Dagsetning] 22. Nov kl 00:00

## Yfirlit

Í þessu verkefni muntu byggja fullkomið REST API sem tengist við PostgreSQL gagnagrunn fyrir uppskriftir, þú munt:

- Setja upp Express server með TypeScript
- Tengja við PostgreSQL með pg-promise
- Búa til RESTful endpoints
- Útfæra CRUD aðgerðir (Create, Read, Update, Delete)
- Meðhöndla villur og validation
- Skipuleggja kóða með controllers, models og routes

## Gagnagrunnsskema

Verkefnið byggir á eftirfarandi töflum:

### **Cuisines Table**

```sql
CREATE TABLE cuisines (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);
```

### **Recipes Table**

```sql
CREATE TABLE recipes (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    cook_time_minutes INTEGER,
    difficulty VARCHAR(50),
    rating DECIMAL(3,1) CHECK (rating >= 0 AND rating <= 5),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    cuisine_id BIGINT NOT NULL,

    FOREIGN KEY (cuisine_id) REFERENCES cuisines(id) ON DELETE CASCADE
);
```

## Uppsetning

### 1. Búa til verkefnismöppu og package.json

```bash
mkdir skilaverkefni-3
cd skilaverkefni-3
npm init -y
```

### 2. Setja upp dependencies

```bash
# Production dependencies
npm install express pg-promise dotenv

# Development dependencies
npm install -D @types/express @types/node @types/pg typescript tsx nodemon ts-node
```

### 3. Setja upp TypeScript

Bættu við í `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "allowJs": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 4. Uppfæra package.json

Bættu við þessum scripts og type:

```json
{
  "type": "module",
  "scripts": {
    "dev": "nodemon --exec tsx src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  }
}
```

### 5. Umhverfisbreytur (.env)

Búðu til `.env` skrá í rót verkefnisins:

```env
PORT=3000
PGHOST=localhost
PGPORT=5432
PGDATABASE=recipe_homework
PGUSER=your_username
PGPASSWORD=your_password
```

**⚠️ Mikilvægt:** Bættu `.env` við `.gitignore` skrána þína!

## Verkefnisuppbygging

Búðu til eftirfarandi möppustrúktúr:

```
src/
├── config/
│   └── db.ts
├── controllers/
│   ├── cuisineController.ts
│   └── recipeController.ts
├── models/
│   ├── cuisineModel.ts
│   └── recipeModel.ts
├── routes/
│   ├── cuisineRoutes.ts
│   └── recipeRoutes.ts
├── schemas/
│   ├── cuisineSchema.ts
│   └── recipeSchema.ts
├── middleware/
│   ├── validate.ts
│   └── errorHandler.ts
├── app.ts
└── server.ts
```

## API Endpoints og Gögn

📋 **Sjá nákvæmar upplýsingar um öll API endpoints í [`EXPECTED_RESPONSES.md`](./EXPECTED_RESPONSES.md)**

Þessi skrá inniheldur:

- Nákvæmt JSON format fyrir öll endpoints
- Request og response dæmi
- Error handling og status codes
- Validation reglur
- Test cases sem þarf að meðhöndla

## Verkefnakröfur

### Hluti A: Grunnvirkni (60%)

1. **Uppsetning og tengingar (10%)**

   - ✅ Rétt package.json með öllum dependencies
   - ✅ TypeScript configuration
   - ✅ Gagnagrunnstengingu með pg-promise
   - ✅ Environment variables (.env)

2. **Cuisine API (25%)**

   - ✅ GET /api/cuisines (öll matargerð)
   - ✅ POST /api/cuisines (búa til nýja)
   - ✅ PUT /api/cuisines/:id (uppfæra)
   - ✅ DELETE /api/cuisines/:id (eyða)

3. **Recipe API (25%)**

   - ✅ GET /api/recipes (allar uppskriftir)
   - ✅ GET /api/recipes/:id (ein uppskrift)
   - ✅ POST /api/recipes (búa til nýja)
   - ✅ PUT /api/recipes/:id (uppfæra)
   - ✅ DELETE /api/recipes/:id (eyða)

### Hluti B: Ítarlegri virkni (40%)

5. **Flóknar fyrirspurnir (15%)**

   - ✅ GET /api/cuisines/:id/recipes (allar uppskriftir úr x matargerð)
   - ✅ GET /api/search?q=query (leita í uppskriftum og matargerðum)

6. **Validation og Error Handling (15%)**

   - ✅ Input validation í öllum endpoints
   - ✅ Proper HTTP status codes
   - ✅ Error handling middleware
   - ✅ Meaningful error messages

7. **Kóðagæði og skipulag (10%)**
   - ✅ Rétt möppustrúktúr (MVC pattern)
   - ✅ TypeScript interfaces
   - ✅ Consistent naming conventions

## Prófun

### Handvirk prófun með curl eða Postman

```bash
# Sækja allar uppskriftir
curl http://localhost:3000/api/recipes

# Búa til nýja matargerðu
curl -X POST http://localhost:3000/api/cuisines \
  -H "Content-Type: application/json" \
  -d '{"name": "Italian"}'

# Búa til nýja uppskrift
curl -X POST http://localhost:3000/api/recipes \
  -H "Content-Type: application/json" \
  -d '{"title": "Pasta Carbonara", "description": "Classic Italian pasta dish with eggs, cheese, and pancetta", "cook_time_minutes": 30, "difficulty": "medium", "rating": 4.5, "cuisine_id": 1}'

# Uppfæra uppskrift
curl -X PUT http://localhost:3000/api/recipes/1 \
  -H "Content-Type: application/json" \
  -d '{"rating": 5.0}'

# Sækja uppskriftir eftir matargerðu
curl http://localhost:3000/api/cuisines/1/recipes

# Leita í uppskriftum
curl "http://localhost:3000/api/search?q=pasta"
```

## Ábendingar

- **Byrjaðu á Cusine API** - það er einfaldast
- **Prófaðu endpoints jafnóðum** með Postman eða curl (Ennþá betra að nota vitest)
- **Notaðu console.log** til að debug
- **Lestu error messages** vandlega
- **Gerðu commit oft** til að geta farið til baka

## Algengar villur

1. **Import/Export villur** - Mundu að nota `.js` extension í imports
2. **Database tengingar** - Athugaðu .env stillingar
3. **TypeScript villur** - Skilgreindu interfaces rétt
4. **Async/await** - Gleymt await fyrir database köll

## Skil

Skilaðu öllum kóða í zip skrá eða GitHub repository með:

- ✅ Öllum source kóða
- ✅ package.json og package-lock.json
- ✅ README.md með leiðbeiningum um keyrslu
- ✅ .env.example skrá (án raunverulegra passwords)

## Aðstoð

- Skoðaðu lesson9, lesson11 og lesson14
- Notaðu PostgreSQL og pg-promise documentation
- Spurðu í tíma eða á Teams
- Express.js documentation er mjög gagnleg

## Viðbótarverkefni (Bonus)

Ef þú vilt fá aukapunkta:

- ✅ **Pagination** - Bættu við `?page=1&limit=10` support
- ✅ **Sorting** - `?sort=name&order=desc`
- ✅ **Unit Tests** - Með Vitest

Gangi þér vel! 👩‍🍳
