# 🐾 Agent Petshouse - Odoo to GPT Integration

A complete integration connecting **Odoo backend** → **Vercel API Proxy** → **GPT Agent** for intelligent product search and management.

## 🎯 What Is This?

This project allows a GPT agent (AI assistant) to search and interact with your Odoo product catalog through natural language conversations.

**Example:**
> **User:** "Show me dog food under $30"  
> **GPT Agent:** *[Searches API → Returns real products from Odoo]*  
> "I found 8 dog food products under $30! Here are the top options: ..."

## ✨ Features

- 🤖 **GPT Integration**: Natural language interface to your product catalog
- 🔐 **Secure Authentication**: Bearer token and X-API-Key support
- 🚦 **Rate Limiting**: Prevent API abuse (100 requests/minute)
- 📝 **OpenAPI Documentation**: Interactive Swagger UI at `/api-docs`
- 🔄 **Session Management**: Automatic Odoo authentication and re-authentication
- 🎯 **REST Endpoints**: Clean REST API for products and orders
- ☁️ **Vercel Ready**: One-command deployment to production
- 📊 **Rich Product Data**: Prices, stock, variants, categories, descriptions

## 🚀 Quick Start

### **👉 START HERE: [README_START_HERE.md](README_START_HERE.md)**

Complete integration in 3 steps (60 minutes):
1. **Fix Odoo authentication** → [ODOO_AUTH_GUIDE.md](ODOO_AUTH_GUIDE.md)
2. **Deploy to Vercel** → [QUICKSTART.md](QUICKSTART.md)
3. **Create GPT Agent** → [GPT_TEMPLATES.md](GPT_TEMPLATES.md)

### Essential Documentation

| Document | Purpose | When to Use |
|----------|---------|-------------|
| **[README_START_HERE.md](README_START_HERE.md)** ⭐ | Complete overview | Read this first |
| **[QUICKSTART.md](QUICKSTART.md)** ⭐ | Fast setup guide | Quick reference |
| **[SETUP_CHECKLIST.md](SETUP_CHECKLIST.md)** ⭐ | Track progress | Follow along |
| **[GPT_TEMPLATES.md](GPT_TEMPLATES.md)** ⭐ | Copy/paste templates | Creating GPT |
| [ODOO_AUTH_GUIDE.md](ODOO_AUTH_GUIDE.md) | Fix authentication | "Access Denied" error |
| [GPT_INTEGRATION_GUIDE.md](GPT_INTEGRATION_GUIDE.md) | Detailed walkthrough | Need full details |
| [ARCHITECTURE.md](ARCHITECTURE.md) | System design | Understanding flow |

## 📊 System Architecture

```
User Question → GPT Agent → Vercel API → Odoo Backend → Product Data
     ↑                                                        ↓
     └───────────────── Natural Language Response ───────────┘
```

## ⚙️ Setup

### 1. Fix Odoo Authentication (CRITICAL!)

The current `.env` has incorrect Odoo credentials. Fix this first:

```bash
# Test current credentials
node test-odoo-connection.js

# If it fails, update .env with:
# - Your real Odoo password, OR
# - A generated API key from Odoo Settings
```

See **[ODOO_AUTH_GUIDE.md](ODOO_AUTH_GUIDE.md)** for detailed help.

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Your `.env` file needs these values:

```env
# Odoo Configuration
ODOO_URL=https://pets-house.odoo.com
ODOO_DB=pets-house
ODOO_USERNAME=saleh.touil.3@gmail.com
ODOO_PASSWORD=your_real_password_or_api_key_here  # ⚠️ FIX THIS!

# API Authentication (already generated)
API_BEARER_TOKEN=Ktk5+zi6f917Asc/G89go8R4lnmYepoEJTN7r8vWX+8=
API_KEY=xJ8Ks2Qp+7mN3vB9Rw5Ty1Hg4Lf6Zx0Cd8Vn2Js5Yu=

# Rate Limiting
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=60000
```

### 4. Test & Run

```bash
# Test Odoo connection first!
node test-odoo-connection.js

# If successful, start dev server
npm run dev
```

Visit:
- **Home:** http://localhost:3000
- **API Docs:** http://localhost:3000/api-docs
- **Test API:** `curl -H "X-API-Key: xJ8Ks2Qp+7mN3vB9Rw5Ty1Hg4Lf6Zx0Cd8Vn2Js5Yu=" http://localhost:3000/api/products?limit=5`

## 📡 API Endpoints

| Endpoint | Method | Description | GPT Action |
|----------|--------|-------------|------------|
| `/api/products` | GET | Search products | `search_products` |
| `/api/orders` | GET | List orders | `list_orders` |
| `/api/orders` | POST | Create order | `create_order` |
| `/api/orders/:id/confirm` | POST | Confirm order | `confirm_order` |

### Example: Search Products

```bash
# Basic search
curl -H "X-API-Key: xJ8Ks2Qp+7mN3vB9Rw5Ty1Hg4Lf6Zx0Cd8Vn2Js5Yu=" \
  "http://localhost:3000/api/products?search=dog&limit=5"

# With category filter
curl -H "X-API-Key: xJ8Ks2Qp+7mN3vB9Rw5Ty1Hg4Lf6Zx0Cd8Vn2Js5Yu=" \
  "http://localhost:3000/api/products?search=food&category=Pet%20Food"
```

