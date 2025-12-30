# Database Setup Guide

## Quick Start: Vercel Postgres (Easiest Option)

### Step 1: Create Database in Vercel

1. Go to your Vercel project dashboard: https://vercel.com/dashboard
2. Select your `claimjumpers` project
3. Click on the **Storage** tab (in the top navigation)
4. Click **Create Database**
5. Select **Postgres** from the options
6. Choose a name for your database (e.g., `claimjumpers-db`)
7. Select a region (choose one close to you)
8. Click **Create**

Vercel will automatically:
- Create the PostgreSQL database
- Add `POSTGRES_URL` environment variable to your project
- Add `POSTGRES_PRISMA_URL` (for Prisma)
- Add `POSTGRES_URL_NON_POOLING` (for migrations)

### Step 2: Set Environment Variables

Vercel Postgres automatically adds these, but you need to add one more:

1. In your Vercel project, go to **Settings** → **Environment Variables**
2. Add these variables:

   **For Production:**
   ```
   DATABASE_URL = (use POSTGRES_PRISMA_URL that Vercel created)
   NEXTAUTH_SECRET = (generate with: openssl rand -base64 32)
   NEXTAUTH_URL = https://your-app-name.vercel.app
   ```

   **For Preview/Development:**
   ```
   DATABASE_URL = (use POSTGRES_PRISMA_URL)
   NEXTAUTH_SECRET = (same as production)
   NEXTAUTH_URL = https://your-app-name.vercel.app
   ```

3. **Generate NEXTAUTH_SECRET:**
   ```bash
   openssl rand -base64 32
   ```
   Copy the output and paste it as the value for `NEXTAUTH_SECRET`

### Step 3: Run Database Migrations

Your build script already includes migrations, but you can also run them manually:

**Option A: Via Vercel CLI (Recommended for first-time setup)**

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Link your project:
   ```bash
   cd /path/to/claimjumpers
   vercel link
   ```

4. Pull environment variables:
   ```bash
   vercel env pull .env.local
   ```

5. Run migrations:
   ```bash
   npx prisma migrate deploy
   ```

**Option B: Automatic (Already Configured)**

Your `package.json` build script already includes:
```json
"build": "prisma generate && prisma migrate deploy && next build --webpack"
```

So migrations will run automatically on each deployment! ✅

### Step 4: Verify Database Setup

1. Deploy your app (or trigger a new deployment)
2. Check the build logs to ensure migrations ran successfully
3. Your database tables should be created automatically

---

## Alternative: External PostgreSQL Providers

If you prefer not to use Vercel Postgres, here are free alternatives:

### Option 1: Supabase (Free Tier)

1. Go to https://supabase.com
2. Sign up / Login
3. Click **New Project**
4. Fill in:
   - Project name: `claimjumpers`
   - Database password: (choose a strong password)
   - Region: (choose closest to you)
5. Click **Create new project**
6. Wait for project to be created (~2 minutes)
7. Go to **Settings** → **Database**
8. Copy the **Connection string** (URI format)
9. In Vercel, add as `DATABASE_URL` environment variable

**Connection string format:**
```
postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

### Option 2: Neon (Free Tier)

1. Go to https://neon.tech
2. Sign up / Login
3. Click **Create Project**
4. Fill in:
   - Project name: `claimjumpers`
   - Region: (choose closest)
5. Click **Create Project**
6. Copy the connection string from the dashboard
7. In Vercel, add as `DATABASE_URL` environment variable

### Option 3: Railway (Free Tier)

1. Go to https://railway.app
2. Sign up / Login
3. Click **New Project**
4. Click **+ New** → **Database** → **Add PostgreSQL**
5. Click on the PostgreSQL service
6. Go to **Variables** tab
7. Copy the `DATABASE_URL`
8. In Vercel, add as `DATABASE_URL` environment variable

---

## Local Development Setup

For local development, you can use the same database or a local one:

### Using Your Production Database (Easiest)

1. Pull environment variables:
   ```bash
   vercel env pull .env.local
   ```

2. Your `.env.local` will have `DATABASE_URL` from Vercel

3. Run migrations:
   ```bash
   npm run db:migrate
   ```

### Using Local PostgreSQL (Docker)

1. Run PostgreSQL in Docker:
   ```bash
   docker run --name postgres-claimjumpers \
     -e POSTGRES_PASSWORD=password \
     -e POSTGRES_DB=claimjumpers \
     -p 5432:5432 \
     -d postgres
   ```

2. Create `.env.local`:
   ```env
   DATABASE_URL="postgresql://postgres:password@localhost:5432/claimjumpers?schema=public"
   NEXTAUTH_SECRET="your-local-secret"
   NEXTAUTH_URL="http://localhost:3000"
   ```

3. Run migrations:
   ```bash
   npm run db:migrate
   ```

---

## Troubleshooting

### "Connection refused" or "Database does not exist"

- Verify `DATABASE_URL` is set correctly in Vercel
- Check that your database provider allows connections from Vercel's IPs
- For Vercel Postgres, this is automatic
- For external providers, check firewall/network settings

### "Migration failed"

- Make sure `DATABASE_URL` points to the correct database
- Check that you have write permissions
- Verify the database is running and accessible

### "Prisma Client not generated"

- The build script runs `prisma generate` automatically
- If it fails, check that `prisma.config.ts` is correct
- Verify `DATABASE_URL` is available during build

---

## Quick Checklist

- [ ] Database created (Vercel Postgres or external)
- [ ] `DATABASE_URL` environment variable set in Vercel
- [ ] `NEXTAUTH_SECRET` generated and set
- [ ] `NEXTAUTH_URL` set to your Vercel domain
- [ ] Migrations run (automatic on build, or manually)
- [ ] Deploy and verify tables are created

---

## Next Steps

Once your database is set up:

1. **Deploy your app** - Migrations will run automatically
2. **Verify tables** - Check that all tables were created
3. **Seed data (optional)** - Run `npm run db:seed` if needed
4. **Test the app** - Sign up a user and start playing!

