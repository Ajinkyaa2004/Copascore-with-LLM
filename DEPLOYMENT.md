# Deployment Guide for CopaScore

This guide will help you deploy the CopaScore application. The frontend will be deployed on **Vercel** and the backend on **Render**.

## Prerequisites

1.  **GitHub Account**: Ensure your project is pushed to a GitHub repository.
2.  **Vercel Account**: Sign up at [vercel.com](https://vercel.com).
3.  **Render Account**: Sign up at [render.com](https://render.com).

---

## Part 1: Backend Deployment (Render)

The backend is a Python FastAPI application.

1.  **Log in to Render** and go to your Dashboard.
2.  Click **New +** and select **Web Service**.
3.  Connect your GitHub repository.
4.  Configure the service:
    *   **Name**: `copascore-backend` (or any name you like)
    *   **Region**: Choose the one closest to you.
    *   **Branch**: `main` (or your default branch)
    *   **Root Directory**: `backend`
    *   **Runtime**: `Python 3`
    *   **Build Command**: `pip install -r requirements.txt`
    *   **Start Command**: `uvicorn src.api.main:app --host 0.0.0.0 --port $PORT`
5.  **Environment Variables**:
    *   If your backend uses any API keys (e.g., OpenAI), add them here.
    *   Key: `OPENAI_API_KEY`, Value: `your_key_here` (if applicable).
6.  Click **Create Web Service**.
7.  Wait for the deployment to finish. Render will provide a **URL** (e.g., `https://copascore-backend.onrender.com`). **Copy this URL.**

---

## Part 2: Frontend Deployment (Vercel)

The frontend is a Next.js application.

1.  **Log in to Vercel** and go to your Dashboard.
2.  Click **Add New...** -> **Project**.
3.  Import your GitHub repository.
4.  Configure the project:
    *   **Framework Preset**: Next.js (should be auto-detected).
    *   **Root Directory**: Click `Edit` and select `frontend`.
5.  **Environment Variables**:
    *   Expand the "Environment Variables" section.
    *   Key: `NEXT_PUBLIC_API_URL`
    *   Value: The **Render Backend URL** you copied earlier (e.g., `https://copascore-backend.onrender.com`).
    *   *Note: Do not add a trailing slash `/` to the URL.*
6.  Click **Deploy**.
7.  Vercel will build and deploy your frontend. Once done, you will get a live URL for your website.

---

## Troubleshooting

*   **CORS Issues**: If the frontend cannot talk to the backend, you might need to update the CORS settings in `backend/src/api/main.py`. Ensure it allows requests from your Vercel domain.
    *   Locate the `CORSMiddleware` configuration in `backend/src/api/main.py`.
    *   Update `allow_origins` to include your Vercel URL (e.g., `["https://your-app.vercel.app"]`) or use `["*"]` for testing (less secure).
*   **Build Errors**: Check the logs on Vercel or Render for specific error messages.
*   **Backend Sleep**: On Render's free tier, the backend will go to sleep after inactivity. The first request might take 30-60 seconds to wake it up.

## Local Development

To run locally with the environment variable:

1.  Create a `.env.local` file in the `frontend` directory.
2.  Add: `NEXT_PUBLIC_API_URL=http://localhost:8000`
