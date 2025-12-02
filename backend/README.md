# HomeQuest Backend API

Express.js backend with Prisma ORM and MySQL database for HomeQuest real estate marketplace.

## Tech Stack

- Node.js + Express.js
- Prisma ORM
- MySQL Database
- JWT Authentication
- bcryptjs for password hashing

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the backend directory:

```env
DATABASE_URL="mysql://user:password@localhost:3306/homequest"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
PORT=5000
```

### 3. Database Setup

#### Option A: Local MySQL

1. Create a MySQL database:
```sql
CREATE DATABASE homequest;
```

2. Update the `DATABASE_URL` in `.env` with your MySQL credentials.

3. Run Prisma migrations:
```bash
npm run prisma:generate
npm run prisma:migrate
```

#### Option B: Cloud MySQL (For Hosting)

Use services like:
- PlanetScale
- AWS RDS
- Google Cloud SQL
- Any MySQL hosting service

Update the `DATABASE_URL` in your hosting platform's environment variables.

### 4. Start the Server

```bash
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register a new user
  - Body: `{ name, email, password, role }` (role: user/agent/admin)
  
- `POST /api/auth/login` - Login user
  - Body: `{ email, password }`

- `GET /api/health` - Health check

## Hosting on Render/Railway

### Render.com

1. Create a new Web Service
2. Connect your GitHub repository
3. Set environment variables:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `PORT` (Render will set this automatically)
4. Build Command: `npm install && npm run prisma:generate`
5. Start Command: `npm start`
6. Deploy!

### Railway

1. Create a new project
2. Add a MySQL database service
3. Connect your GitHub repository
4. Set environment variables in the Variables tab
5. Railway will auto-detect and deploy

Note: Make sure to run migrations after first deployment or include them in the build process.
