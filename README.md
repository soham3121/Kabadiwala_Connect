# Kabadiwala Connect (कबाड़ीवाला कनेक्ट)
> **Bringing the Informal Collector into the Formal Recycling Chain**  
> **Smart India Hackathon (SIH 2026)** | **Organization:** Ministry of Mines (MoM)  
> **Department:** Jawaharlal Nehru Aluminium Research Development and Design Centre (JNARDDC)  
> **Theme:** Clean & Green Technology | **Category:** Software  

---

## 📌 Problem Overview & Objectives
In India, over **90% of end-of-life electronics (e-waste)** are handled by informal scrap collectors (*kabadiwalas*) and waste-pickers. Due to a lack of price transparency and direct access to authorized recyclers, collected materials frequently undergo hazardous backyard processing (open-air cable burning, nitric acid boiling of PCBs, and manual CRT smashing). This exposes workers to severe health risks (cancer-causing dioxins, lead poisoning) and permanently destroys critical high-value minerals (Lithium, Cobalt, Neodymium, Gold, Gallium).

**Kabadiwala Connect** bridges the informal collector directly into the formal recycling ecosystem established under the **E-Waste (Management) Rules, 2022**.

---

## 🌟 Key Features & SIH Winning Highlights

1. **Low-Literacy & Vernacular Interface (Hindi, Marathi, English)**:
   - Visual material icons, high-contrast touchcards, and simplified weight stepper controls.
   - **Native Text-to-Speech (TTS)** voice synthesis reading daily prices and safety warnings out loud in Hindi, Marathi, and English.
2. **Offline-Tolerant Architecture**:
   - Scrap lots can be created without an internet connection in scrap hubs and dump clusters.
   - Offline lots are queued locally with immediate Handover Passes and automatically synchronized to the CPCB network upon reconnection.
3. **Transparent Price Discovery & Machine Learning Valuation**:
   - Daily price board linked with CPCB benchmark rates.
   - Instant calculation showing the **informal middleman price vs. formal authorized recycler price** (+25% to 45% income jump).
   - Anomaly detection flagging abnormal weights or price deviations >30%.
4. **End-to-End Traceability & Form 6 Digital Handover**:
   - Generates unique Lot ID and cryptographic QR Code (`EPR-SHA256-...`).
   - Captures GPS coordinates, timestamps, and scrap photographs.
   - Authorized Recycler Portal with calibrated scale verification and digital **EPR Certificate of Custody** generation.
5. **Unit Economics Assessment**:
   - Demonstrates how a typical collector earns **+₹21,925/month additional income** (+45.7%).
   - Self-sustaining platform model funded through a 0.75% recycler facilitation fee paid from EPR compliance credits.
6. **6 Structured Datasets for Evaluation**:
   - Material Dataset, Price Dataset, Recycler Dataset, Transaction Dataset, Traceability Dataset, and Collector Profile Dataset with live JSON search and export.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18 or higher (tested on Node v20/v26)
- **npm**: 9+

### 2. Start Express Backend
```powershell
cd server
npm install
node server.js
```
*Backend runs on:* `http://localhost:5000`

### 3. Start React Frontend
In a new terminal:
```powershell
cd client
npm install
npm run dev
```
*Frontend runs on:* `http://localhost:5173`

---

## 📂 Project Structure

```
kabadiwallah/
├── server/
│   ├── server.js              # Express REST APIs & ML simulation
│   ├── package.json
│   └── data/
│       ├── materials.json     # Material categories, hazard info, critical minerals
│       ├── recyclers.json     # CPCB/SPCB authorized recyclers & pickup details
│       ├── prices.json        # Prevailing scrap rates, trends, and spoken scripts
│       ├── transactions.json  # Handover logs, GPS coordinates, EPR hashes
│       └── safety.json        # Audio-visual hazard warnings (cables, batteries, CRTs)
├── client/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── src/
│       ├── App.jsx            # Main app with multi-role router & offline sync
│       ├── components/
│       │   ├── Header.jsx     # Language picker, offline simulator, SIH banner
│       │   ├── CollectorView/
│       │   │   ├── LotCreation.jsx    # Visual category cards, photo, weight, valuation
│       │   │   ├── HandoverPass.jsx   # QR Pass with GPS & timestamp
│       │   │   ├── PriceBoard.jsx     # Daily rates with spoken audio & 7-day trend
│       │   │   ├── EarningsLedger.jsx # Cash/UPI earnings tracker & profit bonus
│       │   │   └── SafetyGuide.jsx    # Audio-visual safety alerts for toxic hazards
│       │   ├── RecyclerView/
│       │   │   ├── RecyclerDashboard.jsx # Calibrated scale verification & handover
│       │   │   └── EPRCertificateModal.jsx # Official Form 6 EPR Custody Certificate
│       │   ├── Economics/
│       │   │   └── UnitEconomics.jsx  # Interactive informal vs formal earnings model
│       │   └── Datasets/
│       │       └── DatasetViewer.jsx  # SIH judge inspection & JSON download for 6 datasets
│       └── utils/
│           ├── speech.js          # Speech synthesis for Hindi, Marathi, English
│           ├── translations.js    # Vernacular dictionaries
│           └── offlineStorage.js  # Offline queue & auto-sync
└── README.md
```

---

## 📊 Unit Economics Summary
| Electronic Scrap Category | Informal Middleman Rate | Formal Recycler Rate | Collector Gain |
| :--- | :--- | :--- | :--- |
| **High-Grade Computer PCBs** | ₹220 / kg | **₹380 / kg** | **+72.7%** |
| **Copper Cables & Wires** | ₹310 / kg | **₹460 / kg** | **+48.4%** |
| **Lithium-ion Batteries** | ₹110 / kg | **₹240 / kg** | **+118.2%** |
| **Electric Motors & HDDs** | ₹85 / kg | **₹140 / kg** | **+64.7%** |
| **Engineering Plastics (ABS)** | ₹18 / kg | **₹45 / kg** | **+150.0%** |
| **Average Monthly Total (250 kg)** | ₹47,925 | **₹69,850** | **+₹21,925 (+45.7%)** |

---

## 👥 Roles & Workflows Supported
1. **Collector (Informal Scrap Dealer)**:
   - Registers digital scrap lots, selects category, inputs approximate weight, and reviews instant fair valuation.
   - Views nearby CPCB-authorized recyclers and triggers doorstep pickup.
   - Shows QR code handover pass on smartphone.
   - Listens to daily price announcements and safety guidelines in their mother tongue.
2. **Authorized Recycler**:
   - Reviews inbound collector lots and dispatches collection vehicles.
   - Verifies scrap grade and weighs on calibrated digital scale.
   - Confirms cash or UPI payment and issues digital Form 6 EPR Chain of Custody certificate.
3. **MoM / JNARDDC Inspector**:
   - Inspects real-time dataset exports, trace logs, and compliance audit trail.
