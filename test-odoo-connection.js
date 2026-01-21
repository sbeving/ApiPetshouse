#!/usr/bin/env node

/**
 * Test Odoo connection
 * Usage: ODOO_URL=... ODOO_DB=... ODOO_USERNAME=... ODOO_PASSWORD=... node test-odoo-connection.js
 */

const axios = require('axios');

async function testOdooConnection() {
  console.log('🔍 Testing Odoo Connection...\n');
  
  const config = {
    url: process.env.ODOO_URL || 'https://pets-house.odoo.com',
    db: process.env.ODOO_DB || 'pets-house',
    username: process.env.ODOO_USERNAME || 'saleh.touil.3@gmail.com',
    password: process.env.ODOO_PASSWORD || 'f1a3e57d47e85fd6e3f3837417e20ba7a89f5e44',
  };

  console.log('Configuration:');
  console.log('  URL:', config.url);
  console.log('  DB:', config.db);
  console.log('  Username:', config.username);
  console.log('  Password:', '***' + config.password.slice(-4));
  console.log('');

  try {
    console.log('📡 Attempting authentication...');
    
    const response = await axios.post(`${config.url}/web/session/authenticate`, {
      jsonrpc: '2.0',
      params: {
        db: config.db,
        login: config.username,
        password: config.password,
      },
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    console.log('\n📦 Response Status:', response.status);
    console.log('📦 Response Data:', JSON.stringify(response.data, null, 2));

    if (response.data.error) {
      console.error('\n❌ Authentication Failed!');
      console.error('Error:', response.data.error);
      console.log('\n💡 Troubleshooting:');
      console.log('  1. Verify your Odoo URL is correct (should end with odoo.com)');
      console.log('  2. Check if your database name is correct');
      console.log('  3. For Odoo Online, you might need an API key instead of password');
      console.log('  4. Go to Odoo → Settings → API Keys to generate one');
      console.log('  5. The password field should be your actual password, not an API token');
      process.exit(1);
    }

    if (response.data.result && response.data.result.uid) {
      console.log('\n✅ Authentication Successful!');
      console.log('User ID:', response.data.result.uid);
      console.log('Session ID:', response.data.result.session_id);
      console.log('Username:', response.data.result.username);
      console.log('Company:', response.data.result.company_id);
      process.exit(0);
    } else {
      console.error('\n⚠️  Unexpected response format');
      console.error('Response:', response.data);
      process.exit(1);
    }

  } catch (error) {
    console.error('\n❌ Connection Error!');
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.error('No response received from server');
      console.error('Error:', error.message);
    } else {
      console.error('Error:', error.message);
    }

    console.log('\n💡 Common Issues:');
    console.log('  • Check if the Odoo URL is accessible');
    console.log('  • Verify network connectivity');
    console.log('  • For Odoo.com instances, ensure you\'re using the correct subdomain');
    console.log('  • Try logging in via browser first: ' + config.url);
    
    process.exit(1);
  }
}

testOdooConnection();
