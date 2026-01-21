# 🏗️ Agent Petshouse - Complete Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        USER INTERACTION                              │
│                                                                       │
│  👤 Customer asks: "Show me dog food products under $30"            │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      GPT AGENT PETSHOUSE                             │
│                   (chat.openai.com/g/xxx)                           │
│                                                                       │
│  🤖 Processes natural language request                               │
│  🧠 Determines action: search_products                               │
│  📊 Calls API with parameters:                                       │
│      - search: "dog food"                                            │
│      - price_max: 30                                                 │
└───────────────────────────────┬─────────────────────────────────────┘
                                │ HTTPS + X-API-Key
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    VERCEL API PROXY                                  │
│              (apipetshouse.vercel.app)                              │
│                                                                       │
│  ┌─────────────────────────────────────────────────┐               │
│  │  1. Authentication Middleware                    │               │
│  │     ✓ Validates X-API-Key or Bearer Token      │               │
│  │     ✗ Rejects unauthorized requests             │               │
│  └─────────────────────────────────────────────────┘               │
│                          │                                           │
│  ┌─────────────────────────────────────────────────┐               │
│  │  2. Rate Limiting Middleware                     │               │
│  │     ✓ Checks request count (100/min)            │               │
│  │     ✗ Returns 429 if limit exceeded             │               │
│  └─────────────────────────────────────────────────┘               │
│                          │                                           │
│  ┌─────────────────────────────────────────────────┐               │
│  │  3. Route Handler: GET /api/products            │               │
│  │     - Parses query params                        │               │
│  │     - Builds Odoo search domain                  │               │
│  │     - Formats response for GPT                   │               │
│  └─────────────────────────────────────────────────┘               │
└───────────────────────────────┬─────────────────────────────────────┘
                                │ JSON-RPC over HTTPS
                                │ (with session cookies)
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      ODOO BACKEND                                    │
│                (pets-house.odoo.com)                                │
│                                                                       │
│  ┌─────────────────────────────────────────────────┐               │
│  │  1. Session Authentication                       │               │
│  │     ✓ Validates credentials                     │               │
│  │     ✓ Creates session cookie                    │               │
│  └─────────────────────────────────────────────────┘               │
│                          │                                           │
│  ┌─────────────────────────────────────────────────┐               │
│  │  2. ORM Query Execution                          │               │
│  │     - Searches product.template model            │               │
│  │     - Filters by domain: [('name','ilike','dog')]│               │
│  │     - Applies access rights                      │               │
│  └─────────────────────────────────────────────────┘               │
│                          │                                           │
│  ┌─────────────────────────────────────────────────┐               │
│  │  3. Database Query                               │               │
│  │     SELECT id, name, list_price, stock_qty...    │               │
│  │     FROM product_template                        │               │
│  │     WHERE name ILIKE '%dog%' AND list_price < 30 │               │
│  └─────────────────────────────────────────────────┘               │
└───────────────────────────────┬─────────────────────────────────────┘
                                │ Returns JSON result
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      RESPONSE FLOW                                   │
│                                                                       │
│  Odoo → Vercel → GPT → User                                         │
│                                                                       │
│  📦 Raw Odoo Data → 🔄 Formatted JSON → 🤖 Natural Language         │
└─────────────────────────────────────────────────────────────────────┘
```

## Data Flow Example

### Request: "Show me dog food products"

1. **GPT Agent** receives message
2. **GPT decides** to call `search_products` action
3. **API Request:**
   ```http
   GET /api/products?search=dog+food&limit=10
   X-API-Key: xJ8Ks2Qp+7mN3vB9Rw5Ty1Hg4Lf6Zx0Cd8Vn2Js5Yu=
   ```

4. **Vercel Proxy:**
   - ✅ Validates API key
   - ✅ Checks rate limit
   - 🔄 Converts to Odoo JSON-RPC:
   ```json
   {
     "model": "product.template",
     "method": "search_read",
     "args": [[["name", "ilike", "dog food"]]],
     "kwargs": {
       "fields": ["id", "name", "list_price", "qty_available"],
       "limit": 10
     }
   }
   ```

5. **Odoo Backend:**
   - 🔐 Authenticates session
   - 🔍 Queries database
   - 📤 Returns products:
   ```json
   [
     {
       "id": 123,
       "name": "Premium Dog Food - Chicken & Rice 15kg",
       "list_price": 45.99,
       "qty_available": 150
     },
     // ... more products
   ]
   ```

6. **Vercel Formats:**
   ```json
   {
     "success": true,
     "data": [
       {
         "id": 123,
         "name": "Premium Dog Food - Chicken & Rice 15kg",
         "price": 45.99,
         "stock_quantity": 150,
         "available": true,
         "has_variants": false
       }
     ],
     "count": 10
   }
   ```

7. **GPT Responds:**
   > "I found 10 dog food products! Here are the top results:
   >
   > 1. **Premium Dog Food - Chicken & Rice 15kg**
   >    - Price: $45.99
   >    - In stock: 150 units
   >    - Product ID: 123
   >
   > Would you like more details about any of these products?"

## Component Responsibilities

### 1. Odoo Backend (Data Layer)
- ✅ Store product data
- ✅ Manage inventory
- ✅ Process orders
- ✅ User authentication
- ✅ Business logic

### 2. Vercel API (Proxy Layer)
- ✅ REST → JSON-RPC translation
- ✅ Authentication (API keys)
- ✅ Rate limiting
- ✅ Session management
- ✅ Error handling
- ✅ Response formatting
- ✅ CORS handling

### 3. GPT Agent (Presentation Layer)
- ✅ Natural language understanding
- ✅ Action selection
- ✅ API integration
- ✅ Response formatting
- ✅ Context management
- ✅ Follow-up questions

## Security Flow

```
┌──────────────┐
│ GPT Request  │
└──────┬───────┘
       │
       ▼
