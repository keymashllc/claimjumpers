# Vercel Deployment Guide

## Prerequisites

1. **PostgreSQL Database**: SQLite won't work on Vercel. You need a PostgreSQL database.
   - **Recommended**: Vercel Postgres (integrated with Vercel)
   - **Alternatives**: PlanetScale, Supabase, Neon, Railway

## Setup Steps

### 1. Create PostgreSQL Database

#### Option A: Vercel Postgres (Recommended)
1. In your Vercel project dashboard, go to Storage
2. Click "Create Database" → "Postgres"
3. Vercel will automatically add the `POSTGRES_URL` environment variable

#### Option B: External Provider
- **Supabase**: https://supabase.com (free tier available)
- **Neon**: https://neon.tech (free tier available)
- **Railway**: https://railway.app (free tier available)
- **PlanetScale**: https://planetscale.com (MySQL, but Prisma supports it)

### 2. Environment Variables

In your Vercel project settings, add these environment variables:

```
DATABASE_URL=your-postgresql-connection-string
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
NEXTAUTH_URL=https://your-app.vercel.app
```

**Generate NEXTAUTH_SECRET**:
```bash
openssl rand -base64 32
```

### 3. Database Migration

After setting up the database and environment variables:

1. **Option A: Run migration via Vercel CLI** (recommended):
   ```bash
   npm install -g vercel
   vercel env pull .env.local
   npx prisma migrate deploy
   ```

2. **Option B: Run migration in Vercel build**:
   Add to `package.json`:
   ```json
   {
     "scripts": {
       "postinstall": "prisma generate",
       "build": "prisma migrate deploy && next build"
     }
   }
   ```

3. **Option C: Run migration manually**:
   - Connect to your database
   - Run the migration SQL from `prisma/migrations/`

### 4. Seed Database (Optional)

If you want to seed initial data:
```bash
vercel env pull .env.local
npm run db:seed
```

Or use Prisma Studio:
```bash
npx prisma studio
```

## Local Development with PostgreSQL

For local development, you can:

1. **Use Docker**:
   ```bash
   docker run --name postgres-claimjumpers -e POSTGRES_PASSWORD=password -e POSTGRES_DB=claimjumpers -p 5432:5432 -d postgres
   ```
   Then set `DATABASE_URL="postgresql://postgres:password@localhost:5432/claimjumpers?schema=public"`

2. **Use a cloud provider's free tier** (Supabase, Neon, etc.)

3. **Use Vercel Postgres** (even for local dev - just use the connection string)

## Troubleshooting

### Migration Issues
- Make sure `DATABASE_URL` is set correctly
- Check that your database allows connections from Vercel's IPs
- For Vercel Postgres, the connection string is automatically provided

### Build Issues
- Ensure `prisma generate` runs in the build process
- Check that all environment variables are set
- Verify the database is accessible from Vercel's build environment

### Runtime Issues
- Check Vercel function logs for database connection errors
- Verify `NEXTAUTH_URL` matches your deployment URL
- Ensure `NEXTAUTH_SECRET` is set and consistent

