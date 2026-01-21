import Link from 'next/link';

export default function HomePage() {
  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Odoo API Proxy</h1>
      <p>
        This is a Next.js API proxy for Odoo Online with REST endpoints for managing
        products and orders.
      </p>
      
      <h2>Features</h2>
      <ul>
        <li>RESTful API endpoints</li>
        <li>JSON-RPC integration with Odoo Online</li>
        <li>Bearer token and X-API-Key authentication</li>
        <li>Rate limiting</li>
        <li>Session cookie management</li>
        <li>OpenAPI documentation</li>
      </ul>

      <h2>API Endpoints</h2>
      <ul>
        <li>
          <code>GET /api/products</code> - List products from Odoo
        </li>
        <li>
          <code>GET /api/orders</code> - List sales orders
        </li>
        <li>
          <code>POST /api/orders</code> - Create a new sales order
        </li>
        <li>
          <code>POST /api/orders/:id/confirm</code> - Confirm a sales order
        </li>
      </ul>

      <h2>Authentication</h2>
      <p>
        All endpoints require authentication using either:
      </p>
      <ul>
        <li>
          <strong>Bearer Token:</strong> Add{' '}
          <code>Authorization: Bearer YOUR_TOKEN</code> header
        </li>
        <li>
          <strong>API Key:</strong> Add <code>X-API-Key: YOUR_KEY</code> header
        </li>
      </ul>

      <div style={{ marginTop: '2rem' }}>
        <Link
          href="/api-docs"
          style={{
            display: 'inline-block',
            padding: '0.5rem 1rem',
            backgroundColor: '#0070f3',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '5px',
          }}
        >
          View API Documentation
        </Link>
      </div>
    </div>
  );
}