┌─────────────────────────────┐
│ Vercel: Check X-API-Key     │
│ ✓ Valid → Continue          │
│ ✗ Invalid → 401 Unauthorized │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│ Vercel: Check Rate Limit    │
│ ✓ < 100/min → Continue      │
│ ✗ >= 100/min → 429 Rate Limit│
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│ Odoo: Session Auth          │
│ ✓ Valid session → Query DB  │
│ ✗ Expired → Re-authenticate │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│ Odoo: Access Rights Check   │
│ ✓ Allowed → Return Data     │
│ ✗ Denied → 403 Forbidden    │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│ Response to GPT             │
└─────────────────────────────┘
```

## Available Endpoints

| Endpoint | Method | Description | GPT Action Name |
|----------|--------|-------------|-----------------|
| `/api/products` | GET | Search products | `search_products` |
| `/api/orders` | GET | List orders | `list_orders` |
| `/api/orders` | POST | Create order | `create_order` |
| `/api/orders/:id/confirm` | POST | Confirm order | `confirm_order` |

## Environment Variables

### Development (.env)
```env
ODOO_URL=https://pets-house.odoo.com
ODOO_DB=pets-house
ODOO_USERNAME=saleh.touil.3@gmail.com
ODOO_PASSWORD=your_password_or_api_key

API_BEARER_TOKEN=generated_token_1
API_KEY=generated_token_2

RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=60000
```

### Production (Vercel)
- Set via: `vercel env add VARIABLE_NAME production`
- Stored securely in Vercel dashboard
- Auto-injected into serverless functions

## Performance Considerations

### Current Implementation
- **Session caching**: In-memory per request
- **Rate limiting**: In-memory per instance
- **No response caching**: Always fresh data

### Production Recommendations
1. **Redis for sessions**: Shared across instances
2. **Redis for rate limiting**: Distributed enforcement
3. **Response caching**: Cache frequent queries (products, categories)
4. **Connection pooling**: Reuse Odoo connections
5. **CDN**: For static API docs

## Monitoring

### What to Monitor
1. **API Response times** (Vercel analytics)
2. **Error rates** (500, 401, 429)
3. **Odoo connection health**
4. **Rate limit hits**
5. **GPT action success rates**

### Tools
- Vercel Analytics (built-in)
- Vercel Logs: `vercel logs --follow`
- Custom logging to external service (optional)

## Scaling Path

### Current: Serverless Functions
- ✅ Auto-scales with demand
- ✅ Pay per use
- ⚠️  Cold starts (~200-500ms)
- ⚠️  In-memory state per instance

### Future: Dedicated Backend
- ✅ Persistent connections
- ✅ Shared state (Redis)
- ✅ WebSocket support
- ✅ Real-time updates
- 💰 Fixed hosting cost

## Next Features

1. **Product Images**: Add image URLs to responses
2. **Inventory Alerts**: Notify when stock low
3. **Price History**: Track price changes
4. **Recommendations**: AI-powered product suggestions
5. **User Accounts**: Per-user API keys
6. **Webhooks**: Real-time Odoo → Vercel updates
7. **Analytics**: Track popular products/searches
8. **Multi-language**: Support multiple locales

---

**Status:** Ready for deployment after Odoo authentication is fixed! 🚀
