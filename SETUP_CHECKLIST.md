# 📋 Agent Petshouse Setup Checklist

Use this checklist to track your progress connecting Odoo → Vercel → GPT Agent.

---

## ☑️ Phase 1: Fix Odoo Authentication

- [ ] **1.1** Login to Odoo at https://pets-house.odoo.com
- [ ] **1.2** Verify you can access the backend
- [ ] **1.3** Choose authentication method:
  - [ ] Option A: Use real password
  - [ ] Option B: Generate API key (Settings → Account Security → New API Key)
- [ ] **1.4** Update `.env` file with correct credentials
  ```bash
  ODOO_PASSWORD=your_correct_password_or_api_key
  ```
- [ ] **1.5** Test connection: `node test-odoo-connection.js`
- [ ] **1.6** ✅ See "Authentication Successful!" message

**Status:** ⬜ Not Started | 🟡 In Progress | ✅ Complete | ❌ Blocked

---

## ☑️ Phase 2: Test Locally

- [ ] **2.1** Install dependencies: `npm install`
- [ ] **2.2** Start dev server: `npm run dev`
- [ ] **2.3** Visit http://localhost:3000 (home page loads)
- [ ] **2.4** Visit http://localhost:3000/api-docs (Swagger UI loads)
- [ ] **2.5** Test products endpoint:
  ```bash
  curl -H "X-API-Key: xJ8Ks2Qp+7mN3vB9Rw5Ty1Hg4Lf6Zx0Cd8Vn2Js5Yu=" \
    http://localhost:3000/api/products?limit=5
  ```
- [ ] **2.6** ✅ API returns products from Odoo
- [ ] **2.7** Test search:
  ```bash
  curl -H "X-API-Key: xJ8Ks2Qp+7mN3vB9Rw5Ty1Hg4Lf6Zx0Cd8Vn2Js5Yu=" \
    "http://localhost:3000/api/products?search=dog&limit=5"
  ```
- [ ] **2.8** ✅ Search returns filtered results

**Status:** ⬜ Not Started | 🟡 In Progress | ✅ Complete | ❌ Blocked

---

## ☑️ Phase 3: Deploy to Vercel

- [ ] **3.1** Create Vercel account at https://vercel.com
- [ ] **3.2** Install Vercel CLI: `npm install -g vercel`
- [ ] **3.3** Login: `vercel login`
- [ ] **3.4** Initial deploy: `vercel`
- [ ] **3.5** Set environment variables (one by one):
  ```bash
  vercel env add ODOO_URL production
  vercel env add ODOO_DB production
  vercel env add ODOO_USERNAME production
  vercel env add ODOO_PASSWORD production
  vercel env add API_BEARER_TOKEN production
  vercel env add API_KEY production
  ```
- [ ] **3.6** Production deploy: `vercel --prod`
- [ ] **3.7** **Copy deployment URL:** `_______________________________`
- [ ] **3.8** Test live API:
  ```bash
  curl -H "X-API-Key: xJ8Ks2Qp+7mN3vB9Rw5Ty1Hg4Lf6Zx0Cd8Vn2Js5Yu=" \
    https://YOUR-URL.vercel.app/api/products?limit=5
  ```
- [ ] **3.9** ✅ Live API returns products
- [ ] **3.10** Visit OpenAPI docs at: `https://YOUR-URL.vercel.app/api-docs`
- [ ] **3.11** ✅ Swagger UI loads on production

**Your Vercel URL:** `https://_____________________.vercel.app`

**Status:** ⬜ Not Started | 🟡 In Progress | ✅ Complete | ❌ Blocked

---

## ☑️ Phase 4: Create GPT Agent

- [ ] **4.1** Go to https://chat.openai.com
- [ ] **4.2** Navigate to My GPTs
- [ ] **4.3** Click "Create a GPT"
- [ ] **4.4** **Configure** tab → Set name: "Agent Petshouse"
- [ ] **4.5** Set description: (copy from GPT_INTEGRATION_GUIDE.md)
- [ ] **4.6** Set instructions: (copy from GPT_INTEGRATION_GUIDE.md)
- [ ] **4.7** Add conversation starters:
  - [ ] "Show me the latest pet products"
  - [ ] "Find dog food under $50"
  - [ ] "What cat toys do you have?"
  - [ ] "List my recent orders"
- [ ] **4.8** Scroll to **Actions** section
- [ ] **4.9** Click "Create new action"

**Status:** ⬜ Not Started | 🟡 In Progress | ✅ Complete | ❌ Blocked

---

## ☑️ Phase 5: Configure GPT Actions

- [ ] **5.1** In Actions, select **Authentication** → **API Key**
- [ ] **5.2** Set Auth Type: **Custom**
- [ ] **5.3** Set Header Name: `X-API-Key`
- [ ] **5.4** Set API Key Value: `xJ8Ks2Qp+7mN3vB9Rw5Ty1Hg4Lf6Zx0Cd8Vn2Js5Yu=`
- [ ] **5.5** **Import Schema** → Choose method:
  - [ ] Option A: Import from URL: `https://YOUR-URL.vercel.app/api/api-docs`
  - [ ] Option B: Copy/paste OpenAPI JSON from that URL
