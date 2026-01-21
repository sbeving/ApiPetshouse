#!/usr/bin/env node
/**
 * Direct Odoo Connection Test - Reads from .env file
 */

require('dotenv').config();
const axios = require('axios');

async function testOdoo() {
  const config = {
    url: process.env.ODOO_URL,
    db: process.env.ODOO_DB,
    username: process.env.ODOO_USERNAME,
    password: process.env.ODOO_PASSWORD,
  };

  console.log('🔍 Testing Odoo Connection (from .env)...\n');
  console.log('Configuration:');
  console.log('  URL:', config.url);
  console.log('  DB:', config.db);
  console.log('  Username:', config.username);
  console.log('  Password:', '*'.repeat(config.password?.length || 0));
  console.log('');

  // Validate config
  if (!config.url || !config.db || !config.username || !config.password) {
    console.error('❌ Missing configuration! Check your .env file.');
    console.log('Required variables: ODOO_URL, ODOO_DB, ODOO_USERNAME, ODOO_PASSWORD');
    process.exit(1);
  }

  try {
    console.log('📡 Step 1: Testing server connectivity...');
    
    // Test if server is reachable
    try {
      await axios.get(config.url, { timeout: 5000 });
      console.log('✅ Server is reachable\n');
    } catch (err) {
      console.log('⚠️  Server response:', err.response?.status || 'No response');
      console.log('   (This is normal - testing authentication next)\n');
    }

    console.log('📡 Step 2: Attempting authentication...');
    
    const authResponse = await axios.post(
      `${config.url}/web/session/authenticate`,
      {
        jsonrpc: '2.0',
        params: {
          db: config.db,
          login: config.username,
          password: config.password,
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        timeout: 15000,
        validateStatus: () => true, // Accept any status
      }
    );

    console.log('\n📦 Response Status:', authResponse.status);
    console.log('📦 Response Headers:');
    console.log('   Content-Type:', authResponse.headers['content-type']);
    console.log('   Set-Cookie:', authResponse.headers['set-cookie'] ? 'Present' : 'None');
    
    console.log('\n📦 Response Data:');
    console.log(JSON.stringify(authResponse.data, null, 2));

    // Analyze response
    if (authResponse.data.error) {
      console.log('\n❌ AUTHENTICATION FAILED');
      console.log('Error Code:', authResponse.data.error.code);
      console.log('Error Message:', authResponse.data.error.message || authResponse.data.error.data?.message);
      
      console.log('\n🔧 Troubleshooting:');
      const errorStr = JSON.stringify(authResponse.data.error).toLowerCase();
      
      if (errorStr.includes('database')) {
        console.log('  ❌ Database name issue');
        console.log('     → Try: "pets-house" or check Odoo settings');
      }
      
      if (errorStr.includes('password') || errorStr.includes('denied') || errorStr.includes('access')) {
        console.log('  ❌ Incorrect username or password');
        console.log('     → Verify credentials by logging in at: ' + config.url);
        console.log('     → Make sure 2FA is not required');
      }
      
      if (errorStr.includes('user') || errorStr.includes('login')) {
        console.log('  ❌ User account issue');
        console.log('     → Account might be disabled or locked');
      }
      
      process.exit(1);
    }

    if (authResponse.data.result && authResponse.data.result.uid) {
      console.log('\n✅ SUCCESS! Authentication worked!');
      console.log('\n📋 Session Details:');
      console.log('   User ID (uid):', authResponse.data.result.uid);
      console.log('   Username:', authResponse.data.result.username);
      console.log('   Partner ID:', authResponse.data.result.partner_id);
      console.log('   Company ID:', authResponse.data.result.company_id);
      console.log('   Session ID:', authResponse.data.result.session_id || 'N/A');
      
      console.log('\n🎉 Your .env credentials are CORRECT!');
      console.log('   The API should now work properly.');
      
      return true;
    }

    // No uid in response
    console.log('\n⚠️  Unexpected Response Format');
    console.log('No UID found in result - this usually means:');
    console.log('  1. Wrong database name');
    console.log('  2. Credentials rejected');
    console.log('  3. Odoo instance configuration issue');
    console.log('\nPlease verify:');
    console.log('  → Can you log in at:', config.url);
    console.log('  → Is the database name correct?');
    
    process.exit(1);

  } catch (error) {
    console.log('\n❌ CONNECTION ERROR');
    
    if (error.code === 'ENOTFOUND') {
      console.log('DNS Error: Cannot resolve', config.url);
      console.log('→ Check the URL is correct');
    } else if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
      console.log('Timeout: Server not responding');
      console.log('→ Check firewall or VPN settings');
    } else if (error.response) {
      console.log('HTTP Error:', error.response.status);
      console.log('→ Server returned error:', error.response.statusText);
    } else {
      console.log('Error:', error.message);
    }
    
    console.log('\n🔧 Debug Info:');
    console.log('   Error Code:', error.code);
    console.log('   Error Type:', error.constructor.name);
    
    process.exit(1);
  }
}

// Run test
testOdoo()
  .then(() => {
    console.log('\n✓ Test completed successfully');
    process.exit(0);
  })
  .catch(err => {
    console.error('\n✗ Test failed:', err.message);
    process.exit(1);
  });
