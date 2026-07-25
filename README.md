# PagePulse — URL Auditor

PagePulse is a lightning-fast URL auditing tool that instantly generates a comprehensive report on any webpage's HTTP status, response time, SEO metadata, and accessibility signals.

## Live Demo
- **Frontend (GitHub Pages):** [https://dharal-naik2010.github.io/DH-pagepulse/](https://dharal-naik2010.github.io/DH-pagepulse/)
- **Backend (Render):** [https://dh-pagepulse.onrender.com](https://dh-pagepulse.onrender.com)

---

## Setup Instructions

### 1. Prerequisites
- Node.js (v18+)
- npm

### 2. Backend Setup
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   *The backend will run on `http://localhost:3000`.*

### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend will run on `http://localhost:5173`. It automatically proxies API requests to the local backend during development.*

### 4. Running Tests
The backend parsing logic is fully tested using Jest. To run the test suite:
```bash
cd backend
npm test
```

---

## API Contract

### `POST /api/audit`
Initiates an audit for the provided URL.

**Request Body:**
```json
{
  "url": "https://example.com"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "url": "https://example.com",
    "httpStatus": 200,
    "responseTimeMs": 142,
    "title": "Example Domain",
    "metaDescription": null,
    "h1Count": 1,
    "imagesMissingAlt": 0,
    "wordCount": 11,
    "auditedAt": "2026-07-25T01:40:00.000Z"
  }
}
```

**Error Response (400 / 500):**
```json
{
  "success": false,
  "error": {
    "code": "FETCH_TIMEOUT",
    "message": "The request timed out after 10 seconds"
  }
}
```

---

## Design Decisions

### 1. Decoupled Architecture (Separate Frontend & Backend)
**Decision:** We built the application using a strict separation of concerns — a React frontend communicating via HTTP to a Node.js backend, rather than a monolithic full-stack framework (like Next.js with Server Actions).
**Reasoning:** Scraping and parsing third-party HTML is highly unpredictable and can be computationally expensive or prone to hanging. By keeping the backend isolated, we prevent a slow scrape from freezing the user interface. It also allows the backend to be scaled completely independently (e.g., adding a queueing system later) without touching the presentation layer.

### 2. Vanilla CSS over Utility Frameworks (Tailwind)
**Decision:** The entire frontend is styled using pure, vanilla CSS with custom variables, avoiding frameworks like TailwindCSS or Bootstrap.
**Reasoning:** To achieve a premium, highly dynamic aesthetic (such as the SVG heartbeat drawing animation and the cascading fade-up card effects), we needed precise control over keyframes and transitions. Vanilla CSS keeps the HTML markup incredibly clean and semantic, and avoids the steep learning curve and bundle bloat of setting up a framework just for a single-page tool. 

### 3. Graceful Error Normalisation
**Decision:** Instead of passing raw Node.js/Axios error traces back to the client, the backend explicitly normalises every possible failure (DNS errors, connection refusals, timeouts, non-HTML responses) into a standardized `{ code, message }` schema.
**Reasoning:** End users do not understand `ECONNABORTED` or `EAI_AGAIN`. By categorising errors on the server, the frontend can deterministically map these error codes to friendly UI components (e.g., displaying a specific "Could Not Reach URL" banner with an actionable suggestion to check the spelling), drastically improving the user experience during failure states. 