- [ ] **5.6** ✅ Schema imported successfully
- [ ] **5.7** Verify actions appear:
  - [ ] `search_products`
  - [ ] `list_orders`
  - [ ] `create_order` (if needed)
  - [ ] `confirm_order` (if needed)
- [ ] **5.8** Click **Save** or **Update**

**Status:** ⬜ Not Started | 🟡 In Progress | ✅ Complete | ❌ Blocked

---

## ☑️ Phase 6: Test GPT Integration

### Basic Tests
- [ ] **6.1** In GPT Preview, send: "Show me 5 products"
- [ ] **6.2** ✅ GPT calls API and returns real products
- [ ] **6.3** Send: "Search for dog food"
- [ ] **6.4** ✅ GPT returns filtered dog food products
- [ ] **6.5** Send: "What products cost less than $20?"
- [ ] **6.6** ✅ GPT filters by price correctly
- [ ] **6.7** Send: "List recent orders"
- [ ] **6.8** ✅ GPT returns order data (or explains if none exist)

### Advanced Tests
- [ ] **6.9** Ask follow-up question: "Tell me more about product #123"
- [ ] **6.10** ✅ GPT maintains context and searches specific product
- [ ] **6.11** Ask: "Compare these products"
- [ ] **6.12** ✅ GPT provides intelligent comparison
- [ ] **6.13** Test error handling: "Search for xyznonexistent"
- [ ] **6.14** ✅ GPT handles no results gracefully

**Status:** ⬜ Not Started | 🟡 In Progress | ✅ Complete | ❌ Blocked

---

## ☑️ Phase 7: Production Readiness

### Security
- [ ] **7.1** Verify `.env` is in `.gitignore` (never commit secrets)
- [ ] **7.2** Consider rotating API keys monthly
- [ ] **7.3** Review Odoo user permissions (read-only for API?)
- [ ] **7.4** Enable Vercel access logs if needed

### Performance
- [ ] **7.5** Monitor Vercel analytics dashboard
- [ ] **7.6** Check average response times (should be < 2s)
- [ ] **7.7** Set up alerts for errors (optional)
- [ ] **7.8** Plan for rate limit increases if needed

### Documentation
- [ ] **7.9** Share GPT link with team members
- [ ] **7.10** Document custom workflows/use cases
- [ ] **7.11** Create user guide for GPT users
- [ ] **7.12** Update README with production URL

**Status:** ⬜ Not Started | 🟡 In Progress | ✅ Complete | ❌ Blocked

---

## 🎯 Success Criteria

**Minimum Viable Product (MVP):**
- ✅ Odoo authentication works
- ✅ API returns products on Vercel
- ✅ GPT can search products
- ✅ GPT responds naturally with real data

**Production Ready:**
- ✅ All MVP criteria
- ✅ Error handling tested
- ✅ Rate limiting verified
- ✅ Documentation complete
- ✅ Team trained on usage

---

## 🐛 Troubleshooting Log

Use this section to track any issues you encounter:

### Issue #1
**Problem:** _____________________  
**When:** _____________________  
**Error:** _____________________  
**Solution:** _____________________  
**Status:** ⬜ Open | ✅ Resolved

### Issue #2
**Problem:** _____________________  
**When:** _____________________  
**Error:** _____________________  
**Solution:** _____________________  
**Status:** ⬜ Open | ✅ Resolved

### Issue #3
**Problem:** _____________________  
**When:** _____________________  
**Error:** _____________________  
**Solution:** _____________________  
**Status:** ⬜ Open | ✅ Resolved

---

## 📞 Help Resources

If stuck, check these in order:

1. **QUICKSTART.md** - Quick reference guide
2. **GPT_INTEGRATION_GUIDE.md** - Detailed step-by-step
3. **ODOO_AUTH_GUIDE.md** - Authentication troubleshooting
4. **ARCHITECTURE.md** - System design and data flow
5. **Vercel Logs**: `vercel logs --follow`
6. **Test Script**: `node test-odoo-connection.js`

---

## 🎉 Completion

Once all checkboxes are complete:

- [ ] **Take a screenshot of GPT responding with real data**
- [ ] **Document your deployment URL for future reference**
- [ ] **Share with your team**
- [ ] **Plan next features**

**Deployment Date:** _______________  
**Vercel URL:** _______________  
**GPT Link:** _______________  

**Congratulations! Your Agent Petshouse is live! 🚀🐾**

---

## 📊 Progress Summary

- **Phase 1 (Auth):** ⬜ 0/6 | 🟡 Progress | ✅ Complete
- **Phase 2 (Local):** ⬜ 0/8 | 🟡 Progress | ✅ Complete
- **Phase 3 (Deploy):** ⬜ 0/11 | 🟡 Progress | ✅ Complete
- **Phase 4 (GPT Setup):** ⬜ 0/9 | 🟡 Progress | ✅ Complete
- **Phase 5 (Actions):** ⬜ 0/8 | 🟡 Progress | ✅ Complete
- **Phase 6 (Test):** ⬜ 0/14 | 🟡 Progress | ✅ Complete
- **Phase 7 (Production):** ⬜ 0/12 | 🟡 Progress | ✅ Complete

**Overall Progress:** ___% Complete
