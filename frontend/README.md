# HomeQuest Frontend

React.js frontend application for HomeQuest real estate marketplace with authentication.

## Tech Stack

- React.js
- React Router for navigation
- Axios for API calls
- TailwindCSS for styling

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the frontend directory:

```env
REACT_APP_API_URL=http://localhost:5000
```

For production, set this to your deployed backend URL.

### 3. Start Development Server

```bash
npm start
```

The app will run on `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Hosting on Vercel/Netlify

### Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the frontend directory
3. Or connect your GitHub repository at vercel.com
4. Set environment variable `REACT_APP_API_URL` to your backend URL
5. Deploy!

### Netlify

1. Install Netlify CLI: `npm install -g netlify-cli`
2. Build the project: `npm run build`
3. Run `netlify deploy --prod` in the frontend directory
4. Or connect your GitHub repository at netlify.com
5. Set environment variable `REACT_APP_API_URL` in Site settings
6. Build command: `npm run build`
7. Publish directory: `build`

## Features

- User Login
- User Signup with role selection (User/Agent/Admin)
- Protected routes
- Beautiful, responsive UI with TailwindCSS
- JWT token management
- Role-based authentication

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App
