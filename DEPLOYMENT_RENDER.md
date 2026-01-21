# 🚀 Deploy Copascore to Render

This guide will walk you through deploying your Next.js Copascore application to Render.

---

## 📋 Prerequisites

Before you begin, make sure you have:
- ✅ A GitHub account
- ✅ Your code pushed to a GitHub repository
- ✅ A Render account (free tier available at [render.com](https://render.com))
- ✅ SportsMonk API Key
- ✅ GROQ API Key

---

## 🔧 Step 1: Prepare Your Project

### 1.1 Create a `.gitignore` file (if not already present)

Make sure your `.gitignore` includes:
```
node_modules
.next
.env.local
.env
.DS_Store
*.log
```

### 1.2 Ensure your `package.json` has the correct build scripts

In your `frontend/package.json`, verify these scripts exist:
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

### 1.3 Create a `render.yaml` configuration file (Optional but recommended)

Create this file in your **project root** (not in frontend folder):

```yaml
services:
  - type: web
    name: copascore
    env: node
    region: oregon
    plan: free
    buildCommand: cd frontend && npm install && npm run build
    startCommand: cd frontend && npm start
    envVars:
      - key: NODE_VERSION
        value: 18.17.0
      - key: NEXT_PUBLIC_SPORTSMONK_API_KEY
        sync: false
      - key: NEXT_PUBLIC_GROQ_API_KEY
        sync: false
      - key: SPORTSMONK_API_KEY
        sync: false
```

---

## 🔗 Step 2: Push Your Code to GitHub

### 2.1 Initialize Git (if not already done)
```bash
cd /Users/ajinkya/Desktop/Copascore-main
git init
git add .
git commit -m "Initial commit for Render deployment"
```

### 2.2 Create a new repository on GitHub
1. Go to [github.com](https://github.com)
2. Click the **+** icon in the top right
3. Select **New repository**
4. Name it `copascore` (or your preferred name)
5. Do NOT initialize with README (since you already have code)
6. Click **Create repository**

### 2.3 Push your code
```bash
git remote add origin https://github.com/YOUR_USERNAME/copascore.git
git branch -M main
git push -u origin main
```

---

## 🌐 Step 3: Deploy on Render

### 3.1 Sign up / Log in to Render
1. Go to [render.com](https://render.com)
2. Click **Get Started** or **Sign In**
3. Sign up with your GitHub account (recommended)

### 3.2 Create a New Web Service
1. From your Render dashboard, click **New +**
2. Select **Web Service**
3. Click **Connect** next to your GitHub repository
   - If you don't see it, click **Configure account** to grant Render access to your repos
4. Select your `copascore` repository

### 3.3 Configure Your Web Service

Fill in the following settings:

**Basic Settings:**
- **Name:** `copascore` (or your preferred name)
- **Region:** Choose closest to your users (e.g., Oregon, Frankfurt)
- **Branch:** `main`
- **Root Directory:** Leave blank (or specify if different)
- **Environment:** `Node`
- **Build Command:**
  ```bash
  cd frontend && npm install && npm run build
  ```
- **Start Command:**
  ```bash
  cd frontend && npm start
  ```

**Instance Type:**
- Select **Free** (or upgrade to paid for better performance)

### 3.4 Add Environment Variables

Scroll down to **Environment Variables** section and add:

| Key | Value |
|-----|-------|
| `NODE_VERSION` | `18.17.0` |
| `NEXT_PUBLIC_SPORTSMONK_API_KEY` | Your SportsMonk API key |
| `NEXT_PUBLIC_GROQ_API_KEY` | Your GROQ API key |
| `SPORTSMONK_API_KEY` | Your SportsMonk API key (same as above) |

**Important:** Do NOT commit these API keys to your Git repository!

### 3.5 Deploy
1. Click **Create Web Service** at the bottom
2. Render will start building and deploying your app
3. This will take 3-5 minutes for the first deployment

---

## 📊 Step 4: Monitor Deployment

### 4.1 Watch the Build Logs
- You'll see real-time logs in the Render dashboard
- Wait for the message: **"Your service is live 🎉"**

### 4.2 Check for Errors
Common issues:
- ❌ **Build failed:** Check if `npm install` and `npm run build` work locally first
- ❌ **Environment variables missing:** Double-check all API keys are added
- ❌ **Port issues:** Next.js automatically uses the PORT provided by Render

---

## ✅ Step 5: Access Your Deployed App

Once deployment is complete:

1. **Your app URL** will be shown at the top of the dashboard
   - Format: `https://copascore.onrender.com` or `https://your-app-name.onrender.com`
2. Click the URL to visit your live application
3. Test all features to ensure everything works

---

## 🔄 Step 6: Update Your Deployment

### Automatic Deployments (Recommended)
By default, Render will automatically deploy whenever you push to your `main` branch:

```bash
# Make changes to your code
git add .
git commit -m "Update feature X"
git push origin main
```

Render will automatically detect the push and redeploy!

### Manual Deployment
From your Render dashboard:
1. Click on your service
2. Click **Manual Deploy** → **Deploy latest commit**

---

## ⚙️ Advanced Configuration

### Custom Domain (Optional)
1. Go to your service **Settings**
2. Scroll to **Custom Domain**
3. Click **Add Custom Domain**
4. Follow the instructions to configure your DNS

### Increase Performance
Consider upgrading from Free tier:
- **Starter ($7/month):** Always on, no cold starts
- **Standard ($25/month):** More resources

### Health Check Endpoint (Optional)
Create `frontend/src/app/api/health/route.ts`:
```typescript
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ status: 'OK' });
}
```

Then in Render settings:
- **Health Check Path:** `/api/health`

---

## 🐛 Troubleshooting

### Issue: "Application failed to respond"
**Solution:** Check your Start Command is correct:
```bash
cd frontend && npm start
```

### Issue: "Module not found" errors
**Solution:** Ensure `npm install` is in your Build Command:
```bash
cd frontend && npm install && npm run build
```

### Issue: Environment variables not working
**Solution:** 
- Verify variable names match exactly (case-sensitive)
- For Next.js client-side variables, use `NEXT_PUBLIC_` prefix
- Restart the service after adding/changing environment variables

### Issue: Build takes too long / times out
**Solution:**
- Upgrade to a paid plan for more build resources
- Optimize your dependencies

### Issue: App shows "This page could not be found"
**Solution:**
- Make sure you're using `cd frontend` in both build and start commands
- Verify your Next.js app structure is correct

### Issue: Cold starts (Free tier)
**Solution:**
- Free tier apps sleep after 15 minutes of inactivity
- Upgrade to Starter plan ($7/month) for always-on service
- Or use a service like [UptimeRobot](https://uptimerobot.com/) to ping your app every 5 minutes

---

## 📱 Testing Your Deployment

Once deployed, test these key features:

1. ✅ **Home Page** loads correctly
2. ✅ **Match Prediction** page works
3. ✅ **API Data** page displays data
4. ✅ **Players** page functions properly
5. ✅ **AI Analyst** chat works
6. ✅ All API endpoints respond correctly

---

## 📝 Important Notes

### Free Tier Limitations:
- ⏰ Apps spin down after 15 minutes of inactivity
- 🕐 First request after inactivity takes 30-50 seconds (cold start)
- 💾 750 hours/month of runtime
- 🌐 No custom domains without verification

### Production Checklist:
- ✅ All environment variables set
- ✅ API keys are working
- ✅ Build completes successfully
- ✅ No errors in production logs
- ✅ All pages load correctly
- ✅ Mobile responsive design works

---

## 🎯 Quick Reference Commands

```bash
# Build locally to test
cd frontend
npm install
npm run build
npm start

# Deploy to GitHub
git add .
git commit -m "Your message"
git push origin main

# View logs on Render
# Go to Dashboard → Your Service → Logs
```

---

## 🆘 Need Help?

- **Render Documentation:** [render.com/docs](https://render.com/docs)
- **Next.js Deployment:** [nextjs.org/docs/deployment](https://nextjs.org/docs/deployment)
- **Render Community:** [community.render.com](https://community.render.com)

---

**🎉 Congratulations! Your Copascore app is now live on Render!**

Your app URL: `https://your-app-name.onrender.com`
