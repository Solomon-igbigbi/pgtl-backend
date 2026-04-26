# PGTL Backend — NestJS API

Transaction Ledger Reconciliation and Fraud Detection service built with **NestJS 11**, **TypeORM 0.3**, and **PostgreSQL**.

---

## Prerequisites

| Requirement | Version |
|---|---|
| Node.js | 20 or higher |
| npm | 9 or higher |
| PostgreSQL | 14 or higher |

---

## Running Locally

### 1. Create the database

```bash
psql -U postgres -c "CREATE DATABASE pgtl_test;"
```

### 2. Configure environment variables

```bash
cp .env.sample .env
```

Open `.env` and fill in your local credentials:

```env
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=yourpassword
DATABASE_NAME=pgtl_test
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run start:dev
```

The API will be available at **http://localhost:3001**.

> `synchronize: true` is active in development — TypeORM automatically creates the `flagged_transactions` table on first run. No migration step is needed locally.

Swagger UI: **http://localhost:3001/api/docs**

---

## Available Scripts

| Script | What it does |
|---|---|
| `npm run start:dev` | Start in watch mode (auto-restarts on change) |
| `npm run start:debug` | Start with Node.js debugger on port 9229 |
| `npm run build` | Compile TypeScript into `dist/` |
| `npm run start:prod` | Run the compiled production build |
| `npm run test` | Run unit tests with Jest |
| `npm run test:cov` | Run tests and generate a coverage report |
| `npm run test:e2e` | Run end-to-end tests |
| `npm run lint` | Run ESLint and auto-fix violations |
| `npm run format` | Format source files with Prettier |
| `npm run migration:generate --name=X` | Generate a TypeORM migration diff |
| `npm run migration:run` | Apply pending migrations |
| `npm run migration:revert` | Roll back the last applied migration |

---

## API Reference

### Test 1 — Reconciliation

#### `POST /reconcile`

Upload two CSV files and receive a discrepancy report.

**Request** — `multipart/form-data`:

| Field | Type | Description |
|---|---|---|
| `fileA` | file | CSV from Source System A |
| `fileB` | file | CSV from Source System B |
| `page` | query | Page number (default: 1) |
| `limit` | query | Results per page (default: 50) |

**Expected CSV format:**

```csv
transaction_id,timestamp,amount,currency,status
TXN-001,2024-01-15T10:30:00Z,1500.00,USD,SUCCESS
TXN-002,2024-01-15T11:00:00Z,2200.50,GBP,FAILED
```

**Example:**

```bash
curl -X POST "http://localhost:3001/reconcile?page=1&limit=50" \
  -F "fileA=@source_system_a.csv" \
  -F "fileB=@source_system_b.csv"
```

**Response:**

```json
{
  "result": {
    "summary": {
      "totalInA": 101500,
      "totalInB": 101400,
      "missingInA": 5000,
      "missingInB": 5100,
      "amountMismatches": 6800,
      "statusMismatches": 5246
    },
    "missingInA": [ { "transactionId": "...", "amount": "...", ... } ],
    "missingInB": [ { "transactionId": "...", "amount": "...", ... } ],
    "amountMismatches": [ { "transactionId": "...", "amountInA": "...", "amountInB": "..." } ],
    "statusMismatches": [ { "transactionId": "...", "statusInA": "...", "statusInB": "..." } ],
    "page": 1,
    "limit": 50,
    "totalPages": 204
  }
}
```

---

### Test 2 — Fraud Detection

#### `POST /fraud-check/upload`

Upload a JSON transaction file. The service runs three fraud detection passes and persists all flagged records.

**Request** — `multipart/form-data`:

| Field | Type | Description |
|---|---|---|
| `file` | file | JSON array of transactions |

**Expected JSON format:**

```json
[
  {
    "transactionId": "TXN-001",
    "userId": "USER-001",
    "amount": 15000,
    "timestamp": "2024-06-15T10:00:00Z",
    "merchant": "Amazon",
    "location": "New York"
  }
]
```

**Example:**

```bash
curl -X POST http://localhost:3001/fraud-check/upload \
  -F "file=@fraud_transactions.json"
```

**Response:**

```json
{
  "result": {
    "totalTransactions": 96333,
    "totalFlagged": 1247,
    "byType": {
      "FREQUENCY": 312,
      "DAILY_LIMIT": 89,
      "LOCATION_VELOCITY": 846
    }
  }
}
```

#### `GET /fraud-check`

Query persisted flagged transactions with optional user filter and pagination.

| Query param | Type | Description |
|---|---|---|
| `userId` | string | Filter by a specific user (optional) |
| `page` | number | Page number (default: 1) |
| `limit` | number | Results per page (default: 50) |

```bash
# All flagged transactions
curl "http://localhost:3001/fraud-check?page=1&limit=50"

# Filtered by user
curl "http://localhost:3001/fraud-check?userId=USER-VEL-001"
```

---

## Architecture

```
src/
├── broker/                   # Wraps usecases in a single DB transaction
├── configs/                  # Environment config, validation schema, TypeORM config
├── shared/
│   └── repositories/         # BaseEntity, SnakeCaseNamingStrategy
├── adapters/
│   └── repositories/         # FlaggedTransactionRepository
└── modules/
    ├── core/entities/         # FlaggedTransaction entity
    ├── reconciliation/
    │   ├── controllers/       # POST /reconcile
    │   ├── services/          # CSV buffer parsing + reconciliation logic
    │   └── usecases/          # ReconcileFilesUsecase
    └── fraud/
        ├── controllers/       # POST /fraud-check/upload, GET /fraud-check
        ├── services/          # FraudDetectionService (algorithms), FraudService (I/O)
        └── usecases/          # ProcessFraudFileUsecase, FetchFlaggedTransactionsUsecase
```

