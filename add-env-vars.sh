#!/bin/bash

echo "🔐 Step 1: Login to Vercel"
npx vercel login

echo ""
echo "🔗 Step 2: Link your project"
npx vercel link

echo ""
echo "📋 Step 3: Get POSTGRES_PRISMA_URL from Vercel dashboard"
echo "   Go to: Project → Storage → claimjumpers-db"
echo "   Copy the POSTGRES_PRISMA_URL value"
echo ""
read -p "Paste POSTGRES_PRISMA_URL here: " POSTGRES_URL

if [ -z "$POSTGRES_URL" ]; then
  echo "❌ POSTGRES_PRISMA_URL is required"
  exit 1
fi

echo ""
read -p "Enter your Vercel app URL (e.g., https://claimjumpers.vercel.app): " APP_URL

if [ -z "$APP_URL" ]; then
  APP_URL="https://claimjumpers.vercel.app"
  echo "Using default: $APP_URL"
fi

NEXTAUTH_SECRET="zafZGBRG6AabBVH5t5HvAzfDCgX/7LMxH50bpimEi5k="

echo ""
echo "📝 Adding environment variables..."

echo "$POSTGRES_URL" | npx vercel env add DATABASE_URL production
echo "$POSTGRES_URL" | npx vercel env add DATABASE_URL preview
echo "$POSTGRES_URL" | npx vercel env add DATABASE_URL development

echo "$NEXTAUTH_SECRET" | npx vercel env add NEXTAUTH_SECRET production
echo "$NEXTAUTH_SECRET" | npx vercel env add NEXTAUTH_SECRET preview
echo "$NEXTAUTH_SECRET" | npx vercel env add NEXTAUTH_SECRET development

echo "$APP_URL" | npx vercel env add NEXTAUTH_URL production
echo "$APP_URL" | npx vercel env add NEXTAUTH_URL preview
echo "$APP_URL" | npx vercel env add NEXTAUTH_URL development

echo ""
echo "✅ Done! Now redeploy your project in Vercel dashboard."
