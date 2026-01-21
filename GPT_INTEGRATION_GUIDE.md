# 🤖 Complete Integration Guide: Odoo → Vercel → GPT Agent Petshouse

This guide connects your **Odoo backend**, **Vercel-hosted API**, and **GPT Agent** with custom actions.

---

## 📋 Overview

```
┌─────────────┐      JSON-RPC      ┌──────────────┐      REST API      ┌─────────────┐
│    Odoo     │ ◄─────────────────► │ Vercel API   │ ◄─────────────────► │ GPT Agent   │
│  (Backend)  │   Authentication    │  (Proxy)     │   OpenAPI Actions  │ (Petshouse) │
└─────────────┘                     └──────────────┘                     └─────────────┘
```

---

## 🎯 Phase 1: Fix Odoo Authentication

### Step 1.1: Get Your Correct Credentials

**Option A - Use Real Password:**
1. Try logging in at https://pets-house.odoo.com
2. Use your actual login password

**Option B - Generate API Key (Recommended):**
1. Login to https://pets-house.odoo.com
2. Click your profile → **My Profile** / **Preferences**
3. Go to **Account Security** tab
4. Click **"New API Key"** 
5. Name it: "API Petshouse"
6. **Copy the key immediately** (shows only once!)

### Step 1.2: Update Your .env File

```bash
# Open .env and update:
ODOO_PASSWORD=your_real_password_or_api_key_here
```

### Step 1.3: Test Connection

```bash
node test-odoo-connection.js
```

✅ **Expected output:**
```
✅ Authentication Successful!
User ID: 2
Session ID: abc123...
```

❌ **If still failing:** Verify database name and URL are correct.

---

## 🚀 Phase 2: Deploy to Vercel

### Step 2.1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2.2: Login to Vercel

```bash
vercel login
```

### Step 2.3: Deploy Your API

```bash
# From your project directory
cd /mnt/c/Users/Mega-PC/Desktop/Projects/ApiPetshouse
vercel
```

Follow the prompts:
- **Set up and deploy?** → Yes
- **Which scope?** → Your account
- **Link to existing project?** → No
- **Project name?** → apipetshouse (or your choice)
- **Directory?** → ./ (current directory)

### Step 2.4: Set Environment Variables in Vercel

```bash
# Set each variable (it will prompt you for the value)
vercel env add ODOO_URL production
# Enter: https://pets-house.odoo.com

vercel env add ODOO_DB production
# Enter: pets-house

vercel env add ODOO_USERNAME production
# Enter: saleh.touil.3@gmail.com

vercel env add ODOO_PASSWORD production
# Enter: your_password_or_api_key

vercel env add API_BEARER_TOKEN production
# Enter: Ktk5+zi6f917Asc/G89go8R4lnmYepoEJTN7r8vWX+8=

vercel env add API_KEY production
# Enter: xJ8Ks2Qp+7mN3vB9Rw5Ty1Hg4Lf6Zx0Cd8Vn2Js5Yu=
```

### Step 2.5: Deploy to Production

```bash
vercel --prod
```

📝 **Note your deployment URL:** `https://apipetshouse-xxx.vercel.app`

### Step 2.6: Test Your Live API

```bash
# Test products endpoint
curl -H "X-API-Key: xJ8Ks2Qp+7mN3vB9Rw5Ty1Hg4Lf6Zx0Cd8Vn2Js5Yu=" \
  https://your-vercel-url.vercel.app/api/products?limit=5

# Test orders endpoint
curl -H "X-API-Key: xJ8Ks2Qp+7mN3vB9Rw5Ty1Hg4Lf6Zx0Cd8Vn2Js5Yu=" \
  https://your-vercel-url.vercel.app/api/orders?limit=5
```

---

## 🤖 Phase 3: Create GPT Agent with Custom Actions

### Step 3.1: Access GPT Builder

1. Go to https://chat.openai.com
2. Click your profile → **My GPTs**
3. Click **"Create a GPT"** or **"+ Create"**

### Step 3.2: Configure GPT Basic Info

**Name:** Agent Petshouse

**Description:**
```
I'm your intelligent assistant for Pets House store. I can help you search products, 
check prices, view product variants, browse orders, and manage your pet supplies 
inventory. Ask me about any products or orders!
```

**Instructions:**
```
You are Agent Petshouse, an expert assistant for the Pets House online store specializing in pet supplies.

Your capabilities:
- Search and browse pet products (food, toys, accessories, grooming items)
- Check product prices and availability
- View product variants (sizes, colors, flavors)
- List and search customer orders
- Provide detailed product information
- Help customers find the right products for their pets

When users ask about products:
1. Use the search_products action to find relevant items
2. Present results in a friendly, organized way
3. Highlight key details: name, price, variants, availability
4. Suggest related products when relevant
5. Always use the actual data from the API

When users ask about orders:
1. Use the list_orders action to fetch order information
2. Present order details clearly: ID, date, status, total
3. Explain order states in simple terms

Best practices:
- Be helpful and friendly with pet owners
- Ask clarifying questions if the request is vague
- Suggest products based on pet type, size, or needs
- Explain technical details in simple terms
- Always verify information using the actions before responding
- If an API call fails, explain the issue clearly and suggest alternatives
```

**Conversation starters:**
```
- "Show me the latest pet products"
- "Find dog food under $50"
- "What cat toys do you have?"
- "List my recent orders"
```

