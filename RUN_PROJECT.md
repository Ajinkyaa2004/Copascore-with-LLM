# 🚀 How to Run Copascore Project

> **Note**: This is a full-stack Next.js application. All backend functionality is handled by Next.js API routes - no separate backend server is required!

## Prerequisites
- Node.js 18+ installed
- SportsMonk API Key
- GROQ API Key

## Quick Start Commands

### 1. Navigate to the frontend directory
```bash
cd frontend
```

### 2. Install dependencies (first time only)
```bash
npm install
```

### 3. Set up environment variables (first time only)
```bash
cp .env.example .env.local
```

Then edit `.env.local` and add your API keys:
```env
NEXT_PUBLIC_SPORTSMONK_API_KEY=your_sportsmonk_api_key_here
NEXT_PUBLIC_GROQ_API_KEY=your_groq_api_key_here
```

### 4. Run the development server
```bash
npm run dev
```

The application will be available at:
- **Local**: http://localhost:3000
- **Network**: http://192.168.1.6:3000 (accessible from other devices on your network)

## Other Useful Commands

### Build for production
```bash
npm run build
```

### Start production server
```bash
npm start
```

### Run linter
```bash
npm run lint
```

## Troubleshooting

### Port already in use
If port 3000 is already in use, you can specify a different port:
```bash
PORT=3001 npm run dev
```

### Clear cache and reinstall
If you encounter issues, try:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Clear Next.js cache
```bash
rm -rf .next
npm run dev
```

---

**Note**: Make sure you're in the `frontend` directory when running these commands!
