# 🚀 Quick Start Guide

## Step 1: Fix Odoo Authentication (5 minutes)

### Option A: Use Your Real Password
```bash
# Edit .env file
ODOO_PASSWORD=your_actual_login_password
```

### Option B: Generate API Key (Recommended)
1. Login to https://pets-house.odoo.com
2. Profile → Preferences → Account Security
3. Create New API Key → Copy it
4. Update .env:
```bash
ODOO_PASSWORD=your_generated_api_key
```

## Step 2: Test Locally (2 minutes)

### Windows:
```bash
quick-setup.bat
```

### Linux/Mac:
```bash
chmod +x quick-setup.sh
./quick-setup.sh
```

### Manual:
```bash
# Test Odoo connection
node test-odoo-connection.js

# Start dev server
npm run dev
```

Visit: http://localhost:3000/api-docs

## Step 3: Test API (1 minute)

```bash
# Test products endpoint
curl -H "X-API-Key: xJ8Ks2Qp+7mN3vB9Rw5Ty1Hg4Lf6Zx0Cd8Vn2Js5Yu=" \
  http://localhost:3000/api/products?limit=5

# Test with search
curl -H "X-API-Key: xJ8Ks2Qp+7mN3vB9Rw5Ty1Hg4Lf6Zx0Cd8Vn2Js5Yu=" \
  "http://localhost:3000/api/products?search=dog&limit=5"
```

## Step 4: Deploy to Vercel (10 minutes)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Set environment variables
vercel env add ODOO_URL production
vercel env add ODOO_DB production
vercel env add ODOO_USERNAME production
vercel env add ODOO_PASSWORD production
vercel env add API_BEARER_TOKEN production
vercel env add API_KEY production

# Deploy to production
vercel --prod
```

**Copy your deployment URL:** `https://apipetshouse-xxx.vercel.app`

## Step 5: Create GPT Agent (15 minutes)

1. **Go to:** https://chat.openai.com/gpts/editor
2. **Create New GPT**

### Basic Info:
- **Name:** Agent Petshouse
- **Description:** Your intelligent pet store assistant

### Instructions:
```
You are Agent Petshouse, an expert assistant for the Pets House online store.

Capabilities:
- Search pet products by name, category, or type
- Show product prices, descriptions, and availability
- Display product variants and stock levels
- List and search customer orders
- Provide pet care recommendations

When searching products:
1. Use search_products with relevant terms (e.g., "dog food", "cat toy")
2. Present results clearly with: name, price, stock, description
3. Suggest related products when helpful
4. Always use real data from the API

Be friendly, helpful, and knowledgeable about pet supplies!
```

### Configure Actions:

1. **Authentication:**
   - Type: API Key
   - Auth Type: Custom
   - Header: `X-API-Key`
   - Value: `xJ8Ks2Qp+7mN3vB9Rw5Ty1Hg4Lf6Zx0Cd8Vn2Js5Yu=`

2. **Import Schema:**
   - URL: `https://your-vercel-url.vercel.app/api/api-docs`
   - Or paste the OpenAPI JSON

3. **Test:** Try "Show me pet products"

## Step 6: Test Complete Flow

**Test in GPT:**
```
"Show me dog products"
"Find cat food under $30"
"What products do you have for puppies?"
"List recent orders"
```

## 🎉 Success!

You should now have:
- ✅ Working Odoo connection
- ✅ Local API running
- ✅ Deployed to Vercel
- ✅ GPT agent with custom actions
- ✅ Full integration working

## 📚 More Information

- **Detailed Guide:** See `GPT_INTEGRATION_GUIDE.md`
- **Odoo Auth Help:** See `ODOO_AUTH_GUIDE.md`
- **Troubleshooting:** Check Vercel logs with `vercel logs`

## 🆘 Common Issues

### "Access Denied" error
→ Wrong Odoo password/API key. See `ODOO_AUTH_GUIDE.md`

### GPT can't connect
→ Check API key in GPT settings matches your `.env`

### No products returned
→ Check Odoo has products: Login to Odoo → Sales → Products

## 🚀 Next Steps

1. Add more product fields (images, reviews, ratings)
2. Implement caching for better performance
3. Add user-specific API keys
4. Set up monitoring and alerts
5. Add webhook support for real-time updates

**Need help? Check the full guide in `GPT_INTEGRATION_GUIDE.md`**
