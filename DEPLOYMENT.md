# Deployment Instructions

## Environment Variables Setup

This application requires the following environment variables to be configured:

- `NEXT_PUBLIC_API_URL` - API endpoint URL
- `NEXT_PUBLIC_NOTEHUB_TOKEN` - Authentication token

### For Vercel Deployment

1. Go to your project in [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:
   - **Key:** `NEXT_PUBLIC_API_URL`
     **Value:** `https://notehub-public.goit.study/api`
     **Environment:** Production, Preview, Development (select all)
   
   - **Key:** `NEXT_PUBLIC_NOTEHUB_TOKEN`
     **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRhbmFobWFydWs5MUBnbWFpbC5jb20iLCJpYXQiOjE3NjA3OTg5OTB9.TFUi8cyr0fiziAHuENQ-Qg8e4xhck4lXdS540l6c4Dw`
     **Environment:** Production, Preview, Development (select all)

4. **IMPORTANT:** After adding environment variables, you **MUST** redeploy your application:
   - Go to **Deployments** tab
   - Click the three dots (⋯) on the latest deployment
   - Select **Redeploy**
   - Or trigger a new deployment by pushing to your repository

### For Netlify Deployment

1. Go to your site in [Netlify Dashboard](https://app.netlify.com)
2. Navigate to **Site settings** → **Environment variables**
3. Click **Add a variable** and add:
   - `NEXT_PUBLIC_API_URL` = `https://notehub-public.goit.study/api`
   - `NEXT_PUBLIC_NOTEHUB_TOKEN` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRhbmFobWFydWs5MUBnbWFpbC5jb20iLCJpYXQiOjE3NjA3OTg5OTB9.TFUi8cyr0fiziAHuENQ-Qg8e4xhck4lXdS540l6c4Dw`
4. **IMPORTANT:** Trigger a new deployment after adding variables

### Troubleshooting

If you see a **401 Unauthorized** error:

1. **Verify environment variables are set:**
   - Check the deployment platform's environment variables settings
   - Ensure variables are set for the correct environment (Production/Preview/Development)

2. **Redeploy after setting variables:**
   - Environment variables are baked into the build at build time
   - Simply adding variables won't affect existing deployments
   - You must trigger a new build/deployment

3. **Check the browser console:**
   - Open Developer Tools (F12)
   - Check the Console tab for detailed error messages
   - Look for messages about missing tokens or API errors

4. **Verify variable names:**
   - Ensure variable names match exactly: `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_NOTEHUB_TOKEN`
   - Variable names are case-sensitive

5. **Check build logs:**
   - Review the build logs in your deployment platform
   - Look for any warnings about missing environment variables

## Local Development

For local development, create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL="https://notehub-public.goit.study/api"
NEXT_PUBLIC_NOTEHUB_TOKEN="your-token-here"
```

Then restart your development server.