### Example Response

```json
{
  "success": true,
  "data": [
    {
      "id": 123,
      "name": "Premium Dog Food - Chicken & Rice 15kg",
      "price": 45.99,
      "stock_quantity": 150,
      "category": "Pet Food",
      "description": "High-quality nutrition for adult dogs",
      "available": true,
      "has_variants": false
    }
  ],
  "count": 5,
  "has_more": false
}
```

## 🚀 Deploy to Vercel

```bash
# 1. Install CLI
npm install -g vercel

# 2. Deploy
vercel

# 3. Set environment variables (one by one)
vercel env add ODOO_URL production
vercel env add ODOO_DB production
vercel env add ODOO_USERNAME production
vercel env add ODOO_PASSWORD production
vercel env add API_BEARER_TOKEN production
vercel env add API_KEY production

# 4. Deploy to production
vercel --prod
```

See **[QUICKSTART.md](QUICKSTART.md)** for detailed deployment steps.

## 🤖 Create GPT Agent

1. Go to https://chat.openai.com/gpts/editor
2. Copy templates from **[GPT_TEMPLATES.md](GPT_TEMPLATES.md)**
3. Configure actions with your Vercel URL
4. Set authentication: `X-API-Key: xJ8Ks2Qp+7mN3vB9Rw5Ty1Hg4Lf6Zx0Cd8Vn2Js5Yu=`
5. Test: "Show me dog products"

See **[GPT_INTEGRATION_GUIDE.md](GPT_INTEGRATION_GUIDE.md)** for complete setup.

## 🏗️ Architecture

```
┌─────────────┐      REST API       ┌──────────────┐    JSON-RPC     ┌─────────────┐
│ GPT Agent   │ ◄─────────────────► │ Vercel API   │ ◄──────────────► │    Odoo     │
│ (Frontend)  │   X-API-Key Auth    │   (Proxy)    │   Session Auth  │  (Backend)  │
└─────────────┘                     └──────────────┘                  └─────────────┘
```

**Components:**
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Odoo JSON-RPC Client** with session management
- **Middleware** for auth and rate limiting
- **OpenAPI 3.0** specification with Swagger UI

## 🔐 Security Features

- ✅ Dual authentication (Bearer token + API key)
- ✅ Rate limiting (100 requests/minute)
- ✅ Environment variable configuration
- ✅ Secure session management
- ✅ No credentials in code

## 📚 Complete Documentation

| Topic | Document |
|-------|----------|
| **Getting Started** | [README_START_HERE.md](README_START_HERE.md) |
| **Quick Setup** | [QUICKSTART.md](QUICKSTART.md) |
| **Progress Tracking** | [SETUP_CHECKLIST.md](SETUP_CHECKLIST.md) |
| **GPT Configuration** | [GPT_TEMPLATES.md](GPT_TEMPLATES.md) |
| **Integration Guide** | [GPT_INTEGRATION_GUIDE.md](GPT_INTEGRATION_GUIDE.md) |
| **Authentication** | [ODOO_AUTH_GUIDE.md](ODOO_AUTH_GUIDE.md) |
| **System Design** | [ARCHITECTURE.md](ARCHITECTURE.md) |

## 🐛 Troubleshooting

### "Access Denied" from Odoo
→ **Fix:** Wrong password in `.env`. See [ODOO_AUTH_GUIDE.md](ODOO_AUTH_GUIDE.md)

### GPT can't connect to API
→ **Fix:** Check API key matches in GPT settings and `.env`

### No products returned
→ **Fix:** Verify Odoo has active products (Login → Sales → Products)

### Deployment fails
→ **Fix:** Check all environment variables are set: `vercel env ls`

## 🎯 Current Status

- ✅ API code complete and enhanced
- ✅ Authentication middleware working
- ✅ Rate limiting implemented
- ✅ OpenAPI documentation generated
- ✅ Complete integration guides created
- ⚠️ **Needs: Odoo authentication fix (wrong password in .env)**

## 🚀 Next Steps

1. **[CRITICAL]** Fix ODOO_PASSWORD in `.env`
2. Test locally: `node test-odoo-connection.js`
3. Deploy to Vercel: `vercel --prod`
4. Create GPT with actions
5. Test complete integration
6. Share with team

## 📞 Support

**Need help?** Check these in order:
1. [README_START_HERE.md](README_START_HERE.md) - Overview
2. [SETUP_CHECKLIST.md](SETUP_CHECKLIST.md) - Track progress
3. [ODOO_AUTH_GUIDE.md](ODOO_AUTH_GUIDE.md) - Auth issues
4. [QUICKSTART.md](QUICKSTART.md) - Quick reference
5. Run: `node test-odoo-connection.js` - Test connection
6. Check: `vercel logs` - View deployment logs

## 📄 License

ISC

---

**Ready to start? → [README_START_HERE.md](README_START_HERE.md)** 🚀

## License

ISC