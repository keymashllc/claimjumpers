# Add Environment Variables to Vercel

Run these commands in order:

## Step 1: Login to Vercel
```bash
npx vercel login
```
(This will open your browser to authenticate)

## Step 2: Link Your Project
```bash
npx vercel link
```
- Select your existing project: `claimjumpers`
- Or create a new one if prompted

## Step 3: Get POSTGRES_PRISMA_URL

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Click on your `claimjumpers` project
3. Go to **Storage** tab
4. Click on `claimjumpers-db`
5. Copy the **POSTGRES_PRISMA_URL** value

## Step 4: Add Environment Variables

Run these commands (replace `YOUR_POSTGRES_PRISMA_URL` with the value from Step 3):

```bash
# Add DATABASE_URL
echo "YOUR_POSTGRES_PRISMA_URL" | npx vercel env add DATABASE_URL production
echo "YOUR_POSTGRES_PRISMA_URL" | npx vercel env add DATABASE_URL preview  
echo "YOUR_POSTGRES_PRISMA_URL" | npx vercel env add DATABASE_URL development

# Add NEXTAUTH_SECRET
echo "zafZGBRG6AabBVH5t5HvAzfDCgX/7LMxH50bpimEi5k=" | npx vercel env add NEXTAUTH_SECRET production
echo "zafZGBRG6AabBVH5t5HvAzfDCgX/7LMxH50bpimEi5k=" | npx vercel env add NEXTAUTH_SECRET preview
echo "zafZGBRG6AabBVH5t5HvAzfDCgX/7LMxH50bpimEi5k=" | npx vercel env add NEXTAUTH_SECRET development

# Add NEXTAUTH_URL (replace with your actual Vercel URL)
echo "https://claimjumpers.vercel.app" | npx vercel env add NEXTAUTH_URL production
echo "https://claimjumpers.vercel.app" | npx vercel env add NEXTAUTH_URL preview
echo "https://claimjumpers.vercel.app" | npx vercel env add NEXTAUTH_URL development
```

## Step 5: Redeploy

Go to Vercel dashboard and redeploy, or run:
```bash
npx vercel --prod
```

