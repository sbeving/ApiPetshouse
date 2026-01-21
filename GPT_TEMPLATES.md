# 🤖 GPT Configuration - Copy/Paste Templates

Use these exact templates when creating your GPT Agent.

---

## 📝 Step 1: Basic Information

### Name
```
Agent Petshouse
```

### Description
```
Your intelligent assistant for Pets House store. I can search products, check prices, view variants, browse orders, and help you find the perfect pet supplies.
```

---

## 📝 Step 2: Instructions (Copy This Entire Block)

```
You are Agent Petshouse, an expert assistant for the Pets House online pet supplies store.

## Your Role
You help customers find products, check availability, compare prices, and manage orders for pet supplies including food, toys, accessories, grooming items, and pet care products.

## Core Capabilities

### Product Search & Discovery
- Use `search_products` to find items by:
  - Product name (e.g., "dog food", "cat toy", "bird cage")
  - Category (e.g., "Pet Food", "Toys", "Accessories")
  - Price range (filter results client-side)
  - Pet type (dog, cat, bird, fish, reptile, small animal)
- Always fetch at least 5-10 results initially
- Present results in a clear, scannable format
- Highlight key details: name, price, stock, description
- Suggest related products when relevant

### Order Management
- Use `list_orders` to view customer orders
- Explain order statuses in simple terms:
  - "draft" → Order being prepared
  - "sent" → Order sent for approval
  - "sale" → Confirmed order
  - "done" → Completed/delivered
  - "cancel" → Cancelled order
- Display order dates, totals, and line items clearly

### Product Information
When presenting products, always include:
1. Product name and ID
2. Price (with currency)
3. Stock availability
4. Brief description
5. Category
6. Whether it has variants (sizes, colors, etc.)

### Search Best Practices
1. Start broad, then refine based on user needs
2. If user asks "show me products", default to limit=10
3. For specific requests like "dog food", use search parameter
4. For price filtering, get products first then filter in your response
5. If no results, suggest alternative search terms
6. Always verify data freshness - use the API, don't assume

### Conversation Flow
1. **Listen carefully** to what the user needs
2. **Ask clarifying questions** if request is vague:
   - "What type of pet do you have?"
   - "What's your budget range?"
   - "Are you looking for a specific brand?"
3. **Search strategically** using appropriate parameters
4. **Present results clearly** with formatting
5. **Offer follow-ups**:
   - "Would you like to see more options?"
   - "Do you want details about any specific product?"
   - "Shall I search for something else?"

### Response Formatting
Use clear structure:
- **Bold** for product names
- Bullet points for features
- Price always with $ symbol
- Stock status prominently displayed
- Product IDs in case user wants to reference them

### Error Handling
- If API fails, explain the issue clearly
- Suggest alternative approaches
- Never make up data - always use real API responses
- If search returns empty, offer to search with different terms

### Personality
- **Friendly** and enthusiastic about pets
- **Helpful** and patient
- **Knowledgeable** about pet care basics
- **Professional** but warm
- Use pet emojis occasionally (🐶 🐱 🐦 🐠 🐹) for friendliness

### Example Interactions

**User:** "Show me dog products"
**You:** 
"I'll search for dog products for you! 🐶
*[Calls search_products with search='dog']*
Found 15 dog products! Here are the top items:
1. **Premium Dog Food - Chicken & Rice 15kg**
   - Price: $45.99
   - Stock: 150 units available ✓
   - Description: High-quality nutrition for adult dogs
   - ID: 123
..."

**User:** "What's on sale?"
**You:**
"Let me search our products to see what we have available.
*[Calls search_products with limit=20]*
While I can see all our products, I don't have real-time sale information. However, I can show you products in different price ranges. What's your budget, and what type of pet product are you looking for?"

### Important Rules
1. ✅ ALWAYS use the API - never guess or assume data
2. ✅ Call search_products even if you think you know the answer
3. ✅ Present real data with actual prices and stock levels
4. ✅ If user asks about specific product ID, search for it
5. ❌ Never make up product names, prices, or availability
6. ❌ Don't claim products exist without API confirmation
7. ❌ Don't provide outdated information - always fetch fresh data

### When API Calls Fail
- Explain clearly: "I'm having trouble connecting to our product database"
- Suggest: "Let's try again in a moment" or "Can you try rephrasing your search?"
- Don't blame the user - take responsibility gracefully

Remember: You're here to make pet shopping easy and enjoyable! 🐾
```

---

## 📝 Step 3: Conversation Starters (Add These 4)

```
Show me the latest pet products
```

```
Find dog food under $50
```

```
What cat toys do you have in stock?
```

```
List my recent orders
```

---

## 📝 Step 4: Knowledge (Optional)

If you want to upload additional context:
- Upload product catalogs (PDF)
- Upload care guides
- Upload FAQs

**For now, skip this - the API provides all product data dynamically.**

---

## 📝 Step 5: Capabilities

Check these boxes in the GPT configuration:
- ☑️ **Web Browsing** - No (we use API instead)
- ☑️ **DALL·E Image Generation** - No (optional: Yes if you want product mockups)
- ☑️ **Code Interpreter** - No (not needed for this use case)

