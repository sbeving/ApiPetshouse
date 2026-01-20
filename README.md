# Odoo API Proxy

A Next.js API proxy for Odoo Online that exposes REST endpoints for managing products and sales orders. This proxy handles authentication, rate limiting, and provides OpenAPI documentation.

## Features

- 🔐 **Authentication**: Bearer token and X-API-Key support
- 🚦 **Rate Limiting**: Configurable request rate limits
- 📝 **OpenAPI Documentation**: Interactive API documentation with Swagger UI
- 🔄 **Session Management**: Automatic Odoo session handling and cookie management
- 🎯 **REST Endpoints**: Simple REST API for Odoo operations
- ☁️ **Vercel Ready**: Optimized for deployment on Vercel

## Endpoints

### Products

- **GET /api/products** - List products from Odoo
  - Query params: `limit`, `offset`, `search`
  - Returns products from `product.template` model

### Orders

- **GET /api/orders** - List sales orders
  - Query params: `limit`, `offset`
  - Returns orders from `sale.order` model

- **POST /api/orders** - Create a new sales order
  - Body: `{ partner_id: number, order_lines: [{ product_id: number, quantity: number, price_unit?: number }] }`
  - Creates order in `sale.order` and lines in `sale.order.line`

- **POST /api/orders/:id/confirm** - Confirm a sales order
  - Confirms the order (changes state to 'sale')

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# Odoo Configuration
ODOO_URL=https://your-instance.odoo.com
ODOO_DB=your-database-name
ODOO_USERNAME=your-username
ODOO_PASSWORD=your-password

# API Authentication
API_BEARER_TOKEN=your-bearer-token-here
API_KEY=your-api-key-here

# Rate Limiting
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=60000
```

### 3. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000 for the home page and http://localhost:3000/api-docs for API documentation.

## Deployment

### Deploy to Vercel

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Set environment variables in Vercel dashboard or using CLI:
```bash
vercel env add ODOO_URL
vercel env add ODOO_DB
vercel env add ODOO_USERNAME
vercel env add ODOO_PASSWORD
vercel env add API_BEARER_TOKEN
vercel env add API_KEY
```

## Usage Examples

### Using Bearer Token

```bash
curl -H "Authorization: Bearer your-token" \
  http://localhost:3000/api/products?limit=5
```

### Using API Key

```bash
curl -H "X-API-Key: your-api-key" \
  http://localhost:3000/api/products?limit=5
```

### Create Order

```bash
curl -X POST \
  -H "Authorization: Bearer your-token" \
  -H "Content-Type: application/json" \
  -d '{
    "partner_id": 123,
    "order_lines": [
      {
        "product_id": 456,
        "quantity": 2,
        "price_unit": 99.99
      }
    ]
  }' \
  http://localhost:3000/api/orders
```

### Confirm Order

```bash
curl -X POST \
  -H "Authorization: Bearer your-token" \
  http://localhost:3000/api/orders/789/confirm
```

## Architecture

- **Next.js App Router**: Modern Next.js 13+ with App Router
- **TypeScript**: Full type safety
- **Odoo JSON-RPC Client**: Custom client with session management
- **Middleware Stack**: Authentication and rate limiting
- **OpenAPI Spec**: Generated from JSDoc comments

## Security

- All endpoints require authentication
- Rate limiting prevents abuse
- Credentials stored in environment variables
- Session cookies managed securely

## License

ISC