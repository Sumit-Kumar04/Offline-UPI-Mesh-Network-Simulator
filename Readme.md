# Offline UPI Mesh Network Simulator

A full-stack simulation of **encrypted offline UPI payments** routed through a **Bluetooth mesh network** with **deferred settlement** via a gateway device.

> Payment intent travels offline across nearby phones → Gateway uploads to backend → Backend decrypts & settles → ACK returns to sender.

![Stack](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![Stack](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=nodedotjs)
![Stack](https://img.shields.io/badge/MongoDB-Database-47A248?style=flat-square&logo=mongodb)
![Stack](https://img.shields.io/badge/Socket.IO-Realtime-010101?style=flat-square&logo=socketdotio)

---

## Features

- **Encrypted mesh routing** — AES-256-CBC encrypted packets propagate via gossip protocol
- **Interactive dashboard** — React Flow mesh visualization with live packet animations
- **Deferred settlement** — Gateway flushes packets to backend when internet is available
- **Duplicate protection** — SHA-256 hashing + idempotency cache prevents double settlement
- **Real-time updates** — Socket.IO live event stream
- **Fintech-grade UI** — Dark glassmorphism dashboard with Chart.js analytics

---

## Architecture

```
Alice ── Bob          Charlie ── David
  │       │              │        │
  └───────┴──────────────┴────────┘
                  │
              Gateway (Internet)
                  │
              Backend API
                  │
              MongoDB
```

| Phase | Action | Result |
|-------|--------|--------|
| 1 | Inject Packet | Encrypted payment on sender's phone |
| 2 | Gossip Round | Packet replicates across mesh (TTL--) |
| 3 | Flush Gateway | Gateway uploads ciphertext to backend |
| 4 | Settlement | Decrypt → validate → update balances |
| 5 | ACK | Sender receives settlement confirmation |

📄 **Full documentation:** [`docs/PROJECT_GUIDE.md`](docs/PROJECT_GUIDE.md)

---

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React, Vite, React Flow, Framer Motion, Chart.js, Socket.IO Client |
| Backend | Node.js, Express, Socket.IO, Mongoose |
| Database | MongoDB |
| Security | AES-256-CBC, SHA-256, UUID nonce, idempotency cache |

---

## Prerequisites

- **Node.js** 18+
- **MongoDB** (local or Atlas)
- npm

---

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/Sumit-Kumar04/Offline-UPI-Mesh-Network-Simulator.git
cd offline-upi-mesh
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
MONGO_URI=mongodb://127.0.0.1:27017/upi_mesh
PORT=5000
```

Start the backend:

```bash
npm run dev
```

### 3. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173**

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/payments/send` | Create & inject encrypted packet |
| `GET` | `/api/mesh/state` | Current mesh device state |
| `POST` | `/api/mesh/gossip` | Run gossip propagation round |
| `POST` | `/api/mesh/flush` | Gateway upload & settlement |
| `POST` | `/api/mesh/reset` | Reset mesh & idempotency cache |
| `GET` | `/api/accounts` | Wallet balances |
| `GET` | `/api/transactions` | Settlement history |

---

## Demo Workflow

1. Select **Sender** (Alice) and **Receiver** (Bob), enter amount
2. Click **Inject Packet**
3. Click **Run Gossip Round** (repeat 2–3 times)
4. Click **Flush Gateway** → settlement modal appears
5. Check **Transaction Ledger** and updated **Account Balances**

---

## Project Structure

```
upi/
├── backend/
│   ├── controllers/     # Route handlers
│   ├── services/        # Crypto, mesh, settlement logic
│   ├── models/          # MongoDB schemas
│   ├── routes/          # Express routes
│   └── data/            # In-memory mesh store
├── frontend/
│   └── src/
│       ├── components/  # Dashboard & mesh UI
│       ├── hooks/       # useDashboard state management
│       ├── constants/   # Mesh config
│       └── utils/       # Helpers
└── docs/
    └── PROJECT_GUIDE.md       # Full documentation & interview prep
```

---

## Security (Summary)

| Mechanism | Algorithm | Purpose |
|-----------|-----------|---------|
| Encryption | AES-256-CBC | Hide payment data on mesh |
| Hashing | SHA-256 | Packet fingerprint & dedup |
| Idempotency | In-memory Set | Prevent double settlement |
| Replay design | UUID nonce + timestamp | Unique payment identification |
| TTL | Hop counter (starts at 5) | Limit mesh propagation |

> See [`docs/PROJECT_GUIDE.md`](docs/PROJECT_GUIDE.md) for full security analysis, pros/cons, and interview Q&A.

---

## Interview Highlights

- **Deferred settlement** — offline intent vs online settlement
- **Gossip protocol** — epidemic broadcast for mesh propagation
- **Three-layer dedup** — mesh packetId, gateway hash, DB unique constraint
- **Gateway trust model** — only gateway/backend can decrypt
- **Production gaps** — AES-GCM, digital signatures, Redis idempotency (discuss honestly)

---

## License

MIT

---

## Author

Major Project — Offline UPI Mesh Network Simulator
