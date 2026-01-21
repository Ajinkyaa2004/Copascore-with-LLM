# 🔍 API Analysis & User Workflow

## 📊 SportsMonk API (Free Plan) - What's Available

### ✅ Available Data & Endpoints

Your **Football Free Plan** provides access to:

#### 1. **Core Football Data**
- ✅ **All Leagues** - Get all football leagues worldwide
- ✅ **All Teams** - Access team information
- ✅ **All Players** - Player database with details
- ✅ **All Fixtures** - Match/fixture data
- ✅ **All Seasons** - Season information
- ✅ **All Venues** - Stadium data

#### 2. **Match Data**
- ✅ **Fixtures by Date** - Get matches for specific dates
- ✅ **Fixtures by Date Range** - Matches within a time period
- ✅ **Livescores** - Live match scores
- ✅ **Inplay Fixtures** - Currently playing matches
- ✅ **Head to Head** - Historical matchups between teams
- ✅ **Fixtures by Team** - Team's match schedule

#### 3. **Team & Player Info**
- ✅ **Team by ID** - Detailed team information
- ✅ **Teams by Search** - Search for teams
- ✅ **Squad by Team** - Team roster/squad
- ✅ **Player by ID** - Player details
- ✅ **Players by Search** - Search players
- ✅ **Players by Country** - Players from specific countries

#### 4. **Standings & Statistics**
- ✅ **Standings by Season** - League tables
- ✅ **Standings by Round** - Tables at specific round
- ✅ **Topscorers by Season** - Top goal scorers
- ✅ **Season Statistics** - Various season stats
- ✅ **Statistics by Round/Stage** - Detailed statistics

#### 5. **Odds & Betting**
- ✅ **Prematch Odds** - Pre-match betting odds
- ✅ **All Bookmakers** - Available bookmakers
- ✅ **Odds by Fixture** - Odds for specific matches
- ✅ **All Markets** - Betting markets info

#### 6. **Additional Features**
- ✅ **Commentaries** - Match commentaries
- ✅ **Transfers** - Player transfer information
- ✅ **Coaches** - Coach information
- ✅ **Referees** - Referee data
- ✅ **TV Stations** - Broadcasting info
- ✅ **Rivals** - Team rivalries

### ⚠️ Limitations (Free Plan)
- No "includes" available - Can't expand related data in single request
- Must make separate API calls for related data
- 3000 requests per hour rate limit
- Basic data only - no advanced statistics

### 📝 Sample Data Structures

**Team:**
```json
{
  "id": 53,
  "name": "Celtic",
  "short_code": "CEL",
  "country_id": 1161,
  "founded": 1888,
  "image_path": "https://cdn.sportmonks.com/images/..."
}
```

**Fixture:**
```json
{
  "id": 216268,
  "league_id": 271,
  "name": "Team A vs Team B",
  "starting_at": "2026-01-25 15:00:00",
  "state_id": 5,
  "has_odds": false
}
```

---

## 🤖 GROQ API - What's Available

### ✅ Available Models
- **llama-3.3-70b-versatile** - Best for general tasks (RECOMMENDED)
- **llama-3.1-8b-instant** - Fast responses
- **qwen/qwen3-32b** - Good balance
- **meta-llama/llama-4-maverick-17b-128e-instruct** - Latest model

### 💡 Use Cases for GROQ
1. **Match Predictions** - AI-powered outcome predictions
2. **Statistical Analysis** - Analyze team/player stats
3. **AI Analyst Chat** - Interactive football analysis
4. **Season Simulations** - Generate realistic league tables
5. **Insight Generation** - Extract insights from data

### 📝 Sample Request
```javascript
{
  model: 'llama-3.3-70b-versatile',
  messages: [
    { role: 'system', content: 'You are a football analyst.' },
    { role: 'user', content: 'Analyze Liverpool vs Arsenal match...' }
  ],
  temperature: 0.7,
  max_tokens: 1024
}
```

---

## 🎯 USER WORKFLOW

### **Page 1: Match Prediction** 
**Current Flow:**
1. User visits `/predict` page
2. Loads team list from SportsMonk
3. User selects home team, away team, enters odds
4. Clicks "Predict"
5. System calls GROQ API with match info
6. Displays AI prediction with probabilities

**API Calls Needed:**
- `GET /teams` - Get list of teams for dropdown
- `GET /fixtures/head-to-head` - Historical matchups (optional)
- `GET /standings/by-season` - Current standings (optional)
- GROQ API - Generate prediction

**Data Flow:**
```
Teams Dropdown → User Selection → Odds Input → GROQ Analysis → Prediction Display
```

---

### **Page 2: League Simulation**
**Current Flow:**
1. User visits `/simulate` page
2. Clicks "Simulate Season"
3. GROQ generates realistic league table with 20 teams
4. Displays table with positions, points, W/D/L

**API Calls Needed:**
- `GET /teams/by-season` - Get teams in league
- `GET /standings/by-season` - Current standings (for context)
- GROQ API - Generate simulation

---

### **Page 3: Players Database**
**Current Flow:**
1. User visits `/players` page
2. Loads players from multiple teams
3. User can search for specific players/teams
4. Displays player cards with stats

**API Calls Needed:**
- `GET /teams` - Get teams list
- `GET /squad/by-team` - Get team players
- `GET /players/search` - Search players
- `GET /players/{id}` - Get player details

---

### **Page 4: Home Page**
**Features:**
- Overview cards linking to main features
- Recent matches/upcoming fixtures (optional)

**API Calls Needed:**
- `GET /fixtures/latest` - Recent matches (optional)
- `GET /livescores` - Live scores (optional)

---

## 🔧 RECOMMENDED CHANGES

### 1. **Fix API Service Issues**
**Problem:** Current code expects different data structure than SportsMonk provides

**Need to Update:**
- API endpoints to match SportsMonk v3 structure
- Response parsing logic
- Error handling for free tier limitations

### 2. **Update GROQ Model**
**Change:** `mixtral-8x7b-32768` → `llama-3.3-70b-versatile`

### 3. **Simplify Player Data**
**Issue:** Free tier doesn't have detailed player stats like FIFA data

**Solution:** 
- Focus on basic player info (name, position, team)
- Remove advanced stats visualizations
- Or use GROQ to generate estimated stats

### 4. **Optimize API Calls**
**Strategy:**
- Cache team lists (they rarely change)
- Use date ranges to limit fixture queries
- Focus on specific leagues (Premier League) to reduce data

### 5. **Handle Free Tier Limitations**
**Approach:**
- Make separate calls instead of using includes
- Implement request caching
- Show loading states during multiple API calls
- Add error handling for rate limits

---

## 📋 PRIORITY FIXES

### 🔴 Critical (Must Fix):
1. Update GROQ model to `llama-3.3-70b-versatile`
2. Fix team fetching to use correct SportsMonk endpoint
3. Update fixture/match data parsing

### 🟡 Important (Should Fix):
4. Implement proper error handling
5. Add loading states for API calls
6. Cache frequently used data (teams list)

### 🟢 Nice to Have:
7. Add more leagues support
8. Implement player search
9. Add historical data views

---

## 💻 NEXT STEPS

**Tell me which changes you want to make:**
1. Just fix the critical API issues?
2. Full rewrite optimized for free tier?
3. Focus on specific features?
4. Add new features?

I'll implement whatever you choose! 🚀
