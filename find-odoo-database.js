#!/usr/bin/env node
/**
 * Find Odoo database name by querying the database list
 */

require('dotenv').config();
const axios = require('axios');

async function findDatabase() {
  const url = process.env.ODOO_URL || 'https://pets-house.odoo.com';
  
  console.log('🔍 Looking for available databases...\n');
  console.log('Odoo URL:', url);
  console.log('');

  try {
    // Try to get database list
    console.log('📡 Querying /web/database/list...');
    
    const response = await axios.post(
      `${url}/web/database/list`,
      {
        jsonrpc: '2.0',
        method: 'call',
        params: {},
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      }
    );

    console.log('Response:', JSON.stringify(response.data, null, 2));

    if (response.data.result) {
      const databases = response.data.result;
      
      if (Array.isArray(databases) && databases.length > 0) {
        console.log('\n✅ Found databases:');
        databases.forEach((db, index) => {
          console.log(`  ${index + 1}. ${db}`);
        });
        
        console.log('\n💡 Update your .env file with the correct database name:');
        console.log(`   ODOO_DB=${databases[0]}`);
      } else {
        console.log('\n⚠️  Database list is empty or hidden');
        console.log('This is common for Odoo.com instances for security.');
      }
    }

  } catch (error) {
    console.log('\n⚠️  Cannot retrieve database list');
    console.log('This is normal for Odoo.com instances (they hide database names).');
    console.log('');
    console.log('🔧 For Odoo.com, the database name is usually your subdomain:');
    console.log('   URL: https://pets-house.odoo.com');
    console.log('   Database: "pets-house" (without .odoo.com)');
    console.log('');
    console.log('💡 Try these database names:');
    console.log('   1. pets-house');
    console.log('   2. petshouse');
    console.log('   3. Pets-House');
    console.log('   4. Your company name');
  }

  // Try to test login page
  console.log('\n📡 Testing login page access...');
  try {
    const loginPage = await axios.get(`${url}/web/login`, {
      timeout: 5000,
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    });
    
    // Look for database info in HTML
    const html = loginPage.data;
    const dbMatch = html.match(/data-db="([^"]+)"/);
    const dbInputMatch = html.match(/name="db"\s+value="([^"]+)"/);
    
    if (dbMatch) {
      console.log('✅ Found database in login page:', dbMatch[1]);
      console.log('\n💡 Use this in your .env:');
      console.log(`   ODOO_DB=${dbMatch[1]}`);
    } else if (dbInputMatch) {
      console.log('✅ Found database in form:', dbInputMatch[1]);
      console.log('\n💡 Use this in your .env:');
      console.log(`   ODOO_DB=${dbInputMatch[1]}`);
    } else {
      console.log('⚠️  Could not find database name in login page');
      console.log('    (This is normal for multi-database Odoo instances)');
    }
    
  } catch (err) {
    console.log('⚠️  Login page check failed:', err.message);
  }

  console.log('\n\n🎯 NEXT STEPS:');
  console.log('1. Visit:', url);
  console.log('2. Log in with your credentials');
  console.log('3. After login, check the URL or page source for database name');
  console.log('4. Look for Account Settings or System Info for database details');
  console.log('\nOR try authenticating with common database name patterns.');
}

findDatabase().catch(console.error);
