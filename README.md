# SautiSmart — Kenyan CBC Music Education & Cultural Preservation Platform

**APT 4900 A Senior Project Demonstration**  
**Student Name:** Khaemba Daisy  
**Supervisor / Assessor:** Dr. Stanley Githinji (`smgithinji@usiu.ac.ke`)  
**Institution:** United States International University - Africa (USIU-Africa)  

---

##  Project Overview & Objectives

**SautiSmart** is an interactive, full-stack digital music education platform designed specifically for the Kenyan Competency-Based Curriculum (CBC) (Grades 4 through 9). The application addresses critical resource constraints in music education across Kenyan primary and junior secondary schools by replacing static audio files and unavailable physical instruments with:

1. **Cultural Archive**: A curated digital catalog of traditional Kenyan folk songs and indigenous musical instruments (e.g., *Nyatiti*, *Isukuti*, *Wandindi*, *Chivoti*, *Kayamba*) organized by community/tribe of origin and cultural occasion.
2. **Set Piece Practice Studio**: An interactive audio practice suite that enables learners to slow down or speed up rehearsal set pieces in real time without altering pitch, as well as isolate individual vocal or instrumental stems (Soprano, Alto, Tenor, Bass).
3. **Theory Revision Modules**: Syllabus-aligned music theory lessons (note values, staff notation, dynamics, meter, scales) with interactive quizzes and progress checks.
4. **Admin Dashboard & Dynamic Statistics**: Role-based access control allowing system administrators to create, update, and manage resources, while monitoring live database analytics.

---

##  Sustainable Development Goals (SDGs) Alignment

- **SDG 4: Quality Education** — Provides equal access to high-quality music learning tools and structured CBC syllabus resources for students regardless of school infrastructure.
- **SDG 11: Sustainable Cities & Communities (Target 11.4)** — Strengthens efforts to protect and safeguard Kenya’s intangible cultural heritage by digitizing indigenous music, oral histories, and folk traditions.

---

##  System Architecture

```
  ┌───────────────────────────────────────────────────────────┐
  │                      USER DEVICE                          │
  │        Browser (Desktop / Mobile Progressive Web App)     │
  └─────────────────────────────┬─────────────────────────────┘
                                │ HTTP / REST Requests (JSON)
                                ▼
  ┌───────────────────────────────────────────────────────────┐
  │                 NEXT.JS FRONTEND CLIENT                   │
  │            (React 18 / Bootstrap 5 / Web Audio API)       │
  │                  http://localhost:3001                      │
  └─────────────────────────────┬─────────────────────────────┘
                                │ REST API Calls (CORS enabled)
                                ▼
  ┌───────────────────────────────────────────────────────────┐
  │                 EXPRESS.JS BACKEND API                    │
  │        (Node.js / JWT Auth / Audio Proxy Engine)          │
  │                  http://localhost:5000                      │
  └─────────────────────────────┬─────────────────────────────┘
                                │ Mongoose ODM Queries
                                ▼
  ┌───────────────────────────────────────────────────────────┐
  │                    MONGODB DATABASE                       │
  │          (Atlas Cluster: Users, ArchiveItems,             │
  │                 SetPieces, TheoryModules)                 │
  └───────────────────────────────────────────────────────────┘
```

---

## 🛠️ Technology Stack

- **Frontend**: Next.js (Pages Router), React 18, Bootstrap 5, Web Audio API.
- **Backend**: Node.js, Express.js REST API, JWT (JSON Web Tokens) Authentication, `bcryptjs`.
- **Database**: MongoDB Atlas with Mongoose Object Data Modeling (ODM).
- **Deployment & Tooling**: Concurrently dev runner, Nodemon live reloader.

---

##  How to Run the Application

### 1. Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- MongoDB instance or MongoDB Atlas Connection URI

### 2. Environment Setup
Create a `.env` file inside `sautismart-web/server/`:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/SautiSmartdb?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_here
```

Create a `.env.local` file inside `sautismart-web/client/`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Installation
From the root directory (`sautismart-web/`):
```bash
npm run install:all
```

### 4. Seed the Database
To populate initial CBC set pieces, theory modules, and cultural archive items:
```bash
npm run seed --prefix server
```

### 5. Running the Application locally
Run both backend API and frontend Next.js dev servers concurrently:
```bash
npm run dev
```
- **Frontend App**: `http://localhost:3001` (or `http://localhost:3000`)
- **Backend API**: `http://localhost:5000/api`

---

## 📊 Database & Dynamic Statistics API Endpoint

### **API Endpoint**: `GET /api/admin/stats`

#### **Description**
Demonstrates how platform statistics (Total Set Pieces, Total Cultural Archive Items, Total Theory Modules, Total Registered Users) are calculated and retrieved **dynamically directly from MongoDB database queries** using Mongoose aggregation methods (`countDocuments`), rather than hardcoding static values.

#### **Backend Implementation (`server/routes/adminRoutes.js`)**:
```javascript
router.get('/stats', async (req, res) => {
  try {
    const [totalSetPieces, totalArchiveItems, totalTheoryModules, totalUsers] = await Promise.all([
      SetPiece.countDocuments(),
      ArchiveItem.countDocuments(),
      TheoryModule.countDocuments(),
      User.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      data: {
        totalSetPieces,
        totalArchiveItems,
        totalTheoryModules,
        totalUsers,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
```

#### **Sample API Response**:
```json
{
  "success": true,
  "timestamp": "2026-08-18T19:44:14.124Z",
  "data": {
    "totalSetPieces": 2,
    "totalArchiveItems": 64,
    "totalTheoryModules": 6,
    "totalUsers": 4
  }
}
```

---

## 🔗 Key REST API Endpoints

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Service health check | Public |
| `POST` | `/api/auth/register` | Register new user | Public |
| `POST` | `/api/auth/login` | Login and receive JWT token | Public |
| `GET` | `/api/archive` | List cultural archive items | Public |
| `POST` | `/api/archive` | Create archive item | Admin Only |
| `GET` | `/api/setpieces` | List set pieces | Public |
| `GET` | `/api/setpieces/proxy-audio` | Bypass CORS for audio stems | Public |
| `GET` | `/api/theory` | List CBC theory modules | Public |
| `GET` | `/api/admin/stats` | Dynamic MongoDB statistics | Admin / Public |

---

##  Author & Acknowledgments

- **Student**: Khaemba Daisy (USIU-Africa)
- **Course**: APT 4900 A Senior Project
- **Supervisor**: Dr. Stanley Githinji (`smgithinji@usiu.ac.ke`)
