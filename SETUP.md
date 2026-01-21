# 🚀 Quick Setup Guide for Copascore

## ✅ What's Been Done

All datasets, Python backend, and mock data have been **completely removed** from the project. The application is now ready to integrate with:
- **SportsMonk API** for real football data
- **GROQ API** for AI-powered predictions

---

## 📋 Setup Steps

### 1. Get Your API Keys

#### SportsMonk API
1. Go to [https://www.sportmonks.com/](https://www.sportmonks.com/)
2. Sign up for an account
3. Choose a plan (Free trial available)
4. Get your API key from the dashboard

#### GROQ API
1. Go to [https://console.groq.com/](https://console.groq.com/)
2. Sign up or log in
3. Create an API key
4. Copy the key (it won't be shown again!)

### 2. Configure Environment Variables

In the `frontend` directory, create `.env.local`:

```bash
cd frontend
cp .env.example .env.local
```

Edit `.env.local` and add your keys:
```env
NEXT_PUBLIC_SPORTSMONK_API_KEY=your_actual_sportsmonk_key_here
NEXT_PUBLIC_GROQ_API_KEY=your_actual_groq_key_here
```

### 3. Install & Run

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Visit: http://localhost:3000

---

## 🎯 What Works Now

### ✅ Ready for Integration
- Match prediction using GROQ LLM
- Team data from SportsMonk API
- Player statistics from SportsMonk API
- AI chat analyst using GROQ
- League simulation using GROQ

### 🔧 API Service Layer
All API calls are centralized in `src/services/api.ts`:
- `getTeams()` - Fetch teams from SportsMonk
- `predictMatch()` - AI predictions via GROQ
- `getMatchStats()` - Match statistics from SportsMonk
- `getTeamPlayers()` - Player data from SportsMonk
- `chatWithAI()` - AI analyst via GROQ
- `simulateSeason()` - Season simulation via GROQ

---

## ⚠️ Important Notes

1. **No Mock Data**: The project is completely clean - no CSV files, no JSON datasets, no hardcoded data
2. **No Python Backend**: Everything runs on the frontend with external APIs
3. **API Limits**: Free tiers have rate limits - be mindful of request frequency
4. **GROQ Model**: Using Mixtral-8x7b-32768 for predictions (fast and accurate)

---

## 🔍 Verify Setup

Test if APIs are working:
1. Start the dev server
2. Go to Match Prediction page
3. Try to load teams - should fetch from SportsMonk
4. Make a prediction - should use GROQ for analysis

---

## 💡 Tips

- SportsMonk free tier has limited requests - cache data when possible
- GROQ is fast but responses may vary - adjust temperature parameter if needed
- Check browser console for any API errors
- Make sure API keys have proper permissions

---

## 🆘 Troubleshooting

### Teams not loading?
- Check SPORTSMONK_API_KEY is correct
- Verify API key has team data access
- Check browser console for errors

### Predictions failing?
- Verify GROQ_API_KEY is correct
- Check GROQ account has credits
- Ensure API key is not revoked

### CORS errors?
- Use environment variables starting with `NEXT_PUBLIC_`
- Restart dev server after changing .env.local

---

## 📞 Need Help?

Check the main README.md for detailed documentation or contact the developer.