### Step 3.3: Get Your OpenAPI Schema

Visit your Vercel deployment:
```
https://your-vercel-url.vercel.app/api/api-docs
```

Copy the entire JSON response (this is your OpenAPI schema).

### Step 3.4: Configure Actions

1. In GPT Builder, go to **"Configure"** tab
2. Scroll to **"Actions"** section
3. Click **"Create new action"**

#### Authentication Setup

4. In **"Authentication"**, select **"API Key"**
5. Configure:
   - **API Key:** `xJ8Ks2Qp+7mN3vB9Rw5Ty1Hg4Lf6Zx0Cd8Vn2Js5Yu=`
   - **Auth Type:** Custom
   - **Custom Header Name:** `X-API-Key`

#### Schema Import

6. Click **"Import from URL"** or **"Paste schema"**
7. If using URL: `https://your-vercel-url.vercel.app/api/api-docs`
8. Or paste the OpenAPI JSON schema you copied

#### Action Configuration

The schema should automatically create these actions:
- **search_products** - Search for products
- **list_orders** - List customer orders
- **create_order** - Create new order (if needed)
- **confirm_order** - Confirm an order

### Step 3.5: Test Your Actions

In the GPT Builder:

1. Click **"Preview"** on the right side
2. Try these test queries:

```
"Show me 5 products"
"Search for dog food"
"What orders do we have?"
"Find products under $20"
```

3. You should see the GPT calling your API and returning real data

---

## 🧪 Phase 4: Testing the Complete Flow

### Test 1: Product Search

**User:** "Show me pet products"

**GPT Should:**
1. Call `GET /api/products?limit=10`
2. Return formatted product list with names, prices, IDs
3. Ask if user wants more details

### Test 2: Specific Product Search

**User:** "Find cat food"

**GPT Should:**
1. Call `GET /api/products?search=cat food`
2. Show relevant cat food products
3. Display prices and variants

### Test 3: Order Management

**User:** "What orders do we have?"

**GPT Should:**
1. Call `GET /api/orders?limit=10`
2. Show order list with IDs, dates, statuses
3. Explain order states

---

## 📊 Enhanced Schema for GPT (Optional)

If you want better GPT integration, update your API endpoints with more descriptive JSDoc comments.

---

## 🔧 Troubleshooting

### Problem: GPT can't connect to API

**Solution:**
1. Verify Vercel URL is accessible: `curl https://your-url.vercel.app`
2. Check API key is correct in GPT configuration
3. Look at Vercel logs: `vercel logs`

### Problem: Authentication fails

**Solution:**
1. Test locally first: `npm run dev`
2. Verify .env credentials
3. Run `node test-odoo-connection.js`
4. Check Odoo is accessible from Vercel (no IP restrictions)

### Problem: GPT gets empty results

**Solution:**
1. Check Odoo has products: Login to Odoo → Sales → Products
2. Verify products are published/active
3. Test API directly: `curl -H "X-API-Key: xxx" https://your-url.vercel.app/api/products`

### Problem: Rate limit errors

**Solution:**
1. Increase limits in Vercel environment variables
2. Implement Redis-based rate limiting for production
3. Add caching layer for frequently accessed data

---

## 🎉 Success Checklist

- [ ] Odoo authentication works (test-odoo-connection.js succeeds)
- [ ] Local API returns products (`curl localhost:3000/api/products`)
- [ ] Deployed to Vercel successfully
- [ ] Vercel API is accessible (returns products)
- [ ] GPT created with correct name and instructions
- [ ] GPT actions configured with OpenAPI schema
- [ ] Authentication configured (X-API-Key)
- [ ] Test conversations work (GPT fetches real data)
- [ ] GPT responds naturally about products and orders

---

## 🚀 Next Steps

1. **Add More Endpoints:**
   - Product variants/attributes
   - Product images
   - Stock/inventory levels
   - Customer management
   - Shopping cart

2. **Enhance GPT Instructions:**
   - Product recommendations based on pet type
   - Price comparisons
   - Inventory alerts
   - Order tracking

3. **Production Improvements:**
   - Redis-based rate limiting
   - Response caching
   - Error handling
   - Logging and monitoring
   - Webhook support

4. **Security Enhancements:**
   - API key rotation
   - User-specific API keys
   - Request signing
   - IP whitelisting

---

## 📞 Support

If you encounter issues:

1. **Check Vercel logs:** `vercel logs --follow`
2. **Test local API:** `npm run dev`
3. **Verify Odoo access:** Visit https://pets-house.odoo.com
4. **Review OpenAPI docs:** Visit `/api-docs` on your deployment

---

## 📝 Example GPT Conversation

**User:** "What products do you have for dogs?"

**GPT:** "Let me search for dog products for you..."
*[Calls: GET /api/products?search=dog]*

"I found 15 products for dogs! Here are the top items:

1. **Premium Dog Food - Chicken & Rice** 
   - Price: $45.99
   - ID: 123

2. **Interactive Dog Toy Bundle**
   - Price: $29.99
   - ID: 124

3. **Large Dog Bed - Orthopedic**
   - Price: $89.99
   - ID: 125

Would you like more details about any of these products? Or shall I show you more options?"

---

**Ready to get started? Follow Phase 1 first to fix authentication! 🚀**