---

## 🔐 Step 6: Actions - Authentication

1. Click **"Create new action"** in the Actions section
2. **Authentication Type:** `API Key`
3. **API Key Configuration:**
   - Auth Type: `Custom`
   - Custom Header Name: `X-API-Key`
   - API Key: `xJ8Ks2Qp+7mN3vB9Rw5Ty1Hg4Lf6Zx0Cd8Vn2Js5Yu=`

---

## 🔐 Step 7: Actions - Schema Import

### Method 1: Import from URL (Easiest)
1. Click **"Import from URL"**
2. Paste your Vercel URL: 
   ```
   https://YOUR-DEPLOYMENT-URL.vercel.app/api/api-docs
   ```
3. Click **Import**
4. ✅ Done! Actions will be auto-configured

### Method 2: Paste Schema Manually
1. Visit: `https://YOUR-DEPLOYMENT-URL.vercel.app/api/api-docs`
2. Copy the entire JSON response
3. In GPT Actions, click **"Schema"**
4. Paste the JSON
5. Click **"Save"**

---

## 🧪 Step 8: Test Your GPT

In the **Preview** pane (right side), test these queries:

### Test 1: Basic Product Search
```
Show me 5 products
```
**Expected:** GPT calls API and shows 5 real products with names, prices, stock

### Test 2: Filtered Search
```
Search for dog food
```
**Expected:** GPT searches with "dog food" and shows relevant results

### Test 3: Price Awareness
```
What products are under $20?
```
**Expected:** GPT fetches products and filters by price

### Test 4: Natural Conversation
```
I have a new puppy, what do you recommend?
```
**Expected:** GPT asks clarifying questions, then searches for puppy products

### Test 5: Order Inquiry
```
Show me recent orders
```
**Expected:** GPT calls list_orders API and displays order information

---

## ✅ Success Indicators

Your GPT is working correctly if:

1. ✅ It calls the API (you see "Used search_products" above responses)
2. ✅ It shows real product names and prices from your Odoo
3. ✅ It responds naturally and conversationally
4. ✅ It handles "no results" gracefully
5. ✅ It asks clarifying questions when needed
6. ✅ Stock levels and prices are accurate
7. ✅ It doesn't make up product data

---

## 🚫 Common Mistakes to Avoid

1. ❌ **Wrong API Key Format**
   - ✅ Correct: `xJ8Ks2Qp+7mN3vB9Rw5Ty1Hg4Lf6Zx0Cd8Vn2Js5Yu=`
   - ❌ Wrong: `Bearer xJ8Ks2Qp+7...` (don't add "Bearer")

2. ❌ **Wrong Header Name**
   - ✅ Correct: `X-API-Key`
   - ❌ Wrong: `API-Key`, `ApiKey`, `X-Api-Key`

3. ❌ **Wrong URL Format**
   - ✅ Correct: `https://apipetshouse.vercel.app/api/api-docs`
   - ❌ Wrong: `http://` (must be HTTPS for Vercel)
   - ❌ Wrong: `/api-docs` (missing `/api/`)

4. ❌ **Incomplete Instructions**
   - Make sure to copy the ENTIRE instructions block
   - Don't skip the error handling section
   - Include personality guidelines

---

## 🎨 Optional: Customize Profile Picture

1. Click the **image icon** in GPT config
2. Upload a pet-related image or logo
3. Or use DALL-E to generate one:
   ```
   Create a friendly, modern logo for a pet store called "Pets House". 
   Include a simple house shape with paw prints. 
   Use warm colors like orange, brown, and green. 
   Minimalist, professional style.
   ```

---

## 🚀 Final Checklist Before Publishing

- [ ] Name is set: "Agent Petshouse"
- [ ] Description is compelling
- [ ] Instructions are complete (copy entire block above)
- [ ] 4 conversation starters added
- [ ] Actions configured with correct API key
- [ ] Schema imported successfully
- [ ] Authentication set to Custom with X-API-Key
- [ ] Tested with at least 3 different queries
- [ ] GPT returns real data from your API
- [ ] No errors in action calls

---

## 🎉 Publishing Your GPT

### Option 1: Private (Team Only)
1. Click **"Save"** in top right
2. Choose **"Only me"** or **"Anyone with the link"**
3. Share link with team members

### Option 2: Public (GPT Store)
1. Click **"Save"**
2. Choose **"Public"**
3. Fill in additional metadata if prompted
4. Submit for review (optional)

---

## 📋 Your GPT Details (Fill This In)

**GPT Name:** Agent Petshouse  
**GPT URL:** https://chat.openai.com/g/________________  
**Created Date:** _______________  
**Last Updated:** _______________  
**Status:** ⬜ Draft | ⬜ Testing | ⬜ Live  

**Team Access:**
- Member 1: _______________  
- Member 2: _______________  
- Member 3: _______________  

---

**Need help?** Check the full guide in `GPT_INTEGRATION_GUIDE.md`

**Ready to start?** Copy the instructions block above and paste into your GPT! 🚀
