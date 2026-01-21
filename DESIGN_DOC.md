# Copascore Design Documentation

## 1. Project Overview
Copascore is an advanced football analytics and simulation engine designed to provide users with AI-powered match predictions, league simulations, and detailed player statistics. It leverages real-time sports data and Large Language Models (LLMs) to generate insights that go beyond simple statistics.

## 2. Goals & Non-Goals
### Goals
- **Real-Time Data**: Integrate with SportsMonk API to fetch accurate, up-to-date fixtures, odds, and team data.
- **AI Analysis**: Use GROQ (LLM) to analyze match context and betting odds to generate human-like predictions with reasoning.
- **User Experience**: Provide a premium, responsive, and visually accessible interface using modern web technologies.
- **Robustness**: Ensure the application gracefully handles API failures (e.g., missing odds) with fallback mechanisms.

### Non-Goals
- **Betting Platform**: This is an analytics tool, not a gambling platform. No real money transactions are supported.
- **User Authentication**: Currently, the application is stateless and does not require user accounts or store personal user data.
- **Native Mobile App**: The project is focused on a responsive web application, not a native iOS/Android binary.

## 3. High-Level Architecture
The application follows a standard **Next.js App Router** architecture, utilizing Server-Side Rendering (SSR) and Client-Side Rendering (CSR) where appropriate.

- **Frontend**: React (Next.js 16) with Tailwind CSS for styling.
- **Backend / API Layer**: Next.js API Routes (`/api/*`) serve as a secure proxy and aggregation layer.
- **External Services**:
    - **SportsMonk V3 API**: Source of truth for fixtures, teams, players, and betting odds.
    - **GROQ API (Llama 3 70B)**: Intelligence engine for match predictions and season simulations.

## 4. System Components
### Frontend Pages (`src/app`)
- **Landing Page (`page.tsx`)**: Entry point with navigation to key features.
- **Predict (`predict/page.tsx`)**: Core feature allowing users to select leagues/teams and view AI predictions.
- **Simulate (`simulate/page.tsx`)**: Interface for running full-season simulations via LLM.
- **Players (`players/page.tsx`)**: Database view for searching and analyzing player stats.

### Backend Services (`src/app/api`)
- **Odds Service (`api/odds/route.ts`)**: Complex logic to fetch live odds. Implements specific endpoints (`/markets/1`) with a fallback to Head-to-Head (`/fixtures/head-to-head`) included odds. Handles SportsMonk V3's flat-list response structure.
- **Prediction Service (`api/predict/route.ts`)**: Constructs prompts using match data and odds, sends them to GROQ, and parses the structured JSON response.

### Shared Layer (`src/services`)
- **`api.ts`**: A centralized singleton service handling all HTTP communication. It abstracts the API endpoints and provides typed responses to the UI components.

## 5. Data Model Design
The data models are defined in `src/types/index.ts` and ensure type safety across the application.

- **MatchPrediction**:
    - `prediction`: Enum ('Home Win' | 'Draw' | 'Away Win')
    - `confidence`: Number (0-100)
    - `reasoning`: String (AI explanation)
    - Probabilities: `home_win_probability`, `draw_probability`, `away_win_probability`
- **Team**: Basic entity with `id`, `name`, `image_path`.
- **Odds**: normalized `home`, `draw`, `away` decimal values.
- **PlayerCard**: Representation of player stats including a `radar` chart dataset (pace, shooting, etc.).
- **TableRow**: Structure for simulated league tables (`played`, `won`, `points`, etc.).

## 6. Core Workflows
### A. Match Prediction Flow
1. **User Selection**: User selects a League, then available Home and Away teams.
2. **Odds Fetching**:
   - Client calls `api.getMatchOdds`.
   - Server calls SportsMonk.
   - **Primary Strategy**: Fetch `/odds/pre-match/fixtures/{id}/markets/1`.
   - **Fallback Strategy**: If primary fails, check `include=odds` in the fixture endpoint.
   - **Parsing**: Logic groups flat odds arrays by `bookmaker_id` and extracts 1x2 values.
3. **Analysis**:
   - Client sends Teams + Odds to `/api/predict`.
   - Server prompts GROQ: "Given Home X, Away Y, and Odds Z, predict the outcome."
   - AI returns a JSON object.
4. **Display**: UI renders the prediction bars and reasoning.

### B. League Simulation Flow
1. Client requests all teams in a league.
2. Client sends the team list to `/api/simulate` (or directly via `chatWithAI` helper).
3. LLM is prompted to "Simulate a season for these teams and return a JSON array."
4. UI parses the array and renders the League Table.

## 7. Security Design
- **API Key Protection**:
    - `GROQ_API_KEY` and `SPORTSMONK_API_KEY` are stored in server-side Environment Variables.
    - The browser client **never** accesses these keys directly. It communicates only with the Next.js internal API routes.
- **Input Validation**: API routes perform basic validation (checking for missing `teamId` or parameters) before calling external services.
- **CORS**: Next.js API routes run on the same origin, mitigating CORS issues for the frontend.

## 8. Scalability Considerations
- **Statelessness**: The application is functionally stateless. It does not maintain a session or local database, making it trivial to scale horizontally on serverless platforms (Render/Vercel).
- **Edge Caching**: Next.js naturally caches static content. API responses can be configured with `Cache-Control` headers if needed to reduce load on SportsMonk (currently real-time focused).

## 9. Failure Handling & Edge Cases
- **Odds Unavailability**:
    - If no odds are found (common for far-future matches), the UI displays "N/A" and warns "No upcoming game odds found".
    - The Prediction engine is prevented from running without odds to ensure accuracy.
- **API Limits**:
    - The code handles API errors gracefully (Try/Catch in `api.ts`).
    - Debug logging is implemented in the API routes to trace upstream failures.
- **Parsing Errors**:
    - The odds parser is defensive, checking for both `value` and `label` fields and handling multiple API response formats (nested vs flat).

## 10. Future Enhancements
- **Historical Database**: Integration with a database (e.g., PostgreSQL) to store past predictions and track AI accuracy over time.
- **User Accounts**: Allow users to save favorite teams or preferred leagues.
- **Expanded Coverage**: Upgrade SportsMonk plan to support more leagues beyond the current free-tier filters.
- **Live Scores**: Add a polling mechanism to show live match scores alongside predictions.
