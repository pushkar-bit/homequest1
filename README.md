# HomeQuest – Property & Real Estate Marketplace

A modern, full-stack real estate marketplace built with React, Express.js, and Prisma ORM.

## Project Structure

```
HomeQuest1/
├── frontend/          # React.js frontend application
├── backend/           # Express.js backend API
└── README.md          # This file
```

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MySQL database (local or cloud)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
DATABASE_URL="mysql://user:password@localhost:3306/homequest"
JWT_SECRET="your-super-secret-jwt-key"
PORT=5000
```

4. Set up database:
```bash
npm run prisma:generate
npm run prisma:migrate
```

5. Start server:
```bash
npm start
```

Backend runs on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
REACT_APP_API_URL=http://localhost:5000
```

4. Start development server:
```bash
npm start
```

Frontend runs on `http://localhost:3000`

## Features Implemented

✅ JWT-based authentication
✅ User signup with role selection (User/Agent/Admin)
✅ User login
✅ Protected routes
✅ Beautiful, responsive UI with TailwindCSS
✅ Role-based access control

## Tech Stack

**Frontend:**
- React.js
- React Router
- Axios
- TailwindCSS

**Backend:**
- Node.js
- Express.js
- Prisma ORM
- MySQL
- JWT
- bcryptjs

## Next Steps (Future Milestones)

- Property CRUD operations
- Property filtering and search
- Favorites functionality
- Contact form
- Admin dashboard
- AI-powered recommendations

## Documentation

- [Backend README](./backend/README.md) - Backend setup and API documentation
- [Frontend README](./frontend/README.md) - Frontend setup and deployment

## License

ISC
