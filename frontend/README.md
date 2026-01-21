# CopaScore Frontend

Modern Next.js application for football match predictions and player analytics.

## Features

- 🎯 Match prediction with AI analysis
- ⚽ 200 elite FIFA player cards
- 📊 Performance radar charts
- 💰 Best bets recommendations (20+ markets)
- 🤖 AI match analyst chatbot
- 🎨 FIFA World Cup themed dark UI

## Setup

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000)

## Build for Production

```bash
npm run build
npm start
```

## Pages

- **Home** (`/`) - Landing page
- **Predict** (`/predict`) - Match predictions
- **Players** (`/players`) - Browse 200 players
- **Player Details** (`/players/[name]`) - Individual player stats
- **Standings** - League table (if available)

## Components

- `PlayerCard` - FIFA-style player cards with radar charts
- `BestBets` - Betting recommendations display
- `AIAnalyst` - Chat interface for match analysis
- `PredictionDashboard` - Match prediction results
- `Navbar` - Navigation header

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **HTTP**: Axios
- **Icons**: Lucide React

## Environment

Update API endpoint in components if backend runs on different port:
```typescript
const API_URL = 'http://localhost:8000';
```

## Design

- Dark FIFA theme with gradients
- Glassmorphism effects
- Responsive grid layouts
- Smooth animations
 
