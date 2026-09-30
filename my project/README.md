# LearnMate – AI Assistant for Smarter Learning and Study Support

LearnMate is a full-stack, AI-powered study assistant built for students and educators. It enables students to upload notes and documents, generate concise examination summaries, create interactive flashcard revision decks, generate practice multiple-choice quizzes, and build personalized study plans powered by **Google Gemini AI**. It also provides administrative control and analytics for system administrators.

---

## 🚀 Technology Stack

### Frontend
- **React.js** (Vite SPA framework)
- **Modern Responsive CSS3** (Custom design system & 3D card flip animations)
- **Axios** (API communication with automatic JWT interceptors)
- **Lucide React** (Modern SVG Icon set)
- **React Router v6** (Role-based client-side routing)

### Backend
- **Node.js & Express.js** (Modular RESTful API server)
- **MongoDB & Mongoose** (NoSQL document store & schemas)
- **JWT (JSON Web Tokens)** (Stateless session authentication)
- **bcryptjs** (Secure salt-hashed password storage)
- **Multer & pdf-parse** (File uploads and document text parsing)
- **Google Gen AI SDK (`@google/genai` & `@google/generative-ai`)** (Google Gemini AI integration)

---

## 📁 Project Structure

```text
LearnMate/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── AdminRoute.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── FlashcardViewer.jsx
│   │   │   ├── QuizViewer.jsx
│   │   │   └── StudyPlanViewer.jsx
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── MaterialsPage.jsx
│   │   │   ├── MaterialDetailPage.jsx
│   │   │   ├── StudyPlanPage.jsx
│   │   │   ├── ResourceHistoryPage.jsx
│   │   │   └── AdminDashboardPage.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── materialController.js
│   │   │   ├── aiController.js
│   │   │   └── adminController.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── StudyMaterial.js
│   │   │   ├── Summary.js
│   │   │   ├── Flashcard.js
│   │   │   ├── Quiz.js
│   │   │   └── StudyPlan.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── materialRoutes.js
│   │   │   ├── aiRoutes.js
│   │   │   └── adminRoutes.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   └── errorMiddleware.js
│   │   ├── services/
│   │   │   └── geminiService.js
│   │   ├── utils/
│   │   │   ├── upload.js
│   │   │   └── seed.js
│   │   └── config/
│   │       └── db.js
│   ├── index.js
│   ├── .env
│   └── package.json
│
├── .env.example
├── .gitignore
└── README.md
```

---

## 🔑 Environment Configuration

Create a `.env` file in the `server` directory (or use root `.env`):

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/learnmate
JWT_SECRET=learnmate_super_secret_jwt_key_2026
GEMINI_API_KEY=your_google_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
```

---

## 🛠️ Installation & Execution

### 1. Database Requirement
Ensure local MongoDB is running on `mongodb://127.0.0.1:27017` or update `MONGO_URI` to your MongoDB Atlas connection string.

### 2. Backend Setup
```bash
cd server
npm install
npm run dev
```
The server will run at `http://localhost:5000`.
*Note: Demo admin and student accounts are automatically seeded on backend startup!*

### 3. Frontend Setup
In a new terminal window:
```bash
cd client
npm install
npm run dev
```
The React application will launch at `http://localhost:5173`.

---

## 👤 Demo Credentials

For quick testing and evaluation, the application includes pre-seeded demo accounts:

### Student Account
- **Email:** `rahul@example.com`
- **Password:** `Student@123`
- **Role:** `student`

### Administrator Account
- **Email:** `admin@example.com`
- **Password:** `Admin@123`
- **Role:** `admin`

---

## 🌐 API Endpoints Reference

### Authentication Endpoints
- `POST /api/auth/register` - Register a new user (default student)
- `POST /api/auth/login` - Authenticate user & return JWT token
- `GET /api/auth/me` - Get current user profile (Protected)

### Study Material Management (Protected)
- `POST /api/material/upload` - Upload text note or document file (Multer supported)
- `GET /api/material` - Retrieve user's study materials
- `GET /api/material/:id` - Retrieve a specific material (Ownership protected)
- `PUT /api/material/:id` - Update material title, subject, content
- `DELETE /api/material/:id` - Delete material & associated AI resources

### AI Features (Google Gemini AI)
- `POST /api/materials/:id/summarize` - Generate concise exam summary
- `POST /api/ai/flashcards` - Generate structured revision flashcards JSON
- `POST /api/ai/quiz` - Generate multiple-choice quiz with explanations JSON
- `POST /api/ai/study-plan` - Generate personalized study roadmap JSON
- `GET /api/ai/summaries` - Retrieve user's saved summaries
- `GET /api/ai/flashcards` - Retrieve user's saved flashcards
- `GET /api/ai/quizzes` - Retrieve user's saved quizzes
- `GET /api/ai/study-plans` - Retrieve user's saved study plans

### Admin Management (Admin Protected: JWT + RBAC)
- `GET /api/admin/users` - View all registered users and roles
- `GET /api/admin/stats` - View application usage & AI resource generation metrics
- `PUT /api/admin/users/:id/role` - Update user role (`student` / `admin`)
- `DELETE /api/admin/users/:id` - Delete user account & data

---

## 🧪 Testing with Postman

1. **Register User:**
   - `POST http://localhost:5000/api/auth/register`
   - Body (JSON): `{"name": "Rahul", "email": "rahul@example.com", "password": "password123"}`
2. **Login User:**
   - `POST http://localhost:5000/api/auth/login`
   - Body (JSON): `{"email": "rahul@example.com", "password": "password123"}`
   - Copy the `token` from `data.token`.
3. **Upload Material:**
   - `POST http://localhost:5000/api/material/upload`
   - Header: `Authorization: Bearer <TOKEN>`
   - Body (JSON or Form-Data): `{"title": "Operating Systems", "subject": "CS", "content": "Process scheduling mechanisms..."}`
4. **Generate AI Summary:**
   - `POST http://localhost:5000/api/materials/<MATERIAL_ID>/summarize`
   - Header: `Authorization: Bearer <TOKEN>`
5. **Generate AI Flashcards:**
   - `POST http://localhost:5000/api/ai/flashcards`
   - Body (JSON): `{"materialId": "<MATERIAL_ID>"}`
6. **Generate AI Quiz:**
   - `POST http://localhost:5000/api/ai/quiz`
   - Body (JSON): `{"materialId": "<MATERIAL_ID>"}`
7. **Generate Study Plan:**
   - `POST http://localhost:5000/api/ai/study-plan`
   - Body (JSON): `{"subject": "Operating Systems", "examDate": "2026-10-15"}`
8. **Admin Endpoint Verification (Role Test):**
   - Attempt `GET http://localhost:5000/api/admin/users` with Student Token -> Returns `403 Forbidden`.
   - Attempt `GET http://localhost:5000/api/admin/users` with Admin Token -> Returns `200 OK` user list.

---

## 🛡️ Security Features
- Password hashing using `bcryptjs` (salt factor 10).
- Stateless JWT authentication with standard HTTP headers.
- strict ownership checks for all user data (`userId` verification on backend).
- Role-based authorization for administrative operations.
- Input validation and centralized Express error handling middleware.
