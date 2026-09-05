# Student Counseling Intake System

A full-stack web application for students to submit confidential counseling intake requests and for counselors to review and update submission statuses.

## Tech Stack

- **Frontend:** React (Vite), Tailwind CSS, Lucide Icons, react-signature-canvas
- **Backend:** Node.js with Express.js
- **Database:** PostgreSQL with Prisma ORM
- **Validation:** Zod
- **Security:** CORS, Helmet, express-rate-limit

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm

### 1. Clone and Setup

```bash
cd counseling-system
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your PostgreSQL credentials
npx prisma migrate dev --name init
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173` and the API at `http://localhost:3001`.

### Environment Variables

Create a `.env` file in the `backend` directory:

```
PORT=3001
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/counseling_db
NODE_ENV=development
```

### Database Migration

```bash
cd backend
npx prisma migrate dev --name init
```

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/counseling/submit` | Submit a new counseling request |
| GET | `/api/v1/counseling/requests` | Get paginated requests (query: status, page, limit) |
| PATCH | `/api/v1/counseling/requests/:id/status` | Update request status |
| GET | `/api/v1/counseling/counts` | Get request counts by status |
| GET | `/api/v1/health` | Health check |

### Project Structure

```
counseling-system/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   └── counselingController.js
│   │   ├── middleware/
│   │   │   └── validate.js
│   │   ├── models/
│   │   │   ├── student.js
│   │   │   └── counselingRequest.js
│   │   ├── routes/
│   │   │   └── counselingRoutes.js
│   │   ├── validators/
│   │   │   └── counseling.js
│   │   ├── server.js
│   │   └── index.js
│   ├── prisma/
│   │   └── schema.prisma
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── FormContainer.jsx
│   │   │   ├── FormStep1.jsx
│   │   │   ├── FormStep2.jsx
│   │   │   ├── FormStep3.jsx
│   │   │   ├── FormStep4.jsx
│   │   │   └── SignatureCanvas.jsx
│   │   ├── pages/
│   │   │   ├── CounselingForm.jsx
│   │   │   ├── SuccessPage.jsx
│   │   │   └── CounselorDashboard.jsx
│   │   ├── hooks/
│   │   │   └── useForm.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
└── README.md
```