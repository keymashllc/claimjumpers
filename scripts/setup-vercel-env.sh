#!/bin/bash

# Script to add environment variables to Vercel
# Make sure you're logged in: npx vercel login
# Make sure project is linked: npx vercel link

echo "🚀 Setting up Vercel environment variables..."
echo ""

# Check if logged in
npx vercel whoami > /dev/null 2>&1
if [ $? -ne 0 ]; then
  echo "❌ Not logged in to Vercel. Please run: npx vercel login"
  exit 1
fi

# Get NEXTAUTH_SECRET
NEXTAUTH_SECRET=$(openssl rand -base64 32)
echo "Generated NEXTAUTH_SECRET: $NEXTAUTH_SECRET"
echo ""

# Get project URL (you'll need to update this)
read -p "Enter your Vercel deployment URL (e.g., https://claimjumpers.vercel.app): " NEXTAUTH_URL

if [ -z "$NEXTAUTH_URL" ]; then
  echo "❌ NEXTAUTH_URL is required"
  exit 1
fi

echo ""
echo "📝 Adding environment variables..."
echo ""

# Note: DATABASE_URL should use POSTGRES_PRISMA_URL from Vercel
# You need to get this from Vercel dashboard first
echo "⚠️  IMPORTANT: First, get POSTGRES_PRISMA_URL from Vercel dashboard:"
echo "   1. Go to your project → Storage → claimjumpers-db"
echo "   2. Copy the POSTGRES_PRISMA_URL value"
echo ""
read -p "Paste POSTGRES_PRISMA_URL here: " DATABASE_URL

if [ -z "$DATABASE_URL" ]; then
  echo "❌ DATABASE_URL is required"
  exit 1
fi

echo ""
echo "Adding DATABASE_URL..."
npx vercel env add DATABASE_URL production <<< "$DATABASE_URL"
npx vercel env add DATABASE_URL preview <<< "$DATABASE_URL"
npx vercel env add DATABASE_URL development <<< "$DATABASE_URL"

echo ""
echo "Adding NEXTAUTH_SECRET..."
npx vercel env add NEXTAUTH_SECRET production <<< "$NEXTAUTH_SECRET"
npx vercel env add NEXTAUTH_SECRET preview <<< "$NEXTAUTH_SECRET"
npx vercel env add NEXTAUTH_SECRET development <<< "$NEXTAUTH_SECRET"

echo ""
echo "Adding NEXTAUTH_URL..."
npx vercel env add NEXTAUTH_URL production <<< "$NEXTAUTH_URL"
npx vercel env add NEXTAUTH_URL preview <<< "$NEXTAUTH_URL"
npx vercel env add NEXTAUTH_URL development <<< "$NEXTAUTH_URL"

echo ""
echo "✅ Environment variables added!"
echo ""
echo "Next steps:"
echo "1. Redeploy your project in Vercel dashboard"
echo "2. Migrations will run automatically during build"