**Request flow:**

```
HTTP Request
  → Controller        (file extraction, query params)
    → Broker          (opens a single DB transaction for all usecases)
      → Usecase       (orchestrates the operation)
        → Service     (business / detection logic)
          → Repository (TypeORM DB access)
```

---

## How It Works

### Test 1 — Reconciliation

1. Both CSV files are received as in-memory buffers via multer `memoryStorage`.
2. Each buffer is wrapped in `Readable.from([buffer])` and piped through `csv-parser`.  
   `mapHeaders` converts `snake_case` column headers (e.g. `transaction_id`) to `camelCase` (`transactionId`) at parse time.
3. Each file is loaded into a `Map<transactionId, row>` — O(1) key lookups.
4. A single comparison pass detects:
   - Keys in A not in B → **missing in B**
   - Keys in B not in A → **missing in A**
   - Same key, `|amountA − amountB| > 0.001` → **amount mismatch**
   - Same key, status differs (case-insensitive) → **status mismatch**
5. Results are paginated before the response is sent.

### Test 2 — Fraud Detection

Three sliding-window algorithms execute in a **single O(n) pass**:

| Pattern | Data structure | Trigger rule |
|---|---|---|
| **Velocity** | Deque of timestamps per `userId` | > 5 transactions within any 60-second window |
| **Daily limit** | Running total keyed by `userId:YYYY-MM-DD` | Cumulative amount exceeds $10,000 in one calendar day |
| **Location jump** | Sliding list of `{location, timestamp}` per `userId` | Different location appears within 2 minutes of the previous one |

Flagged records are bulk-inserted in 500-row chunks with `entityManager.insert()`.

---

## Database Schema

```sql
CREATE TABLE flagged_transactions (
  id              SERIAL PRIMARY KEY,
  transaction_id  VARCHAR        NOT NULL,
  user_id         VARCHAR        NOT NULL,
  amount          DECIMAL(15,2)  NOT NULL,
  timestamp       TIMESTAMPTZ    NOT NULL,
  merchant        VARCHAR,
  location        VARCHAR,
  fraud_type      VARCHAR        NOT NULL,
  created_at      TIMESTAMPTZ    DEFAULT NOW(),
  updated_at      TIMESTAMPTZ    DEFAULT NOW(),
  deleted_at      TIMESTAMPTZ,
  created_by      VARCHAR,
  updated_by      VARCHAR
);

CREATE INDEX idx_flagged_user_id ON flagged_transactions(user_id);
```

---

## Improvements Given More Time

### Performance

- **PostgreSQL `COPY FROM STDIN`** — replace chunked `INSERT` statements with `pg-copy-streams`. For 90k+ rows this is roughly 50× faster as it bypasses the SQL parser, planner, and per-row parameter binding entirely.
- **Parallel chunk inserts** — run multiple 500-row `INSERT` chunks concurrently with `Promise.all` instead of sequentially, reducing total DB round-trip time from O(chunks) to O(chunks/concurrency).
- **Sort transactions by timestamp before detection** — the sliding-window algorithms assume chronological order. On shuffled data, windows don't evict correctly, producing false negatives. A pre-sort ensures algorithmic correctness.
- **Worker threads for fraud detection** — move the O(n) detection pass off the main event loop into a `worker_threads` pool so concurrent HTTP requests are never starved during large file processing.
- **Streaming JSON parsing** — process the uploaded JSON as a Node.js stream (e.g. `stream-json`) instead of `JSON.parse()` on the full in-memory buffer, keeping memory usage constant regardless of file size.

### Correctness & Robustness

- **Idempotent uploads** — add an `upload_batch_id` column and `ON CONFLICT DO NOTHING` so re-uploading the same file does not create duplicate flagged records.
- **Location normalisation** — trim and lowercase location strings before comparison so `"New York"` and `" new york "` resolve to the same city.
- **Currency-aware reconciliation** — when two rows share a transaction ID but differ in currency, flag it as a *currency mismatch* rather than grouping it with amount mismatches.
- **Configurable fraud thresholds** — move the hard-coded `60 000 ms`, `$10 000`, and `2 min` constants to environment variables or a database-backed config table so they can be tuned per-client without redeploying.

### Production Readiness

- **TypeORM migrations** — replace `synchronize: true` with versioned migration files so schema changes are tracked, reviewable, and safely applied in production.
- **Authentication & rate limiting** — add API key or JWT auth and per-IP/per-key rate limiting via `@nestjs/throttler` to prevent abuse of the upload endpoints.
- **Async processing with a job queue** — return a job ID immediately on upload and process the file in the background with BullMQ or Kafka. The frontend polls or subscribes via WebSocket for the result. This eliminates multi-minute HTTP timeouts for large files.
- **Structured logging & observability** — integrate Pino for structured JSON logs, OpenTelemetry for distributed tracing, and expose a Prometheus `/metrics` endpoint tracking upload duration, flagged rate, and DB insert latency.
- **Unit and integration tests** — the Jest scaffold is already in place. Priority tests would cover: the reconciliation comparison logic (all four discrepancy types), each fraud detection algorithm boundary condition, and the CSV parsing snake→camelCase header transform.
