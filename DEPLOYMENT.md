# Deployment Guide (Vercel)

This application is built with Next.js, making it optimized for deployment on Vercel.

## Prerequisites

1.  A [Vercel Account](https://vercel.com).
2.  Your code pushed to a Git repository (GitHub/GitLab/Bitbucket).
3.  Your Supabase project URL and Anon Key.

## Option 1: Vercel Dashboard (Recommended)

1.  **Import Project**:
    *   Go to your [Vercel Dashboard](https://vercel.com/dashboard).
    *   Click **"Add New..."** -> **"Project"**.
    *   Import your `klob_v2` repository.

2.  **Configure Project**:
    *   **Framework Preset**: Keep as `Next.js`.
    *   **Root Directory**: Keep as `./` (default).

3.  **Environment Variables** (Critical):
    *   Expand the **"Environment Variables"** section.
    *   Add the following keys (copy values from your local `.env.local` or Supabase dashboard):
        *   `NEXT_PUBLIC_SUPABASE_URL`
        *   `NEXT_PUBLIC_SUPABASE_ANON_KEY`
        *   `SENTRY_AUTH_TOKEN` (Optional: Required if you want to upload source maps to Sentry. If build fails, you can try disabling Sentry in `next.config.mjs` or providing this token).

4.  **Deploy**:
    *   Click **"Deploy"**.
    *   Wait for the build to complete.

## Option 2: Vercel CLI

If you prefer the command line:

1.  Install Vercel CLI:
    ```bash
    npm i -g vercel
    ```
2.  Run deploy command:
    ```bash
    vercel
    ```
3.  Follow the prompts. When asked "Want to modify these settings?", say **No** (defaults are fine), unless you need to override something specific.
4.  Set environment variables via the dashboard after the first deployment (or use `vercel env add`).

## Post-Deployment

*   **Supabase Auth Redirects**:
    *   Go to your Supabase Dashboard -> Authentication -> URL Configuration.
    *   Add your new Vercel production URL (e.g., `https://klob-v2.vercel.app`) to the **Site URL** or **Redirect URLs**.
    *   This ensures users are redirected back to the correct live site after logging in.
