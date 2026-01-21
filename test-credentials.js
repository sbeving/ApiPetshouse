#!/usr/bin/env node
/**
 * Interactive Odoo Credential Tester
 * Tests various authentication scenarios
 */

require('dotenv').config();
const axios = require('axios');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function testAuth(url, db, username, password) {
  try {
    const response = await axios.post(
      `${url}/web/session/authenticate`,
      {
        jsonrpc: '2.0',
        params: { db, login: username, password },
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 15000,
      }
    );

    if (response.data.result && response.data.result.uid) {
      return { success: true, uid: response.data.result.uid, data: response.data.result };
    } else if (response.data.error) {
      return { success: false, error: response.data.error.message || 'Authentication error' };
    } else {
      return { success: false, error: 'No UID returned (credentials rejected)' };
    }
  } catch (err) {
    return { success: false, error: err.message };
  }
}

async function main() {
  console.log('🔐 Odoo Authentication Tester\n');
  console.log('This tool will help you test your Odoo credentials.\n');

  const url = process.env.ODOO_URL || 'https://pets-house.odoo.com';
  const db = process.env.ODOO_DB || 'pets-house';
  
  console.log('Configuration from .env:');
  console.log('  URL:', url);
  console.log('  DB:', db);
  console.log('  Username:', process.env.ODOO_USERNAME);
  console.log('  Password:', process.env.ODOO_PASSWORD ? '***' + process.env.ODOO_PASSWORD.slice(-3) : '(not set)');
  console.log('');

  // Test 1: Current .env credentials
  console.log('═══════════════════════════════════════');
  console.log('TEST 1: Testing .env credentials');
  console.log('═══════════════════════════════════════\n');
  
  const result1 = await testAuth(url, db, process.env.ODOO_USERNAME, process.env.ODOO_PASSWORD);
  
  if (result1.success) {
    console.log('✅ SUCCESS! Your .env credentials work!');
    console.log('   User ID:', result1.uid);
    console.log('   Username:', result1.data.username);
    console.log('\n🎉 No changes needed - your API should work now!');
    rl.close();
    return;
  } else {
    console.log('❌ FAILED:', result1.error);
    console.log('\nYour current .env password is NOT working.\n');
  }

  // Test 2: Manual entry
  console.log('═══════════════════════════════════════');
  console.log('TEST 2: Let\'s try manual entry');
  console.log('═══════════════════════════════════════\n');
  
  console.log('Please go to:', url);
  console.log('And verify you can log in with your credentials.\n');
  
  const tryManual = await question('Do you want to manually enter credentials to test? (yes/no): ');
  
  if (tryManual.toLowerCase() === 'yes' || tryManual.toLowerCase() === 'y') {
    const username = await question('Enter Odoo username (email): ');
    const password = await question('Enter Odoo password: ');
    
    console.log('\n📡 Testing...');
    const result2 = await testAuth(url, db, username.trim(), password.trim());
    
    if (result2.success) {
      console.log('\n✅ SUCCESS! These credentials work!');
      console.log('   User ID:', result2.uid);
      console.log('\n💾 Update your .env file with:');
      console.log(`   ODOO_USERNAME=${username.trim()}`);
      console.log(`   ODOO_PASSWORD=${password.trim()}`);
    } else {
      console.log('\n❌ FAILED:', result2.error);
      console.log('\n🔧 Troubleshooting:');
      console.log('  1. Verify you can log in at:', url);
      console.log('  2. Check for typos in username/password');
      console.log('  3. Check if 2FA is enabled (may block API access)');
      console.log('  4. Verify your account has API access rights');
      console.log('  5. Contact Odoo admin to check account status');
    }
  }

  console.log('\n═══════════════════════════════════════');
  console.log('Common Issues:');
  console.log('═══════════════════════════════════════');
  console.log('1. Wrong Password: Make sure you\'re using the current password');
  console.log('2. Account Locked: Too many failed attempts');
  console.log('3. 2FA Enabled: Two-factor auth may block API access');
  console.log('4. No API Rights: Account needs API access permissions');
  console.log('5. Wrong Database: Double-check database name');
  console.log('\n💡 Next Steps:');
  console.log('  → Reset password at:', url + '/web/reset_password');
  console.log('  → Contact Odoo support if account is locked');
  console.log('  → Check Settings → Users → Your User → Access Rights');

  rl.close();
}

main().catch(err => {
  console.error('Error:', err);
  rl.close();
});
